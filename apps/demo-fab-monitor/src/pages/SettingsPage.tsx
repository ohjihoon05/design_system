import { useState } from 'react';
import { Card, Stack, Text, Switch, Radio, Input, Button, useTheme } from '@wonik/web';
import { FilterChip } from '../components/internal/FilterChip';
import { injectCss, FOCUS_RING } from '../lib/injectCss';

injectCss('settings-page', `
  .demo-settings-radio-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-text-dark);
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 5px;
  }
  .demo-settings-radio-label:focus-within {
    ${FOCUS_RING}
  }
`);

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [desktopNotif, setDesktopNotif] = useState(true);
  const [soundNotif, setSoundNotif] = useState(false);
  const [emailDigest, setEmailDigest] = useState(true);
  const [refreshRate, setRefreshRate] = useState<'2s' | '5s' | '10s'>('2s');
  const [name, setName] = useState('김기현');
  const [email] = useState('kim.gihyeon@wonik-ips.com');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 720px)', gap: 16 }}>
      <Card padding="lg">
        <Stack gap={6}>
          <Stack gap={1}>
            <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 18 }}>Appearance</Text>
            <Text variant="labelSm" color="dim">화면 테마와 시각 옵션</Text>
          </Stack>

          <Row label="Theme" hint="라이트 / 다크 모드">
            <Stack direction="row" gap={2}>
              {(['light', 'dark'] as const).map((mode) => (
                <FilterChip key={mode} active={theme === mode} onClick={() => setTheme(mode)}>
                  <span style={{ textTransform: 'capitalize' }}>{mode}</span>
                </FilterChip>
              ))}
            </Stack>
          </Row>
        </Stack>
      </Card>

      <Card padding="lg">
        <Stack gap={6}>
          <Stack gap={1}>
            <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 18 }}>Notifications</Text>
            <Text variant="labelSm" color="dim">알람 발생 시 어떻게 알릴지</Text>
          </Stack>

          <Row label="Desktop notification" hint="브라우저 native 알림">
            <Switch size="md" checked={desktopNotif} onChange={(e) => setDesktopNotif(e.target.checked)} />
          </Row>
          <Row label="Sound on critical" hint="Critical 알람 발생 시 비프음 재생">
            <Switch size="md" checked={soundNotif} onChange={(e) => setSoundNotif(e.target.checked)} />
          </Row>
          <Row label="Daily email digest" hint="08:00 KST에 전일 요약 메일">
            <Switch size="md" checked={emailDigest} onChange={(e) => setEmailDigest(e.target.checked)} />
          </Row>
        </Stack>
      </Card>

      <Card padding="lg">
        <Stack gap={6}>
          <Stack gap={1}>
            <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 18 }}>Live data</Text>
            <Text variant="labelSm" color="dim">실시간 데이터 갱신 주기</Text>
          </Stack>

          <Row label="Refresh rate" hint="장비 상태 polling 간격">
            <Stack direction="row" gap={4}>
              {(['2s', '5s', '10s'] as const).map((rate) => (
                <label key={rate} className="demo-settings-radio-label">
                  <Radio size="sm" name="refresh-rate" value={rate} checked={refreshRate === rate} onChange={() => setRefreshRate(rate)} />
                  <span>{rate}</span>
                </label>
              ))}
            </Stack>
          </Row>
        </Stack>
      </Card>

      <Card padding="lg">
        <Stack gap={6}>
          <Stack gap={1}>
            <Text variant="titleSm" weight="medium" color="dark" style={{ fontSize: 18 }}>Profile</Text>
            <Text variant="labelSm" color="dim">사내 SSO 계정과 연동</Text>
          </Stack>

          <Row label="Name">
            <div style={{ width: 280 }}>
              <Input size="md" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </Row>
          <Row label="Email" hint="SSO에서 가져옴 — 직접 변경 불가">
            <div style={{ width: 280 }}>
              <Input size="md" value={email} disabled readOnly />
            </div>
          </Row>

          <Stack direction="row" justify="end" gap={2}>
            <Button variant="text" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Save changes</Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <Stack direction="row" justify="between" align="start" gap={6}>
      <Stack gap={1} style={{ flex: 1, minWidth: 0 }}>
        <Text variant="label" weight="medium" color="dark">{label}</Text>
        {hint && <Text variant="labelSm" color="dim">{hint}</Text>}
      </Stack>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </Stack>
  );
}
