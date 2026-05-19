# Phase 21 — Tooltip

> ROADMAP §M2.b Phase 3 partial closure (Tooltip만, Tabs는 evidence 부재로 보류).

## 범위

`@wonik/web`에 `Tooltip` atom 1개 추가. 21 atom 도달.

## 결정 (요약 — 상세는 .changeset/21-tooltip.md)

| 항목 | 결정 |
|---|---|
| trigger | `children: ReactElement` + cloneElement (한 단계 wrap만) |
| 표시 트리거 | hover + focus (WCAG 2.1 SC 1.4.13) |
| 숨김 트리거 | mouseLeave + blur + Escape |
| openDelay | 200ms default (flicker 방지) |
| closeDelay | 0ms default |
| placement | top/right/bottom/left, top default |
| positioning | inline `position:absolute` calc(100% + 6px), 자동 flip 없음 |
| portal | 사용 안 함 (host overflow 문제 시 별도 wrap) |
| 시각 토큰 | `interfaceColors.text`(bg) + `interfaceColors.surface`(text) + `radius.sm` + `fontSize.label` |
| a11y | `role="tooltip"` + `aria-describedby` chain |
| disabled | 핸들러 no-op으로 처리 (전환 비용 0) |
| 진입 애니메이션 | 없음 (UI_GUIDE slop 회피) |

## 생성 파일

- `packages/web/src/Tooltip/Tooltip.tsx` — 구현 (~150 lines)
- `packages/web/src/Tooltip/Tooltip.test.tsx` — 20 tests
- `packages/web/src/Tooltip/types.ts` — type exports
- `packages/web/src/Tooltip/index.ts` — barrel
- `.changeset/21-tooltip.md` — minor bump
- `packages/web/src/index.ts` — Tooltip export 추가

## 검증

- TDD: test first 작성 + 통과 목표 (sandbox lock 차단으로 자동 검증 보류, 사용자 검수 권장)
- 회귀: 기존 atom 0 영향 (분리된 새 모듈)
- 토큰 하드코딩: 0 (모두 `interfaceColors`/`radius`/`fontSize` 경유)

## 다음 호흡

- ToggleGroup 2/3 evidence — 1 trial 더 누적 시 진입
- Tabs — dogfood 자리 발견 시 (현재 AlarmsPage FilterChip이 더 적합해 약함, ROADMAP 표시 유지)
- Select — 자리 부족(`<select>` 1개)으로 보류
