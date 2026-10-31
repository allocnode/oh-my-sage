# 规则文本格式

读写已有规则时，推荐使用这种紧凑文本格式代替节点 JSON。一行写一个节点，固定内容（节点类型名、版本、设备 URN、输入端口声明、输出端口声明、比较类型 dtype、动态变量的取值范围等）由服务端自动补全。

实测 40 条规则（795 个节点）都能做到「JSON 转文本再转回 JSON」完全一致。文本体积约为 `mijia_get_graph` 默认 JSON 摘要的一半，写入时只需写有意义的部分，通常是同等 JSON 的五分之一左右。

## 哪里用到

| 用途 | 方式 |
|---|---|
| 读取规则 | `mijia_get_graph {id, format:"text"}` |
| 只看某几个节点及其上下游 | `mijia_get_graph {id, focus:["saveVol"], depth:1}` |
| 新增、替换节点 | `mijia_patch_graph {id, baseHash, add:"...", replace:"..."}` |
| 整条规则替换 | `mijia_put_graph_text {id, baseHash, text}`，或本地 `scripts/rules.mjs push` |
| 跨规则查询的返回结果 | `mijia_query_rules` 的 `lines` |
| 写入后的改动明细 | `mijia_patch_graph` 返回的 `diff` |

## 节点写法

```text
节点ID  类型简写  参数  [+{差异}]  [-> 连线]
```

| 写法 | 对应节点 |
|---|---|
| `a in <设备> 2/1 = true [preload]` | deviceInput（属性） |
| `a in <设备> 3.e1012 [args=[...]] [preload]` | deviceInput（事件） |
| `a get <设备> 2/1 = false` | deviceGet |
| `a set <设备> 2/2 = 30` | deviceOutput 写常量 |
| `a set <设备> 2/2 = $m2Bright` | deviceOutput 写变量（自动补 dtype 与 min/max/step） |
| `a do <设备> 7.a3 [{"piid":1,"value":"你好"}]` | deviceOutput 执行动作 |
| `a getvar <设备> 2/1 $R.savedVol` | deviceGetSetVar |
| `a vget $sleepMode = 1` | varGet |
| `a vchange $homeArrival = 1 [preload]` | varChange |
| `a vset $R.ms = "now()-{{$R.at}}"` | varSetNumber |
| `a sset $R.text = "缺水啦，{{$R.name}}"` | varSetString |
| `a delay 1.5s` / `a last 5s` / `a loop 2min` | delay / statusLast / loop |
| `a ntimes 1` / `a counter 3` | onlyNTimes / counter |
| `a range 16:00:00-20:59:59 [days=1,2,3]` | timeRange（缺省为每天） |
| `a at 21:00:00` | alarmClock 定时 |
| `a sunset -30 @30.0,120.0` / `a sunrise +30 @...` | alarmClock 日落/日出（偏移单位为分钟） |
| `a condition`、`a signalOr`、`a onLoad` 等 | 没有参数的节点直接写类型名 |

- **设备**可以写 did，也可以写设备名称（名称含空格时加双引号）。名称不唯一时会报错并列出候选。
- **比较**支持 `=`、`!=`、`>`、`>=`、`<`、`<=`、`include [1,2]`、`between 1 5`。
- **变量**：`$名` 是全局变量，`$R.名` 是本规则变量，`$作用域.名` 是其他作用域的变量。
- **时长**单位：`ms`、`s`、`min`、`h`。

## 连线

```text
slp vget $sleepMode = 1 -> on | cond
range range 16:00:00-20:59:59 -> cond.condition
wait delay 1.5s -> speak, restDelay
```

- `|` 分隔第一、第二个输出端口：varGet/deviceGet 是 `output | output2`，condition 是 `met | unmet`。
- 逗号分隔同一端口的多个目标。
- 目标只写节点 ID 时，自动使用目标的默认输入端口：delay、varGet、varSet 等为 `input`，deviceOutput、condition 为 `trigger`，loop 为 `start`，onlyNTimes/counter 为 `input`，register 为 `setTrue`。
- 其他端口必须写明，例如 `cond.condition`、`loopL.stop`、`or1.input1`、`ntimes1.zero`。
- 少见的输出端口用 `端口名: 目标` 的写法。

## 备注

```text
<<< note1
**用途**
- 傍晚有人在客厅时自动开灯。

**变更**
- 2026-10-31 - 新增回家开门开灯。
>>>
```

整行粗体是段落标题，`- ` 开头是列表项。备注里出现其他富文本格式时，服务端会改用差异或原始 JSON 表示该节点，保证不丢内容。

修改备注推荐用 `mijia_patch_graph` 的 `note` 操作，不必重写全文：

```json
[
  {"section": "陷阱", "append": "改睡眠时间要同时改 at22 和 eveRange"},
  {"replace": "30 分钟", "with": "15 分钟"},
  {"changelog": "2026-10-31 - 换气改为 15 分钟"}
]
```

## 差异与兜底

简写无法完整表达某个节点时，行尾会出现 `+{...}`，里面是该节点与简写默认值不同的字段（值为 `null` 表示删除该字段）。例如旧版本规则：

```text
odd set lamp1 2/1 = false +{"cfg":{"version":0}}
```

完全无法简写的节点写成 `节点ID raw {完整JSON}`。写入时这两种都会原样保留。

## 变量声明与宏

```text
var $R.at number 0 "清空时间"
@pulse arr $homeArrival hold=3min -> next
@tts hi 客厅音箱 volume=50 text=$R.sayText restore=40s -> after
```

- `var`：写入前若变量不存在就创建，已存在且类型一致时跳过。写入失败会删除本次新建的变量。
- `@pulse 前缀 $变量 hold=时长`：变量先置 0 再置 1（保证 varChange 收到变化），保持一段时间后回 0。展开为 `arr`、`arrOn`、`arrHold`、`arrOff` 四个节点。
- `@tts 前缀 音箱 volume=数值或$变量 text="文本"或$变量 [restore=40s]`：记住原音量、设置音量、等待 1.5 秒、播报，同时开始恢复计时，到时恢复原音量。展开为六个节点，并声明 `$R.前缀Vol`。音量属性和播放文本动作按设备能力自动查找。

宏只是写入时的展开，网关里保存的仍是普通节点，读回来时显示为展开后的节点。

## 规则文件同步

MCP 服务可能运行在其他机器上，读不到本机文件，所以同步脚本在本机运行，通过 HTTP 调用 MCP：

```bash
export OH_MY_SAGE_URL=http://127.0.0.1:3790/mcp
export OH_MY_SAGE_TOKEN=<MCP_AUTH_TOKEN>

node scripts/rules.mjs pull                 # 拉取全部规则到 ./rules/<规则ID>.rule
node scripts/rules.mjs push rules/123.rule --dry-run   # 预览改动
node scripts/rules.mjs push rules/123.rule  # 写入，并用网关返回的规范文本刷新本地文件
node scripts/rules.mjs status               # 检查网关上的规则是否被改过
```

文件头记录了规则 ID 和拉取时的 hash。网关上的规则在此期间被改过（例如在米家 App 里改过）时，push 会拒绝写入，需要先重新 pull。

建议把 `rules/` 放进一个私有 git 仓库：写入前能看清 diff，改坏了也能退回。规则文件里有设备 ID，不要提交到公开仓库。
