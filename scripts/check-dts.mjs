/**
 * check-dts.mjs — 빌드 산출물 타입 선언 가드
 *
 * dist 의 타입 선언 파일(index.d.ts / index.d.mts)이 "비어있지 않은지" 검증한다.
 * 비어있으면(또는 없으면) exit 1 로 빌드를 실패시킨다.
 *
 * 왜 필요한가:
 *   과거 일부 tsup 버전이 dual(ESM+CJS) 빌드에서 CJS용 index.d.ts 를 0바이트로
 *   뽑은 적이 있다. 그 빈 .d.ts 가 그대로 타르볼에 실려 발행되면, 소비처(ppt)에서
 *   `import { Button } from "@wonik/web"` 가 TS2306("not a module")로 깨지고
 *   프로덕션 빌드(tsc -b) 전체가 실패한다. tsup 은 이 경우에도 "Build success" 를
 *   찍기 때문에 silent 하게 새어나간다 → 이 가드로 빌드 단계에서 잡는다.
 *
 * 사용: 각 패키지 build 스크립트 끝에 `&& node ../../scripts/check-dts.mjs`.
 *       cwd 는 패키지 루트(= dist 의 부모)라고 가정한다.
 */
import { statSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const targets = ["index.d.ts", "index.d.mts"];
const MIN_BYTES = 100; // 정상 선언은 수~수십 KB. 100B 미만이면 빈/깨진 것으로 본다.

let failed = false;
for (const file of targets) {
  let size = -1;
  try {
    size = statSync(join(dist, file)).size;
  } catch {
    // 파일 없음 → 아래에서 실패 처리
  }
  if (size < MIN_BYTES) {
    console.error(
      `[check-dts] FAIL: dist/${file} = ${size < 0 ? "없음" : size + "B"} ` +
        `(최소 ${MIN_BYTES}B 기대). tsup DTS 빌드 실패 의심.`,
    );
    failed = true;
  } else {
    console.log(`[check-dts] OK: dist/${file} = ${size}B`);
  }
}

if (failed) {
  console.error(
    "[check-dts] 빈 타입 선언 감지 — 발행/벤더링을 중단합니다. " +
      "(tsup 버전/설정 점검 필요)",
  );
  process.exit(1);
}
console.log("[check-dts] 타입 선언 비어있지 않음 확인 ✓");
