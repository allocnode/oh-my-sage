# MCP 工具列表

共 32 个工具。创建和修改规则的工具需要配合 `mijia-automation` Skill。

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
