# 图校验兼容性验证

验证日期：2026-07-15。测试通过中枢网关原始 API 创建临时变量和临时规则；所有规则均使用通用变量节点，不包含家庭、设备或网络信息。测试完成后按前缀扫描，确认临时规则和变量均已删除。

## 结论

| 用例 | 网关保存/回读 | 延后触发后的目标值 | 校验器结论 |
|---|---|---:|---|
| `timeRange → logicOr → condition.condition` | 成功 | `1` | 有效，应允许 |
| `timeRange → logicAnd → condition.condition` | 成功 | `1` | 有效，应允许 |
| `timeRange → logicNot → condition.condition` | 成功 | unmet 分支写入 `1` | 有效，应允许 |
| `condition.condition` 无来源 | 成功 | `0` | 无运行效果，保持 error |
| `varGet.output2 → timeRange.trigger` | 成功 | `0` | state 不消费事件，保持 error |
| `varGet.output2 → varSetNumber.input` | 成功 | `1` | event 输入有效，作为对照 |

## 最小复现方法

每个运行用例都在规则启动完成后执行以下步骤，避免把 state 节点初始化输出误认为 incoming 事件的效果：

1. 将目标变量重置为 `0`。
2. 修改独立触发变量，使 `varChange` 发出事件。
3. 等待规则执行后读取目标变量。

### 合法条件组合

```text
varChange.output → condition.trigger
timeRange.output → logicOr.input0/input1
logicOr.output → condition.condition
condition.met → varSetNumber.input
```

目标变量由 `0` 变为 `1`，证明 `timeRange` 经过逻辑节点提供条件值具有实际运行语义。

同样的延后触发方法也验证了 `logicAnd`：两个全天时间段同时为真时 met 分支写入 `1`。`logicNot` 使用全天为真的时间段，取反后由 unmet 分支写入 `1`。因此三种逻辑节点均有运行证据。

### 缺失 condition 来源

```text
varChange.output → condition.trigger
condition.condition ← 无来源
condition.met → varSetNumber.input
```

网关接受并完整回读规则，但延后触发后目标变量保持 `0`，因此不能仅凭“可保存”放宽校验。

### output2 到 state 与 event 的对照

```text
# 无效
varChange.output → varGet.input
varGet.output2 → timeRange.trigger
timeRange.output → varSetNumber.input

# 有效对照
varChange.output → varGet.input
varGet.output2 → varSetNumber.input
```

两个规则均能保存和回读。启动后重置目标变量并触发：state 目标保持 `0`，event 目标变为 `1`。这说明网关不校验连接语义，但 `output2 → state` 没有可观察的运行效果，应继续作为 error。
