import React from 'react';
import { addons, types, useParameter } from 'storybook/manager-api';
import { AddonPanel, SyntaxHighlighter } from 'storybook/internal/components';

// 개별 story 화면(Canvas)에서도 해당 story의 코드를 볼 수 있게 하는 커스텀 "Code" 패널.
// 공식 addon-storysource가 Storybook 9+를 지원하지 않아 직접 만든다.
// 코드 출처: addon-docs의 csf-plugin이 빌드 시 각 story parameters에 심는
// docs.source.originalSource (Docs 페이지 "Show code"와 동일한 소스).

const PANEL_ID = 'wonik/code-panel';

interface DocsParameter {
  source?: { originalSource?: string };
}

const CodePanel = () => {
  const docs = useParameter<DocsParameter>('docs', {});
  const raw = docs?.source?.originalSource;
  if (!raw) {
    return <div style={{ padding: 16 }}>이 story의 소스 코드를 찾을 수 없습니다.</div>;
  }
  // story 함수 껍데기("() =>")는 사용 코드가 아니므로 제거 (preview.tsx의 docs.source.transform과 동일 규칙)
  const code = raw.replace(/^\(\)\s*=>\s*/, '');
  return (
    <SyntaxHighlighter language="jsx" copyable bordered={false} padded>
      {code}
    </SyntaxHighlighter>
  );
};

addons.register('wonik/code', () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Code',
    render: ({ active }) => (
      <AddonPanel active={!!active}>
        <CodePanel />
      </AddonPanel>
    ),
  });
});

// story 진입 시 하단 패널에서 Code 탭을 기본 선택 (클릭 없이 바로 코드가 보이게)
addons.setConfig({ selectedPanel: PANEL_ID });
