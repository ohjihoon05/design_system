import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Stack,
  Text,
  Button,
  Table,
  Badge,
  FilterChip,
  Modal,
  Input,
  Textarea,
  Radio,
  Switch,
  Card,
  useToast,
} from '@wonik/web';
import type { Column } from '@wonik/web';
import { space, radius, fontSize, fontWeight, interfaceColors, statusTokens } from '@wonik/tokens';
import {
  type Issue,
  type IssueStatus,
  type IssuePriority,
  type IssueCategory,
  PRIORITY_LABEL,
  CATEGORY_LABEL,
  STATUS_LABEL,
  ASSIGNEES,
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  SEED_ISSUES,
} from './data';

// ════════════════════════════════════════════════════════════════════════
//  demo-tracker — 사내 이슈 트래커 CRUD (dogfood trial 14)
//  목적: @wonik/web 23 atom을 "프레젠테이션(ppt)"이 아닌 "사내 CRUD" shape에서 dogfood.
//  - Table atom 첫 dogfood → atom 24 closure 후보
//  - frozen 폼 후보(FormField / Select / RadioGroup / Tabs)의 gap을 host 코드로 실증
//  이 파일에서 [GAP-n] 주석 = 동결 후보가 없어서 host가 우회/재구현한 지점 = 증거.
// ════════════════════════════════════════════════════════════════════════

const emptyIssue = (): Issue => ({
  id: '',
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
  category: 'feature',
  assignee: '미지정',
  notify: true,
});

// [GAP-1] FormField 부재 → host가 label+control+error 묶음을 직접 재구현.
// 이 Field가 곧 design system이 빠뜨린 FormField atom. 폼에서 5회 사용 = evidence.
// htmlFor 없는 경우(우선순위 radio group)는 단일 컨트롤이 없어 <label> 대신 <span> 사용 —
// RadioGroup atom이 있었으면 <fieldset>/<legend> 시맨틱을 줬을 자리 (GAP-3 보강).
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}) {
  const labelStyle: CSSProperties = {
    fontSize: fontSize.label,
    fontWeight: fontWeight.medium,
    color: interfaceColors.textMuted,
  };
  return (
    <Stack gap={1}>
      {htmlFor ? (
        <label htmlFor={htmlFor} style={labelStyle}>{label}</label>
      ) : (
        <span style={labelStyle}>{label}</span>
      )}
      {children}
      {error && (
        <span style={{ fontSize: fontSize.label, color: statusTokens.alarm.text }}>{error}</span>
      )}
    </Stack>
  );
}

// [GAP-2] Select atom 부재 → native <select>를 토큰으로 손수 칠해 우회. 폼에서 2회.
const selectStyle: CSSProperties = {
  width: '100%',
  padding: `${space[2]} ${space[2]}`,
  borderRadius: radius.md,
  border: `1px solid ${interfaceColors.border}`,
  background: interfaceColors.surface,
  color: interfaceColors.text,
  fontSize: fontSize.label,
  fontFamily: 'inherit',
};

// [GAP-3] Badge tone 부재 → variant가 neutral/primary 2개뿐이라 의미색 불가.
// 어쩔 수 없이 "attention" 의미를 primary에 과적재. 진짜로는 success/warning/danger tone이 필요.
function StatusBadge({ s }: { s: IssueStatus }) {
  return <Badge variant={s === 'open' ? 'primary' : 'neutral'}>{STATUS_LABEL[s]}</Badge>;
}
function PriorityBadge({ p }: { p: IssuePriority }) {
  return <Badge variant={p === 'high' ? 'primary' : 'neutral'}>{PRIORITY_LABEL[p]}</Badge>;
}

type Filter = 'all' | IssueStatus;
const FILTERS: [Filter, string][] = [
  ['all', '전체'],
  ['open', '열림'],
  ['in_progress', '진행중'],
  ['closed', '닫힘'],
];

