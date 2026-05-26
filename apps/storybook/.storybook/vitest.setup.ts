// ADR-027: Storybook test runner setup — wires preview annotations (including
// withWonikProviders decorator + addon-a11y afterEach axe scan) into vitest's
// browser-mode test invocation.
//
// 중요: `import preview from './preview'` (default) 사용. `import * as preview`
// 패턴은 module namespace를 통째로 넘겨서 default export의 decorators 배열을 놓침
// → withWonikProviders가 안 붙어서 ToastProvider 컨텍스트가 없어지고 useToast()가
// throw하는 runtime 에러 발생함.
import { setProjectAnnotations } from '@storybook/react-vite';
import preview from './preview';

setProjectAnnotations([preview]);
