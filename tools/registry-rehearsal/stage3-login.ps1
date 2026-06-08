# Stage 3 login - create a fresh Verdaccio user + save token to ~/.npmrc (replaces interactive npm adduser).
# Uses a unique username each run to avoid 409 Conflict on re-runs.
$reg  = 'http://127.0.0.1:14873/'
$user = 'wonik' + (Get-Random -Minimum 100 -Maximum 99999)
$pass = 'deploy123'
$body = @{ _id = "org.couchdb.user:$user"; name = $user; password = $pass; type = 'user'; roles = @(); email = ($user + '@wonik.local') } | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Method Put -Uri ($reg + '-/user/org.couchdb.user:' + $user) -ContentType 'application/json' -Body $body
    if (-not $resp.token) { throw 'response has no token' }
    Add-Content -Encoding ascii -Path (Join-Path $env:USERPROFILE '.npmrc') -Value ('//127.0.0.1:14873/:_authToken=' + $resp.token)
    Write-Host ''
    Write-Host ('  OK - logged in as ' + $user + ', token saved to ~/.npmrc')
    Write-Host '  -> now double-click stage3-3'
} catch {
    Write-Host ''
    Write-Host ('  FAIL - ' + $_.Exception.Message)
    Write-Host '  -> is the 3-1 auth registry window running? open http://127.0.0.1:14873/ to check.'
}
