<div align="center">

# Oh My Sage

**用说话的方式，创建和修改米家自动化极客版规则**

[![npm](https://img.shields.io/npm/v/oh-my-sage-mcp?label=npm)](https://www.npmjs.com/package/oh-my-sage-mcp)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

</div>

![一句话需求，AI 读设备、给方案、校验后写入网关](docs/images/web-create.webp)

## 安装

需要 [Node.js](https://nodejs.org/) 20+，米家中枢网关已开启「自动化极客版」。

```bash
npx -y add-mcp oh-my-sage-mcp -g -n oh-my-sage --env GATEWAY_URL=http://<网关 IP>
npx -y skills add allocnode/oh-my-sage --skill mijia-automation -g
```

勾选你的 AI Agent，重启它，然后说：

```
帮我连接米家网关，登录码是 <登录码>
```

网关 IP 和 6 位登录码都在米家 App →「中枢网关」→「···」→「自动化极客版」页面。登录码只能用一次。

## 能做什么

- **新建规则**：「客厅有人的时候自动开灯，晚上别太亮」
- **精确修改**：「冰箱门提醒最高音量从 60 降到 50，其他别动」
- **查引用**：「哪些规则用到了玄关灯？」
- **查故障**：「回家开灯昨晚为什么没触发？」
- **整理排版**：「离家规则的卡片乱成一团，整理一下」

写入前固定校验连线和设备能力，不通过就不写。支持 Claude Code、Cursor、OpenCode、Codex、TRAE、Qoder、通义灵码、Kimi Code 等任何 MCP 客户端。

## 更多

- [常驻服务与 NAS 部署](deploy/README.md)：网关只登录一次，多个 AI Agent / 多台电脑共用
- [网页版](docs/web.md)：不用 AI Agent，浏览器里直接聊
- [工具列表](docs/tools.md) · [规则文本格式](docs/rule-text-format.md) · [更新记录](https://github.com/allocnode/oh-my-sage/releases)

## License

[MIT](LICENSE)
