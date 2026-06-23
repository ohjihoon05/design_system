import { useState } from 'react';
import {
  ThemeProvider,
  Box,
  Stack,
  Text,
  Card,
  Badge,
  IconButton,
  Avatar,
  Input,
  Button,
} from '@wonik/web';

/**
 * ATLAS — 공정 레시피 분석 프로젝트 갤러리. 컨시어지 플레이 C의 "실화면 1개" 납품물.
 *
 * 스코프(2026-06-23 b 합의): 상단바(로고+아바타) + 검색바 + 카드 그리드 + 페이지네이션. 라우트 1개.
 * 컴포넌트 9개: Card·Text·Badge·IconButton·Box·Stack·Avatar·Input·Button (+ ThemeProvider).
 *
 * 다크: 상시-다크 화면. ThemeProvider scope="self" theme="dark"로 island. 흰 레시피 패널의
 * 어두운 글자는 inversion 토큰 color="onDark"(다크에서 #303030). 빌드는 vite-plugin-singlefile로
 * 자가포함 HTML 1개 → file:// 더블클릭 (IT 무의존). singlefile-gate(ADR-043) 검증 대상.
 */

interface AtlasProject {
  id: string;
  title: string;
  subtitle: string;
  recipe: string[];
  moreCount: number;
  tags: { label: string; primary?: boolean }[];
}

const SAMPLE_PROJECTS: AtlasProject[] = [
  {
    id: 'p1',
    title: 'Quanta',
    subtitle: 'S01-1234에 대한 분석',
    recipe: ['3L 200torr 500s', '3L 400torr 100s', '5d7L 400torr 1000s', '1000s'],
    moreCount: 3,
    tags: [{ label: 'EQ1' }, { label: 'EQ2' }, { label: 'Analysis', primary: true }],
  },
  {
    id: 'p2',
    title: 'Quanta',
    subtitle: 'S01-1240에 대한 분석',
    recipe: ['2L 150torr 300s', '2L 350torr 120s', '4d2L 360torr 800s'],
    moreCount: 1,
    tags: [{ label: 'EQ1' }, { label: 'Analysis', primary: true }],
  },
  {
    id: 'p3',
    title: 'Helios',
    subtitle: 'S02-0091에 대한 분석',
    recipe: ['5L 500torr 200s', '5L 500torr 200s', '3d1L 420torr 640s', '640s'],
    moreCount: 5,
    tags: [{ label: 'EQ2' }, { label: 'EQ3' }, { label: 'Analysis', primary: true }],
  },
  {
    id: 'p4',
    title: 'Quanta',
    subtitle: 'S01-1255에 대한 분석',
    recipe: ['1L 100torr 250s', '1L 220torr 90s'],
    moreCount: 0,
    tags: [{ label: 'EQ1' }],
  },
  {
    id: 'p5',
    title: 'Helios',
    subtitle: 'S02-0104에 대한 분석',
    recipe: ['6L 600torr 150s', '6L 600torr 150s', '2d8L 410torr 720s', '720s'],
    moreCount: 2,
    tags: [{ label: 'EQ3' }, { label: 'Analysis', primary: true }],
  },
];

