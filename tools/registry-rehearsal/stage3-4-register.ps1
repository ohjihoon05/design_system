# Stage 3-4 step 2: (re)register WonikVerdaccio so it runs WHETHER LOGGED ON OR NOT.
# The no-password schtasks path gave LogonType=Interactive (only when logged on),
# which fails the reboot/logout test. Storing the password -> LogonType=Password ->
# runs at boot before login, and loads the full user env so npx/node resolve.
$task = 'WonikVerdaccio'
$bat  = Join-Path $PSScriptRoot 'stage3-4-service-launcher.bat'

# stop + remove any existing task (the Interactive one we made earlier)
try { schtasks /end /tn $task 2>$null | Out-Null } catch {}
try { Unregister-ScheduledTask -TaskName $task -Confirm:$false -ErrorAction Stop | Out-Null } catch {}

Write-Host ''
Write-Host '  A secure password dialog will appear.'
Write-Host '  Type THIS Windows account login password (so it can run while logged off).'
$cred = Get-Credential -UserName ("$env:USERDOMAIN\$env:USERNAME") -Message 'Windows account password (run whether logged on or not)'

$action   = New-ScheduledTaskAction -Execute $bat
$trigger  = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

try {
    Register-ScheduledTask -TaskName $task -Action $action -Trigger $trigger `
        -User $cred.UserName -Password $cred.GetNetworkCredential().Password `
        -RunLevel Limited -Settings $settings -Force -ErrorAction Stop | Out-Null
    $lt = (Get-ScheduledTask -TaskName $task).Principal.LogonType
    Write-Host ''
    Write-Host ('  OK - registered. LogonType = ' + $lt)
    if ($lt -eq 'Password' -or $lt -eq 'S4U') {
        schtasks /run /tn $task | Out-Null
        Write-Host '  started. wait ~15s, then open http://localhost:14873/'
        Write-Host '  REAL test: reboot, open nothing, check the URL from the work PC.'
    } else {
        Write-Host ('  WARNING - LogonType is ' + $lt + ' (only when logged on). reboot test may fail.')
    }
} catch {
    Write-Host ''
    Write-Host ('  FAIL - ' + $_.Exception.Message)
    Write-Host '  if it mentions a blank/empty password: this account has no password set,'
    Write-Host '  so "run whether logged on or not" is not possible. Fallback: enable Windows'
    Write-Host '  auto-login + an At-logon task. Tell Claude this message.'
}
