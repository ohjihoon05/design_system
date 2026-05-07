import { Button } from '@wonik/web';
import type { ButtonVariant, ButtonSize } from '@wonik/web';

const variants: ButtonVariant[] = ['primary', 'secondary', 'text', 'outline', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export function App() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <header>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>WONIK Web Sandbox</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
          Button — 5 variants × 3 sizes. Disabled state 포함.
        </p>
      </header>

      {variants.map((variant) => (
        <section key={variant}>
          <h2 style={{ fontSize: 14, marginBottom: 12, color: 'var(--color-text-secondary)' }}>
            {variant}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {variant}/{size}
              </Button>
            ))}
            <Button variant={variant} disabled>
              disabled
            </Button>
          </div>
        </section>
      ))}

      <section>
        <h2 style={{ fontSize: 14, marginBottom: 12, color: 'var(--color-text-secondary)' }}>
          Click handler check
        </h2>
        <Button onClick={() => alert('clicked!')}>Click me</Button>
      </section>
    </main>
  );
}