export function App() {
  const [issues, setIssues] = useState<Issue[]>(SEED_ISSUES);
  const [filter, setFilter] = useState<Filter>('all');
  const [draft, setDraft] = useState<Issue | null>(null); // null = 모달 닫힘
  const [titleTouched, setTitleTouched] = useState(false);
  const toast = useToast();

  const isEditing = !!draft && draft.id !== '';
  const titleError = titleTouched && !draft?.title.trim() ? '제목은 필수입니다.' : undefined;

  const filtered = useMemo(
    () => (filter === 'all' ? issues : issues.filter((i) => i.status === filter)),
    [issues, filter],
  );

  const patch = (p: Partial<Issue>) => setDraft((d) => (d ? { ...d, ...p } : d));

  const nextId = () => {
    const nums = issues
      .map((i) => parseInt(i.id.replace('WUI-', ''), 10))
      .filter((n) => !Number.isNaN(n));
    return `WUI-${(nums.length ? Math.max(...nums) : 100) + 1}`;
  };

  const save = () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      setTitleTouched(true);
      return;
    }
    if (draft.id === '') {
      const created = { ...draft, id: nextId() };
      setIssues((prev) => [created, ...prev]);
      toast.show({ tone: 'success', title: '이슈 생성됨', description: created.id });
    } else {
      setIssues((prev) => prev.map((i) => (i.id === draft.id ? draft : i)));
      toast.show({ tone: 'success', title: '이슈 저장됨', description: draft.id });
    }
    setDraft(null);
  };

  // [GAP-4 후보] 목록 필터를 FilterChip(single-select)로 구현. Tabs였으면 더 좋았을지 평가.
  // → 결과: FilterChip가 count 표시까지 자연스러워 Tabs 갈증 없음. Tabs 동결 reaffirm 쪽 증거.

  const columns: Column<Issue>[] = [
    { id: 'id', header: 'ID', accessor: 'id' },
    { id: 'title', header: '제목', accessor: 'title' },
    {
      id: 'category',
      header: '카테고리',
      accessor: (r) => CATEGORY_LABEL[r.category],
      cell: (v) => <Badge variant="neutral">{v as string}</Badge>,
    },
    {
      id: 'priority',
      header: '우선순위',
      accessor: 'priority',
      cell: (v) => <PriorityBadge p={v as IssuePriority} />,
    },
    {
      id: 'status',
      header: '상태',
      accessor: 'status',
      cell: (v) => <StatusBadge s={v as IssueStatus} />,
    },
    { id: 'assignee', header: '담당자', accessor: 'assignee' },
    {
      id: 'actions',
      header: '',
      accessor: () => '',
      cell: (_v, row) => (
        <Button size="sm" variant="text" onClick={() => { setDraft({ ...row }); setTitleTouched(false); }}>
          수정
        </Button>
      ),
    },
  ];

  return (
    <Stack gap={5} style={{ maxWidth: 920, margin: '0 auto' }}>
      <Stack direction="row" justify="between" align="center">
        <Stack gap={1}>
          <Text variant="titleSm" weight="medium">이슈 트래커</Text>
          <Text variant="labelSm" color="dim">@wonik/web dogfood — trial 14 (사내 CRUD shape)</Text>
        </Stack>
        <Button variant="primary" onClick={() => { setDraft(emptyIssue()); setTitleTouched(false); }}>
          + 새 이슈
        </Button>
      </Stack>

      <Stack direction="row" gap={2} align="center">
        {FILTERS.map(([val, label]) => {
          const count = val === 'all' ? issues.length : issues.filter((i) => i.status === val).length;
          return (
            <FilterChip key={val} active={filter === val} onClick={() => setFilter(val)}>
              {label} {count}
            </FilterChip>
          );
        })}
      </Stack>

      <Card padding="none">
        <Table
          columns={columns}
          data={filtered}
          zebra
          caption="사내 이슈 목록"
          emptyMessage="해당 상태의 이슈가 없습니다."
        />
      </Card>

      {/* ── 생성/수정 폼 (Modal) ───────────────────────────────────────── */}
      {draft && (
        <Modal
          isOpen
          onClose={() => setDraft(null)}
          title={isEditing ? `이슈 수정 — ${draft.id}` : '새 이슈'}
          size="md"
        >
          <Modal.Body>
            <Stack gap={4}>
              <Field label="제목" htmlFor="f-title" error={titleError}>
                <Input
                  id="f-title"
                  value={draft.title}
                  invalid={!!titleError}
                  placeholder="무엇이 문제인가요?"
                  onChange={(e) => patch({ title: e.target.value })}
                  onBlur={() => setTitleTouched(true)}
                />
              </Field>

              <Field label="설명" htmlFor="f-desc">
                <Textarea
                  id="f-desc"
                  value={draft.description}
                  rows={3}
                  placeholder="재현 절차 / 맥락"
                  onChange={(e) => patch({ description: e.target.value })}
                />
              </Field>

              <Stack direction="row" gap={4}>
                {/* [GAP-2] Select 부재 */}
                <Field label="카테고리" htmlFor="f-category">
                  <select
                    id="f-category"
                    style={selectStyle}
                    value={draft.category}
                    onChange={(e) => patch({ category: e.target.value as IssueCategory })}
                  >
                    {CATEGORY_OPTIONS.map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="담당자" htmlFor="f-assignee">
                  <select
                    id="f-assignee"
                    style={selectStyle}
                    value={draft.assignee}
                    onChange={(e) => patch({ assignee: e.target.value })}
                  >
                    {ASSIGNEES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </Field>
              </Stack>

              {/* [GAP-3] RadioGroup 부재 → Radio 3개를 name 공유로 수동 그룹화 + label 수동 연결 */}
              <Field label="우선순위">
                <Stack direction="row" gap={4}>
                  {PRIORITY_OPTIONS.map(([val, label]) => (
                    <label
                      key={val}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: space[1], cursor: 'pointer' }}
                    >
                      <Radio
                        name="priority"
                        value={val}
                        checked={draft.priority === val}
                        onChange={() => patch({ priority: val })}
                      />
                      <span style={{ fontSize: fontSize.label }}>{label}</span>
                    </label>
                  ))}
                </Stack>
              </Field>

              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- <label>이 Switch(내부 native checkbox input)를 감싸 implicit 연결됨. jsx-a11y가 커스텀 컴포넌트를 못 봐 오판. ADR-027 escape-hatch. */}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: space[2], cursor: 'pointer' }}>
                <Switch checked={draft.notify} onChange={(e) => patch({ notify: e.target.checked })} />
                <span style={{ fontSize: fontSize.label }}>저장 시 담당자에게 알림</span>
              </label>

              {/* 상태는 수정 모드에서만 변경 (생성은 항상 open) */}
              {isEditing && (
                <Field label="상태" htmlFor="f-status">
                  <select
                    id="f-status"
                    style={selectStyle}
                    value={draft.status}
                    onChange={(e) => patch({ status: e.target.value as IssueStatus })}
                  >
                    {STATUS_OPTIONS.map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </Field>
              )}
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="text" onClick={() => setDraft(null)}>취소</Button>
            <Button variant="primary" onClick={save}>{isEditing ? '저장' : '생성'}</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Stack>
  );
}
