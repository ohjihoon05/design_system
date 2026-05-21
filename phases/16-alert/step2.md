# Step 2 — Alert.tsx 구현

- BASE_STYLE: flex + items-center + gap space[3] + padding(space[5]/space[6]) + radius.md + fontSize.titleSm + lineHeight.tight
- statusTokens.alarm.bg / border / text
- onDismiss 제공 시 justifyContent: 'space-between' + native `<button>` × + aria-label="닫기" + inline style reset (background transparent, border none, padding space[1], color inherit, cursor pointer)
- role="alert" 강제 (Component props에서 `role="alert"` 명시, consumer는 Omit<..., 'role'>로 전달 불가)
- className: `wonik-alert` + user

Step 1 12개 테스트 모두 green: 12 passed in 860ms.
hex 0, raw px 1회 (표준 `1px solid` — Card·Badge 동일 관례).
