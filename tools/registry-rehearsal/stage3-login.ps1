# Stage 3 login - create Verdaccio user + save token to ~/.npmrc (replaces interactive npm adduser)
$reg  = 'http://127.0.0.1:14873/'
$user = 'deployer'
$pass = 'deploy123'
$body = @{ _id = "org.couchdb.user:$user"; name = $user; password = $pass; type = 'user'; roles = @(); email = 'deployer@wonik.local' } | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Method Put -Uri ($reg + '-/user/org.couchdb.user:' + $user) -ContentType 'application/json' -Body $body
    if (-not $resp.token) { throw 'response has no token' }
    Add-Content -Encoding ascii -Path (Join-Path $env:USERPROFILE '.npmrc') -Value ('//127.0.0.1:14873/:_authToken=' + $resp.token)
    Write-Host ''
    Write-Host '  OK - login token issued + saved to ~/.npmrc (user: deployer)'
    Write-Host '  -> now double-click stage3-3-login-publish bat'
} catch {
    Write-Host ''
    Write-Host ('  FAIL - ' + $_.Exception.Message)
    Write-Host '  -> is the 3-1 verdaccio window running? open http://127.0.0.1:14873/ in a browser to check.'
}
