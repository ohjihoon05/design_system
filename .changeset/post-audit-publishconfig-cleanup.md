---
"@wonik/web": patch
"@wonik/tokens": patch
---

publishConfig — Verdaccio dry-run registry 주소 제거 + WONIK_REGISTRY_OK preflight 가드 추가.

### 동기

`/devex-review`(2026-05-26)가 `packages/{web,tokens}/package.json`의 `publishConfig.registry: "http://127.0.0.1:14873/"`를 위험 항목으로 플래그. 사내 npm registry URL이 아직 확정 안 된 상태(ADR-018 IT 협의 진행 중)에서 dry-run 주소를 그대로 두면, 누군가 `pnpm publish` 시 silent failure로 "publish 됐다고 착각"할 위험. `/autoplan` eng-review가 "이 필드 제거는 home-PC에서 즉시 가능, IT 협의 불필요"라고 확인.

### 변경

- `publishConfig.registry` 필드 제거. `access: "restricted"` 유지(외부 npm 실수 publish 차단).
- `preflight:publish` 스크립트 추가 — `WONIK_REGISTRY_OK=1` 환경변수 없으면 fail-fast로 `prepublishOnly`에서 즉시 중단. 의도된 publish만 통과.

```bash
# 미래 publish 흐름 (사내 registry 결정 + .npmrc 설정 후)
WONIK_REGISTRY_OK=1 pnpm -F @wonik/web publish
```

### scope

- 패키지 사용자 영향 0 (런타임/타입/API 변동 없음, metadata only).
- 사내 registry 결정 후 `publishConfig.registry`를 진짜 URL로 *다시 추가*하는 별도 PR 필요(ADR-018 cycle 일부).
- ADR-018 본문에 preflight 가드 흐름 추가 예정.

post-audit remediation cycle item H.3 (`docs/ADR.md` ADR-027 cycle 참조).
