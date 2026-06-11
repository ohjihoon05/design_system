# WONIK DS — 바탕화면 바로가기 자동 생성 (setup-desktop.bat이 실행)
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$desktop = [Environment]::GetFolderPath('Desktop')
$shell = New-Object -ComObject WScript.Shell

$targets = @(
  @{ Name = 'DS 화면 시작';     Path = Join-Path $repo 'apps\web-sandbox\start-sandbox.bat' },
  @{ Name = 'DS 카탈로그 보기'; Path = Join-Path $repo 'apps\storybook\start-storybook.bat' }
)

foreach ($t in $targets) {
  if (-not (Test-Path $t.Path)) {
    Write-Host "SKIP (file not found): $($t.Path)"
    continue
  }
  $lnk = $shell.CreateShortcut((Join-Path $desktop ($t.Name + '.lnk')))
  $lnk.TargetPath = $t.Path
  $lnk.WorkingDirectory = Split-Path -Parent $t.Path
  $lnk.Save()
  Write-Host "OK: $($t.Name)"
}
Write-Host 'Done. Check your desktop.'

