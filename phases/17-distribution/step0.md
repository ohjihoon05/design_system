# Step 0 — 준비

- `phases/17-distribution/index.json` 생성 ✅
- `.changeset/17-distribution.md` draft (`@wonik/tokens` + `@wonik/web` minor) ✅
- ADR-018 outline → Step 2에서 본문 완성
- 0.S1 token leak scan: `grep -rn "ghp_\|npm_[A-Za-z0-9]" packages/ docs/ .changeset/` → 0 line ✅
