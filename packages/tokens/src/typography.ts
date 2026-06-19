export const fontFamily = {
  base: "'Segoe UI', 'Inter', system-ui, sans-serif",
} as const;

export const fontSize = {
  // Dense scale — WARP HMI heritage (라벨/값/상태 텍스트). line-height tight(1).
  micro: '8px',
  labelSm: '10px',
  label: '12px',
  titleSm: '14px',
  // Web reading scale — desktop 사내 사용자 가독성 (ADR-040). body는 line-height
  // normal(1.5), h1~h3는 페이지/섹션 위계. titleSm(14)과 body(14)는 값이 같아도
  // 의미·line-height가 다른 별개 leaf (DTCG 1:1 유지).
  body: '14px',
  h3: '20px',
  h2: '28px',
  h1: '40px',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
} as const;

export const lineHeight = {
  tight: 1, // 라벨·값·dense 텍스트 (HMI)
  normal: 1.5, // web 본문 (ADR-040)
} as const;
