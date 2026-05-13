# Step 2 — Home.tsx 교체 part 2 (Verbosity Button variant 토글 + 변경 안 하는 부위 기록)

## 작업 (실행 결과)

### 2.1 Verbosity 5-pill Button variant 토글 (line 376–391)

```diff
- <button ... className={`rounded-lg border ... ${
-   verbosity === opt.value
-     ? "border-[var(--color-primary)] bg-[var(--color-primary)]/15 text-[var(--color-primary-hover)]"
-     : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
- }`}>
+ <Button variant={verbosity === opt.value ? "primary" : "outline"} size="sm" onClick={() => setVerbosity(opt.value)}>
    {opt.label}
- </button>
+ </Button>
```

grid 부모 `<div className="grid grid-cols-5 gap-1.5">`는 layout이므로 유지.

### 2.2~2.4 변경 안 하는 부위 — evidence 기록

- **slideCount "{slideCount}장" pill** (line 316–324): Badge 부재 → 그대로 유지. **Badge needs Trial 4 3회 + Home 1회 = 4회 누적, Phase 14 후보 1**.
- **Audience `<select>`** (line 356–368): Select wrapper 부재 → 그대로 유지. **Select needs Home 1회, evidence 약함**.
- **Error alert** (line 395–409): Alert 부재 → 그대로 유지. **Alert needs Trial 4 inconclusive + Home 1회 = evidence 시작**.

### 2.5 Verbosity Button variant=primary 시각 첫 인상

**무거움**: 선택된 "기본" 버튼이 solid primary bg + 흰 텍스트로 채워짐. 원본은 primary/15 (light bg with primary border + primary text) — soft 톤이라 시각 weight 더 가벼움. **ToggleGroup/SegmentedControl needs evidence**.

## 통과 조건

- 2.1·2.2·2.3·2.4·2.5 ✅
- 2.T1 (tsc --noEmit): 0 errors ✅ — Step 3 직전 검증
- 2.S1 (hex 0): git diff 통과 ✅

## 메모

- "ToggleGroup이 필요한가?" — Trial 6에서 동일 패턴(예: theme switch, mode switch)이 부상하면 needs 확정.
- Button "soft selected" 또는 "tonal" variant 추가도 옵션.