/** 검색 input 좌측 아이콘 (consumer가 직접 주입 — @wonik/web은 아이콘 미제공). */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 9v10M9 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      {direction === 'left' ? (
        <path d="M8.5 3L4.5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

const CARD_MIN_HEIGHT = 300;

/** 시안 페이지네이션 mock: ← Previous [1] 2 … 5 Next →. 데모용 시각/활성표시만(데이터 분할 X). */
const PAGE_ITEMS: (number | 'ellipsis')[] = [1, 2, 'ellipsis', 5];

function Pagination({ active, onChange }: { active: number; onChange: (page: number) => void }) {
  return (
    <Stack direction="row" align="center" justify="center" gap={2} style={{ paddingTop: 8 }}>
      <Button variant="text" size="sm" onClick={() => onChange(Math.max(1, active - 1))}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <ArrowIcon direction="left" /> Previous
        </span>
      </Button>
      {PAGE_ITEMS.map((item, i) =>
        item === 'ellipsis' ? (
          <Text key={`e${i}`} variant="label" color="dim" style={{ padding: '0 4px' }}>
            …
          </Text>
        ) : (
          <Button
            key={item}
            // 활성 페이지 = primary Button. singlefile-gate가 이 id로 토큰 var() 해결을 검증.
            id={item === active ? 'primary-btn' : undefined}
            variant={item === active ? 'primary' : 'text'}
            size="sm"
            onClick={() => onChange(item)}
          >
            {item}
          </Button>
        ),
      )}
      <Button variant="text" size="sm" onClick={() => onChange(active + 1)}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Next <ArrowIcon direction="right" />
        </span>
      </Button>
    </Stack>
  );
}

function ProjectCard({ project }: { project: AtlasProject }) {
  return (
    <Card variant="surface" padding="md" style={{ minHeight: CARD_MIN_HEIGHT, cursor: 'pointer' }}>
      <Stack direction="column" gap={4} style={{ height: '100%' }}>
        <Stack direction="row" justify="between" align="start" gap={3}>
          <Stack direction="column" gap={1} style={{ flex: 1, minWidth: 0 }}>
            <Text variant="h3" weight="medium" truncate>
              {project.title}
            </Text>
            <Text variant="label" color="secondary" truncate>
              {project.subtitle}
            </Text>
          </Stack>
          <IconButton variant="ghost" size="sm" aria-label={`${project.title} 메뉴`}>
            <MenuIcon />
          </IconButton>
        </Stack>

        <Box bg="surfaceWhite" rounded="md" p={4} style={{ flex: 1 }}>
          <Stack direction="column" gap={2}>
            {project.recipe.map((line, i) => (
              <Text key={i} variant="label" color="onDark">
                {line}
              </Text>
            ))}
            {project.moreCount > 0 && (
              <Text variant="labelSm" color="onDarkDim" style={{ marginTop: 4 }}>
                외 {project.moreCount}개
              </Text>
            )}
          </Stack>
        </Box>

        <Stack direction="row" gap={2} wrap>
          {project.tags.map((tag) => (
            <Badge key={tag.label} variant={tag.primary ? 'primary' : 'neutral'}>
              {tag.label}
            </Badge>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

function AddProjectCard() {
  return (
    <Card variant="surface" padding="md" style={{ minHeight: CARD_MIN_HEIGHT }}>
      <Stack direction="column" align="center" justify="center" gap={3} style={{ height: '100%' }}>
        <IconButton variant="ghost" size="lg" aria-label="새 분석 추가">
          <PlusIcon />
        </IconButton>
        <Text variant="label" color="secondary">
          새 분석 추가
        </Text>
      </Stack>
    </Card>
  );
}

export function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? SAMPLE_PROJECTS.filter(
        (p) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q),
      )
    : SAMPLE_PROJECTS;

  return (
    <ThemeProvider theme="dark" scope="self">
      <Box bg="darkBase" style={{ minHeight: '100vh' }}>
        {/* 상단바 — 로고 + 사용자 아바타 */}
        <Box bg="darkHeader" px={7} py={5}>
          <Stack direction="row" justify="between" align="center">
            <Text variant="titleSm" weight="medium">
              ATLAS
            </Text>
            <Avatar name="홍길동" size={32} />
          </Stack>
        </Box>

        {/* 검색 바 */}
        <Box px={7} pt={7}>
          <Box style={{ width: 280 }}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftAddon={<SearchIcon />}
              placeholder="Search Project"
              aria-label="프로젝트 검색"
            />
          </Box>
        </Box>

        {/* 카드 갤러리 */}
        <Box px={7} pt={6} pb={6}>
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            {!q && <AddProjectCard />}
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Box>
          {filtered.length === 0 && (
            <Text color="secondary" style={{ paddingTop: 16 }}>
              "{query}"에 맞는 프로젝트가 없습니다.
            </Text>
          )}
        </Box>

        {/* 페이지네이션 */}
        <Box px={7} pb={7}>
          <Pagination active={page} onChange={setPage} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
