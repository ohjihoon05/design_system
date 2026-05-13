# Step 1 — TDD (실패 테스트)

- types.ts: `AlertOwnProps` + `AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'>` (role 강제, consumer override 차단)
- Alert.test.tsx: 12 cases
  1. renders children
  2. role="alert" 강제
  3. statusTokens.alarm.bg
  4. 1px solid statusTokens.alarm.border
  5. statusTokens.alarm.text
  6. onDismiss 미제공 → × 버튼 미렌더
  7. onDismiss 제공 → × 버튼 + 클릭 시 callback
  8. as="section" polymorphic + role="alert" 유지
  9. className 합성
  10. style override
  11. 공통 시각 토큰 (flex/items-center/14px/10px)
  12. AI 슬롭 0

TDD red 확인 (Alert.tsx 부재로 12 fail).
