
<div align="center">

# Oh My Sage

**用说话的方式，创建和修改米家自动化极客版规则**

[![npm](https://img.shields.io/npm/v/oh-my-sage-mcp?label=npm)](https://www.npmjs.com/package/oh-my-sage-mcp)
[![MCP](https://img.shields.io/badge/MCP-32_tools-6366f1)](#mcp-工具列表)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

</div>

![网页版：一句话需求，Agent 读设备、给方案、校验后写入网关](docs/images/web-create.webp)

Oh My Sage 直接连接局域网里的米家中枢网关。你说想要什么效果，它去读你家的设备和已有规则，给出方案，你确认后自动校验并写进网关，在米家 App 的极客版里立刻能看到。

可以在任何支持 MCP 的 **AI Agent** 里用（腾讯 WorkBuddy、TRAE、Qoder、通义灵码、Kimi Code、Claude Code、Cursor、OpenCode、Codex 等），也可以打开**自带的网页版**直接聊天。

## 它能做什么

| 你说 | 它会做什么 |
|------|-----------|
| *「客厅有人的时候自动开灯，晚上别太亮」* | 找到人体传感器和灯，读出它们支持的属性，给出两三个方案让你选，选完校验并创建规则 |
| *「冰箱门提醒太吵了，最高音量从 60 降到 50，其他别动」* | 在全部规则里定位那一个节点，只改这一行，其余节点原样保留 |
| *「哪些规则用到了玄关灯？」* | 扫描所有规则，列出引用这个设备的规则和节点 |
| *「回家开灯昨晚为什么没触发？」* | 读网关执行日志，告诉你流程停在了哪个节点 |
| *「离家规则的卡片乱成一团，整理一下」* | 检查重叠和穿过卡片的连线，按连接关系重新排版 |
| *「sleepMode 这个变量没用了，删掉」* | 先扫描全部规则，还有规则在用就拒绝，并告诉你是哪几条 |

第一项网页版和 AI Agent 都能做，其余几项目前只在 AI Agent 里提供。

---

## 快速开始

### 准备

1. 一台米家中枢网关，在米家 App 里开启「自动化极客版」。
2. 网关的局域网 IP：米家 App → 中枢网关（多个时选主中枢）→ 右上角「···」→「自动化极客版」，页面上能看到。同一个页面还会显示 **6 位登录码**，连接时再来取，它只能用一次。
3. [Node.js](https://nodejs.org/) 20 或更高版本，终端里运行 `node -v` 能看到版本号即可。

### 安装（两条命令）

把 `<网关 IP>` 换成你的网关 IP，在终端里依次运行：

```bash
npx -y add-mcp oh-my-sage-mcp -g -n oh-my-sage --env GATEWAY_URL=http://<网关 IP>
npx -y skills add allocnode/oh-my-sage --skill mijia-automation -g
```

- 第一条把 MCP Server 加进 AI Agent 的配置，会列出你电脑上装的 AI Agent，勾选要用的那几个。
- 第二条安装规则 Skill，AI 创建和修改规则时要参考它，同样勾选你的 AI Agent。

装完重启 AI Agent，在米家 App 里取一个新的登录码，对它说：

```
帮我连接米家网关，登录码是 <登录码>
```

连上以后直接提需求，比如「客厅有人的时候自动开灯，晚上别太亮」。

<details>
<summary><b>列表里没有我的 AI Agent？手动添加配置</b></summary>

在 AI Agent 的 MCP 设置里选「手动添加」或「编辑 JSON」，粘贴：

```json
{
  "mcpServers": {
    "oh-my-sage": {
      "command": "npx",
      "args": ["-y", "oh-my-sage-mcp"],
      "env": { "GATEWAY_URL": "http://<网关 IP>" }
    }
  }
}
```

不支持 Skill 的 AI Agent，可以把 [SKILL.md](.agents/skills/mijia-automation/SKILL.md) 的内容贴进它的规则文件（比如 `AGENTS.md`）。其他客户端的写法见 [部署指南](deploy/README.md#客户端配置)。

</details>

### 不想每次重启都输登录码

上面的方式由 AI Agent 按需启动 MCP Server，AI Agent 一退出连接就断了。改成常驻服务后，网关只登录一次，所有 AI Agent 共用。

![三种部署方式：按需启动、本机常驻、私有服务器](docs/images/deploy.webp)

**本机常驻**（自己一台电脑用）：

```bash
npm install -g oh-my-sage-mcp

# Windows（PowerShell，不需要管理员权限）
powershell -ExecutionPolicy Bypass -File "$(npm root -g)/oh-my-sage-mcp/deploy/install-local.ps1" -GatewayUrl "http://<网关 IP>"
# macOS / Linux
bash "$(npm root -g)/oh-my-sage-mcp/deploy/install-local.sh" -g "http://<网关 IP>"

# 把 AI Agent 的配置换成连接这个服务
npx -y add-mcp http://127.0.0.1:3790/mcp -g -n oh-my-sage
```

服务开机登录后自动运行，只对本机开放。

**私有服务器 / NAS**（几台电脑共用，或者用豆包工作这类云端 AI Agent）：在服务器上用 Docker 部署，步骤见 [部署指南](deploy/README.md#方式三私有服务器docker)。部署好后，每台电脑运行：

```bash
npx -y add-mcp http://<服务器 IP>:3790/mcp -g -n oh-my-sage --header "Authorization: Bearer <访问密码>"
```

### 升级与卸载

| 用法 | 升级 | 卸载 |
|------|------|------|
| 按需启动 | 自动，每次启动都会用 npm 上的最新版 | 删掉 AI Agent 配置里的 `oh-my-sage` |
| 本机常驻 | `npm install -g oh-my-sage-mcp`，再运行一次安装脚本 | 安装脚本加 `-Uninstall`（Windows）或 `-u` 运行，再 `npm uninstall -g oh-my-sage-mcp` |
| 私有服务器 | 见 [部署指南](deploy/README.md#方式三私有服务器docker) | 在 `deploy` 目录运行 `docker compose down` |

Skill 升级：`npx -y skills update mijia-automation -g`；卸载：`npx -y skills remove mijia-automation -g`。每个版本的改动见 [Releases](https://github.com/allocnode/oh-my-sage/releases)。

### 网页版

<details>
<summary><b>不用 AI Agent，在浏览器里直接聊（需要自己的大模型 API Key）</b></summary>

![网页版：Agent 读完设备后给出两个方案供选择](docs/images/web-options.webp)

网页版要下载仓库运行，需要 [Git](https://git-scm.com/)：

```bash
git clone https://github.com/allocnode/oh-my-sage.git
cd oh-my-sage
npm install
cp .env.example .env    # Windows PowerShell：Copy-Item .env.example .env
```

编辑 `.env`，填好这四项：

```env
LLM_BASE_URL=https://api.deepseek.com/v1
LLM_MODEL=deepseek-flash
LLM_API_KEY=<你的 API Key>
GATEWAY_URL=http://<网关 IP>
```

| 服务商 | `LLM_BASE_URL` | `LLM_MODEL` 示例 |
|--------|----------------|-----------------|
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-flash` |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen3.8-flash` |
| Kimi | `https://api.moonshot.cn/v1` | `kimi-k3.1-pro` |
| 智谱 GLM | `https://open.bigmodel.cn/api/paas/v4` | `glm-5.3-flashx` |
| 豆包（火山方舟） | `https://ark.cn-beijing.volces.com/api/v3` | `doubao-seed-2-1-pro-260628` |
| OpenAI | `https://api.openai.com/v1` | `gpt-6.1-terra` |
| 本地 Ollama | `http://localhost:11434/v1` | 你已拉取的模型名 |

任何 OpenAI 兼容接口都可以。然后运行 `npm run dev`，浏览器打开 http://localhost:3000 ，输入登录码即可。长期使用可以 `npm run build` 后用 `npm start` 启动。更新：`git pull`、`npm install` 后重启。

网页版没有账号系统，不要把它暴露到公网。

</details>

---

## 写入前一定校验

![展开的执行过程：思考、结构校验、设备能力校验、创建规则](docs/images/web-process.webp)

写入网关之前固定做两项检查，任意一项不通过就不写入，并把原因交给 AI 修正：

- **结构校验**：节点之间的连线是否完整，端口是否接对
- **设备能力校验**：按设备真实的 MIOT Spec 核对属性是否存在、能不能写、取值是否在范围内，引用的变量是否存在

读写规则用一行一个节点的紧凑文本，设备直接写名称，修改只提交变化的几行，并带上读取时的 hash，规则在这期间被改过就拒绝写入：

```text
t   at 20:00:00 -> chk
chk get 客厅吸顶灯 2/1 = true -> off
off set 客厅吸顶灯 2/1 = false
```

完整语法见 [规则文本格式](docs/rule-text-format.md)。

## MCP 工具列表

共 32 个工具。创建和修改规则的工具需要配合 `mijia-automation` Skill。

<details>
<summary><b>展开完整工具列表</b></summary>

<table>
  <thead>
    <tr><th>分类</th><th>工具</th><th>描述</th></tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">连接</td>
      <td><code>mijia_auth</code></td>
      <td>连接米家网关（需 6 位一次性登录码；已连接时无需再次认证。<code>reconnect=true</code> 更换网关或重新登录，新连接成功后才替换原连接）</td>
    </tr>
    <tr>
      <td><code>mijia_disconnect</code></td>
      <td>断开网关连接（共享连接下所有客户端都会断开，需要新的登录码才能重连）</td>
    </tr>
    <tr>
      <td><code>mijia_status</code></td>
      <td>检查连接状态（<code>verify=true</code> 实际询问网关一次，确认连接可用）</td>
    </tr>
    <tr>
      <td rowspan="3">设备</td>
      <td><code>mijia_get_devices</code></td>
      <td>获取设备列表</td>
    </tr>
    <tr>
      <td><code>mijia_get_device</code></td>
      <td>设备详情 + MIOT Spec 能力（默认精简摘要，<code>detail=full</code> 取完整对象，<code>siids</code> 只看指定服务）</td>
    </tr>
    <tr>
      <td><code>mijia_find_device_usage</code></td>
      <td>一次扫描全部规则，找出引用指定设备的规则和节点，并列出残留引用</td>
    </tr>
    <tr>
      <td rowspan="13">规则</td>
      <td><code>mijia_get_graphs</code></td>
      <td>获取规则列表</td>
    </tr>
    <tr>
      <td><code>mijia_get_graph</code></td>
      <td>获取规则详情（<code>format=text</code> 返回紧凑文本，<code>focus</code> 只看相关节点，<code>ifNoneMatch</code> 未变化时只回 hash；返回 <code>hash</code>）</td>
    </tr>
    <tr>
      <td><code>mijia_create_graph</code></td>
      <td>创建规则，可同时创建本规则变量</td>
    </tr>
    <tr>
      <td><code>mijia_patch_graph</code></td>
      <td>增量修改（修改首选）：一次调用完成文本新增/替换、合并、删除、备注操作和建变量，写入前双重校验，只返回改动明细</td>
    </tr>
    <tr>
      <td><code>mijia_put_graph_text</code></td>
      <td>用一份完整紧凑文本替换规则，供本地规则文件同步脚本使用</td>
    </tr>
    <tr>
      <td><code>mijia_query_rules</code></td>
      <td>在服务端按变量、设备、节点类型跨规则查询，只返回命中的节点</td>
    </tr>
    <tr>
      <td><code>mijia_get_log</code></td>
      <td>读取执行日志并在服务端按规则、节点、时间过滤，可只返回各节点执行次数</td>
    </tr>
    <tr>
      <td><code>mijia_update_graph</code></td>
      <td>整图替换（兼容保留）</td>
    </tr>
    <tr>
      <td><code>mijia_delete_graph</code></td>
      <td>删除规则，并清理对应的本规则变量</td>
    </tr>
    <tr>
      <td><code>mijia_toggle_graph</code></td>
      <td>启用/禁用规则</td>
    </tr>
    <tr>
      <td><code>mijia_validate_graph</code></td>
      <td>校验结构完整性（可传已保存规则的 <code>id</code>）</td>
    </tr>
    <tr>
      <td><code>mijia_check_layout</code></td>
      <td>只读检查卡片布局：重叠、可能重叠、穿卡连线和交叉估计；可预览挪动或重排的效果</td>
    </tr>
    <tr>
      <td><code>mijia_validate_graph_capabilities</code></td>
      <td>按真实 MIOT Spec 校验设备能力和变量引用（可传 <code>id</code>，结果看 <code>valid</code> 字段）</td>
    </tr>
    <tr>
      <td rowspan="6">草稿</td>
      <td><code>mijia_graph_draft_begin</code></td>
      <td>开始草稿（超过 10 个节点时分块上传，30 分钟后过期）</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_append</code></td>
      <td>追加一批节点（每批最多 25 个）</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_edit</code></td>
      <td>按节点 ID 替换、增加或删除草稿节点</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_status</code></td>
      <td>查看草稿状态</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_commit</code></td>
      <td>校验并提交草稿，创建规则</td>
    </tr>
    <tr>
      <td><code>mijia_graph_draft_discard</code></td>
      <td>丢弃草稿（不删除已创建的规则）</td>
    </tr>
    <tr>
      <td rowspan="6">变量</td>
      <td><code>mijia_get_variables</code></td>
      <td>获取变量列表</td>
    </tr>
    <tr>
      <td><code>mijia_get_variable_value</code></td>
      <td>获取单个变量的当前值</td>
    </tr>
    <tr>
      <td><code>mijia_get_variable_config</code></td>
      <td>获取单个变量的配置</td>
    </tr>
    <tr>
      <td><code>mijia_create_variable</code></td>
      <td>创建变量（id 只能是字母数字）</td>
    </tr>
    <tr>
      <td><code>mijia_set_variable</code></td>
      <td>设置变量值</td>
    </tr>
    <tr>
      <td><code>mijia_delete_variable</code></td>
      <td>删除变量（仍被规则引用时拒绝删除）</td>
    </tr>
    <tr>
      <td>维护</td>
      <td><code>mijia_call_api</code></td>
      <td>直接调用网关原始 API，仅限白名单内的只读方法，用于排障</td>
    </tr>
  </tbody>
</table>

</details>

## 安全说明

- **只在局域网里连网关**，通信用网关自己的登录码认证和加密，不经过云端。唯一的公网请求是校验设备能力时从 `miot-spec.org` 读取设备型号的公开定义；网页版另外会把对话发给你配置的大模型接口。
- **常驻服务监听非本机地址时必须设置访问密码**（`MCP_AUTH_TOKEN`），否则拒绝启动。
- **排障用的 `mijia_call_api` 只开放只读方法**，不能绕过校验写网关。
- **删除前有检查**：变量还被规则使用时拒绝删除；删除规则时一起清理它自己的变量。

## 常见问题

**登录码提示错误，但我确定没输错？**
登录码只能用一次，不管成功还是失败，用过就作废了。取一个新的再试。

**AI Agent 里看不到 oh-my-sage，或者显示连接失败？**
终端里运行 `npx -y oh-my-sage-mcp --version`。能打印版本号，问题在 AI Agent 的配置；报错的话，多半是 Node.js 低于 20，或者访问不了 npm。

**连不上网关？**
确认电脑（或服务器）和网关在同一个局域网，地址是 `http://` 加网关 IP，并且「自动化极客版」已开启。

**AI 说创建规则需要 Skill？**
运行安装里的第二条命令，再重启 AI Agent。

---

## 参与贡献

欢迎提 Issue 和 Pull Request。提交前请运行 `npm run lint` 和 `npm run test:unit`，测试不会连接真实网关。

```
.agents/skills/mijia-automation/  规则 Skill
src/core/     共用核心：网关客户端、工具、校验、排版
src/mcp/      MCP Server（stdio / Streamable HTTP）
src/app/ src/components/ src/server/  网页版
deploy/       常驻服务脚本与 Docker，见 deploy/README.md
```

更多文档：[部署指南](deploy/README.md) · [规则文本格式](docs/rule-text-format.md) · [网关参考](ref/GUIDE.md)

## License

[MIT](LICENSE)

## 致谢

[Vercel AI SDK](https://sdk.vercel.ai/) · [Next.js](https://nextjs.org/) · [Ant Design](https://ant.design/) · [Model Context Protocol](https://modelcontextprotocol.io/)
