// demo-tracker 도메인 모델 — 사내 이슈/요청 트래커 (dogfood trial 14).
// 백엔드 없음: App이 in-memory state로 보유, 컴포넌트는 controlled로 받음
// (CLAUDE.md CRITICAL — 컴포넌트 stateless 유지).

export type IssueStatus = 'open' | 'in_progress' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high';
export type IssueCategory = 'bug' | 'feature' | 'design' | 'infra';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  category: IssueCategory;
  assignee: string;
  notify: boolean;
}

// ── 라벨 매핑 (select/badge에서 한국어 표시) ──────────────────────────────

export const STATUS_LABEL: Record<IssueStatus, string> = {
  open: '열림',
  in_progress: '진행중',
  closed: '닫힘',
};

export const PRIORITY_LABEL: Record<IssuePriority, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
};

export const CATEGORY_LABEL: Record<IssueCategory, string> = {
  bug: '버그',
  feature: '기능',
  design: '디자인',
  infra: '인프라',
};

export const ASSIGNEES = ['미지정', '오지훈', '김SQA', '박FE', '이BE'] as const;

// ── 폼 옵션 (select / radio 소스) ─────────────────────────────────────────

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABEL) as [IssueCategory, string][];
export const STATUS_OPTIONS = Object.entries(STATUS_LABEL) as [IssueStatus, string][];
export const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABEL) as [IssuePriority, string][];

// ── seed 데이터 ───────────────────────────────────────────────────────────

export const SEED_ISSUES: Issue[] = [
  {
    id: 'WUI-101',
    title: 'Badge에 상태 tone(성공/경고/위험) 없음',
    description: 'neutral/primary 2개뿐이라 열림/닫힘 색 구분 불가.',
    status: 'open',
    priority: 'high',
    category: 'design',
    assignee: '오지훈',
    notify: true,
  },
  {
    id: 'WUI-102',
    title: '폼 자리에서 label+Input+error 반복',
    description: 'FormField wrapper 후보 — dogfood로 evidence 누적 중.',
    status: 'in_progress',
    priority: 'medium',
    category: 'feature',
    assignee: '박FE',
    notify: true,
  },
  {
    id: 'WUI-103',
    title: 'Select atom 부재 — native <select> 사용',
    description: '담당자/카테고리 드롭다운을 raw select로 우회.',
    status: 'open',
    priority: 'medium',
    category: 'feature',
    assignee: '미지정',
    notify: false,
  },
  {
    id: 'WUI-104',
    title: 'dark mode outline 버튼 저대비 (#7)',
    description: 'primaryDark.base 2.28:1 — T8c 사내 협의 대기.',
    status: 'closed',
    priority: 'low',
    category: 'bug',
    assignee: '오지훈',
    notify: false,
  },
];
