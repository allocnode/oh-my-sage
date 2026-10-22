<#
.SYNOPSIS
  将 oh-my-sage MCP Server 安装为本机常驻服务（Windows，HTTP 模式，仅监听 127.0.0.1）。

.DESCRIPTION
  注册一个当前用户登录时启动的计划任务，后台无窗口运行（无需管理员权限）：
    node <仓库>/dist/mcp/mcp/index.js --http
  进程退出后一分钟内自动重新拉起。网关登录一次后，客户端重启无需重新输入登录码。
  配置（GATEWAY_URL、MCP_AUTH_TOKEN 等）写入 %LOCALAPPDATA%\oh-my-sage\<TaskName>.env，
  由 node --env-file 读取（需要 Node.js 20.6+）。

.EXAMPLE
  npm run build:mcp
  pwsh deploy/install-local.ps1 -GatewayUrl http://192.168.0.5
  pwsh deploy/install-local.ps1 -GatewayUrl http://192.168.0.5 -Port 3791 -Token (openssl rand -hex 32)
  pwsh deploy/install-local.ps1 -Uninstall
#>
[CmdletBinding()]
param(
  [string]$GatewayUrl = $env:GATEWAY_URL,
  [string]$Token = '',
  [ValidateRange(1, 65535)][int]$Port = 3790,
  [string]$TaskName = 'oh-my-sage-mcp',
  [switch]$Uninstall
)

$ErrorActionPreference = 'Stop'
$envFile = Join-Path $env:LOCALAPPDATA "oh-my-sage\$TaskName.env"

# 停止计划任务并结束 node 进程（停止任务不会结束 conhost 启动的子进程，按配置文件路径识别）
function Stop-Server {
  if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) { Stop-ScheduledTask -TaskName $TaskName }
  Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
    Where-Object { $_.CommandLine -and $_.CommandLine.Contains($envFile) } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}

# ==================== 卸载 ====================
if ($Uninstall) {
  Stop-Server
  if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "已删除计划任务 $TaskName"
  } else {
    Write-Host "未找到计划任务 $TaskName"
  }
  Remove-Item -LiteralPath $envFile -ErrorAction SilentlyContinue
  return
}

# ==================== 前置检查 ====================
$repo = Split-Path -Parent $PSScriptRoot
$entry = Join-Path $repo 'dist\mcp\mcp\index.js'
if (-not (Test-Path -LiteralPath $entry)) { throw "未找到 $entry，请先在仓库根目录执行 npm run build:mcp" }
$node = (Get-Command node -ErrorAction Stop).Source
$nodeVersion = [version]((& $node -v).TrimStart('v'))
if ($nodeVersion -lt [version]'20.6.0') { throw "需要 Node.js 20.6 或更高版本（当前 $nodeVersion）" }
if (-not $GatewayUrl) { Write-Warning '未设置 -GatewayUrl：首次调用 mijia_auth 时需要传 gateway_url' }

# ==================== 写入配置 ====================
$lines = @('MCP_HTTP_HOST=127.0.0.1', "MCP_HTTP_PORT=$Port")
if ($GatewayUrl) { $lines += "GATEWAY_URL=$GatewayUrl" }
if ($Token) { $lines += "MCP_AUTH_TOKEN=$Token" }
New-Item -ItemType Directory -Force -Path (Split-Path $envFile) | Out-Null
# 必须无 BOM，否则第一行变量名会带上 U+FEFF
[IO.File]::WriteAllText($envFile, ($lines -join "`n") + "`n", [Text.UTF8Encoding]::new($false))

# ==================== 注册计划任务 ====================
# conhost --headless：后台运行，不弹出控制台窗口，无需管理员权限。
# 每分钟重复触发 + IgnoreNew 充当看门狗：进程在运行时忽略，退出后一分钟内重新拉起。
$conhost = Join-Path $env:SystemRoot 'System32\conhost.exe'
$action = New-ScheduledTaskAction -Execute $conhost -WorkingDirectory $repo `
  -Argument "--headless `"$node`" --env-file=`"$envFile`" `"$entry`" --http"
$user = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$triggers = @(
  New-ScheduledTaskTrigger -AtLogOn -User $user
  New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1)
)
$principal = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -MultipleInstances IgnoreNew `
  -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Stop-Server
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $triggers -Principal $principal `
  -Settings $settings -Description 'oh-my-sage MCP Server (HTTP, 127.0.0.1)' -Force | Out-Null
Start-ScheduledTask -TaskName $TaskName

# ==================== 健康检查 ====================
$url = "http://127.0.0.1:$Port"
$ok = $false
foreach ($i in 1..20) {
  Start-Sleep -Milliseconds 500
  try { Invoke-RestMethod "$url/healthz" -TimeoutSec 2 | Out-Null; $ok = $true; break } catch { }
}
if (-not $ok) { throw "服务未在 $url/healthz 响应。可手动运行排查：node --env-file=`"$envFile`" `"$entry`" --http" }
Write-Host "已启动：$url/mcp（计划任务 $TaskName，登录时自动运行）"

# ==================== 客户端配置 ====================
$headers = if ($Token) { ",`n      `"headers`": { `"Authorization`": `"Bearer $Token`" }" } else { '' }
Write-Host @"

OpenCode（opencode.json）：
{
  "mcp": {
    "oh-my-sage": {
      "type": "remote",
      "url": "$url/mcp",
      "oauth": false$headers
    }
  }
}

其他支持 Streamable HTTP 的客户端：
{
  "mcpServers": {
    "oh-my-sage": {
      "url": "$url/mcp"$headers
    }
  }
}
"@
