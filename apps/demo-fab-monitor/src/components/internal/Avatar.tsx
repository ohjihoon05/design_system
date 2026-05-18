interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 32 }: AvatarProps) {
  // Surrogate-pair safe — `[0]` would split emojis / 일부 한자.
  const initial = Array.from(name.trim())[0] ?? '?';
  const fontSize = Math.round(size * 0.4);
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--color-primary)',
        color: 'white',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 500,
        lineHeight: 1,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initial}
    </span>
  );
}
