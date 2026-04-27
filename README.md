# @infinite-dungeon/sprite-manager

A React sprite and animation management library for games. Built with TypeScript, designed for React-based 2D games.

## Features

- 🎬 **Frame-based animation** — play, pause, resume, stop, and speed control
- 📦 **Resource caching** — images and SVGs loaded once, duplicate requests deduplicated
- 🧩 **Sprite sheet support** — grid-based frame extraction with CSS `object-position` rendering
- 🖼️ **Three rendering modes** — `<canvas>`, `<img>`, or inline SVG
- 🔗 **Imperative ref API** — control animations from parent components
- 🎯 **TypeScript** — full types for all components, hooks, and utilities

## Installation

```bash
npm install @infinite-dungeon/sprite-manager
```

Requires React 18 or later as a peer dependency.

## Quick start

```tsx
import {
  SpriteManagerProvider,
  ImgAnimatedSprite,
  useAnimations,
} from '@infinite-dungeon/sprite-manager';
import { useMemo } from 'react';

function Character() {
  const config = useMemo(() => ({
    idle: {
      frames: [
        { sprite: '/sprites/idle-1.png', duration: 200 },
        { sprite: '/sprites/idle-2.png', duration: 200 },
      ],
      loop: true,
    },
    walk: {
      frames: [
        { sprite: '/sprites/walk-1.png', duration: 100 },
        { sprite: '/sprites/walk-2.png', duration: 100 },
        { sprite: '/sprites/walk-3.png', duration: 100 },
        { sprite: '/sprites/walk-4.png', duration: 100 },
      ],
      loop: true,
    },
  }), []);

  const animations = useAnimations(config);

  return (
    <ImgAnimatedSprite
      id="player"
      idle="idle"
      animations={animations}
      width={64}
      height={64}
      autoPlay
    />
  );
}

export default function App() {
  return (
    <SpriteManagerProvider>
      <Character />
    </SpriteManagerProvider>
  );
}
```

## Components

### SpriteManagerProvider

Wrap your app (or the subtree that uses sprites) with this provider. It deduplicates loads and caches all image and SVG resources.

```tsx
<SpriteManagerProvider>
  <Game />
</SpriteManagerProvider>
```

---

### Static sprites

Three rendering modes are available:

| Component | Renders as | Best for |
|---|---|---|
| `Sprite` | `<canvas>` | Sprite-sheet frame extraction, pixel transforms |
| `ImgSprite` | `<img>` | Simple images, native browser caching |
| `SvgSprite` | Inline `<svg>` | Vector assets, CSS-styleable, no `<img>` wrapper |

```tsx
import { Sprite, ImgSprite, SvgSprite } from '@infinite-dungeon/sprite-manager';

<Sprite   id="bg"   src="/sprites/background.png" width={800} height={600} />
<ImgSprite id="coin" src="/sprites/coin.png"       width={32}  height={32}  />
<SvgSprite id="icon" src="/sprites/sword.svg"      width={48}  height={48}  />
```

**Props (all static components):**

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Element identifier |
| `src` | `string` | URL of the image or SVG |
| `width` | `number?` | Display width in px |
| `height` | `number?` | Display height in px |
| `transform` | `object?` | `x`, `y`, `rotation`, `scaleX`, `scaleY`, `opacity` |
| `onLoad` | `() => void` | Called when the asset is ready |
| `onError` | `(err: Error) => void` | Called on load failure |

---

### Animated sprites

| Component | Renders as | Best for |
|---|---|---|
| `AnimatedSprite` | `<canvas>` | Sprite-sheet frame clipping via `drawImage` |
| `ImgAnimatedSprite` | `<img>` | Individual frame files or sprite sheets |
| `SvgAnimatedSprite` | Inline `<svg>` | SVG frame sequences |

```tsx
import { ImgAnimatedSprite, useAnimations } from '@infinite-dungeon/sprite-manager';
import { useMemo } from 'react';

function Hero() {
  const config = useMemo(() => ({
    idle:   { frames: [{ sprite: '/idle.png',   duration: 300 }], loop: true },
    walk:   { frames: [{ sprite: '/walk-1.png', duration: 100 },
                       { sprite: '/walk-2.png', duration: 100 }], loop: true },
    attack: { frames: [{ sprite: '/atk-1.png',  duration: 80  },
                       { sprite: '/atk-2.png',  duration: 80  }], loop: false, speed: 1.5 },
  }), []);

  const animations = useAnimations(config);

  return (
    <ImgAnimatedSprite
      id="hero"
      idle="idle"
      animations={animations}
      width={64}
      height={64}
      autoPlay
      onAnimationComplete={(id) => console.log(`${id} done`)}
    />
  );
}
```

**Props (all animated components):**

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Element identifier |
| `idle` | `string` | — | Animation key to fall back to |
| `animations` | `Record<string, Animation>` | — | Map produced by `useAnimations` |
| `width` | `number?` | — | Display width in px |
| `height` | `number?` | — | Display height in px |
| `autoPlay` | `boolean?` | `true` | Start the idle animation on mount |
| `paused` | `boolean?` | `false` | Pause or resume via prop |
| `transform` | `object?` | — | `x`, `y`, `rotation`, `scaleX`, `scaleY`, `opacity` |
| `onAnimationComplete` | `(id: string) => void` | — | Fires when a non-looping animation finishes |
| `onLoad` | `() => void` | — | Fires when all frame assets are loaded |

---

## Animation control

Animated sprite components expose an imperative API via `ref`:

```tsx
import { useRef } from 'react';
import { ImgAnimatedSprite, type AnimatedSpriteRef } from '@infinite-dungeon/sprite-manager';

function Character() {
  const ref = useRef<AnimatedSpriteRef>(null);

  return (
    <>
      <ImgAnimatedSprite ref={ref} id="hero" idle="idle" animations={animations} width={64} height={64} />
      <button onClick={() => ref.current?.playAnimation('attack')}>Attack</button>
      <button onClick={() => ref.current?.pauseAnimation()}>Pause</button>
      <button onClick={() => ref.current?.resumeAnimation()}>Resume</button>
      <button onClick={() => ref.current?.setAnimationSpeed(2)}>2× speed</button>
    </>
  );
}
```

**`AnimatedSpriteRef` methods:**

| Method | Description |
|---|---|
| `playAnimation(id, forceRestart?)` | Switch to an animation; returns `false` if the id is unknown |
| `pauseAnimation()` | Pause at the current frame |
| `resumeAnimation()` | Resume from the current frame |
| `stopAnimation()` | Stop and reset to frame 0 |
| `setAnimationSpeed(n)` | Speed multiplier, clamped to [0.1, 10] |
| `getAnimationState()` | Returns the current `AnimationState` snapshot |

---

## Sprite sheets

Use `calculateSpriteSheetFrames` to compute per-frame pixel coordinates from a grid sheet, then pass them as `frameData` to `useAnimations`:

```tsx
import {
  calculateSpriteSheetFrames,
  useAnimations,
  ImgAnimatedSprite,
} from '@infinite-dungeon/sprite-manager';
import { useMemo } from 'react';

const SHEET = '/sprites/character-sheet.png';

function Character() {
  const frames = useMemo(() =>
    calculateSpriteSheetFrames({ src: SHEET, frameWidth: 64, frameHeight: 64, cols: 4, rows: 4 }),
  []);

  const config = useMemo(() => ({
    idle: {
      frames: frames.slice(0, 4).map((f) => ({ sprite: SHEET, duration: 200, frameData: f })),
      loop: true,
    },
    walk: {
      frames: frames.slice(4, 8).map((f) => ({ sprite: SHEET, duration: 150, frameData: f })),
      loop: true,
    },
    attack: {
      frames: frames.slice(8, 12).map((f) => ({ sprite: SHEET, duration: 80, frameData: f })),
      loop: false,
    },
  }), [frames]);

  const animations = useAnimations(config);

  return <ImgAnimatedSprite id="hero" idle="idle" animations={animations} width={64} height={64} />;
}
```

For a single animation, `useSpriteSheetAnimation` combines both steps:

```tsx
import { useSpriteSheetAnimation } from '@infinite-dungeon/sprite-manager';

const sheet = useSpriteSheetAnimation(
  '/sprites/run.png',
  { frameWidth: 64, frameHeight: 64, cols: 8, rows: 1 },
  100 // duration per frame in ms
);
// sheet.frames — ready to pass into useAnimations
```

---

## SVG sprites

Sources ending in `.svg` are fetched as text and rendered as **inline SVG** — no `<img>` wrapper, full CSS access:

```tsx
import { SvgSprite, SvgAnimatedSprite, useAnimations } from '@infinite-dungeon/sprite-manager';
import { useMemo } from 'react';

// Static
<SvgSprite id="sword" src="/icons/sword.svg" width={48} height={48} />

// Animated — each frame sprite must be a .svg path
function Flame() {
  const config = useMemo(() => ({
    burn: {
      frames: [
        { sprite: '/fx/flame-1.svg', duration: 80 },
        { sprite: '/fx/flame-2.svg', duration: 80 },
        { sprite: '/fx/flame-3.svg', duration: 80 },
      ],
      loop: true,
    },
  }), []);

  const animations = useAnimations(config);

  return <SvgAnimatedSprite id="flame" idle="burn" animations={animations} width={64} height={64} />;
}
```

`SpriteManagerProvider` detects `.svg` extensions automatically and uses `fetch` instead of `HTMLImageElement`. SVG content is injected via `dangerouslySetInnerHTML` — use only with trusted, controlled asset sources.

---

## Hooks

### `useAnimations(config)`

Memoizes a map of animation configs into `Record<string, Animation>`. The `config` object must be stable (defined outside the component or wrapped in `useMemo`); if it changes identity on every render the animations will be recreated and the controller re-initialized.

```tsx
const config = useMemo(() => ({
  idle:   { frames: [...], loop: true },
  walk:   { frames: [...], loop: true },
  attack: { frames: [...], loop: false, speed: 1.5 },
}), []);

const animations = useAnimations(config);
```

### `useAnimation(id, frames, options?)`

Build a single `Animation` object:

```tsx
const idle = useAnimation('idle', [
  { sprite: '/idle-1.png', duration: 200 },
  { sprite: '/idle-2.png', duration: 200 },
], { loop: true });
```

### `useAnimationControl()`

Control an animated sprite without threading a `ref` through props:

```tsx
const control = useAnimationControl();

// call control.setControlFunctions(ref.current) once the sprite is ready,
// then use control.playAnimation / pauseAnimation / etc. anywhere in the tree
```

### `usePreloadSprites(sources)`

Preload a list of assets in parallel with progress tracking:

```tsx
const { loading, progress, error } = usePreloadSprites([
  '/sprites/hero.png',
  '/sprites/tileset.png',
  '/icons/ui.svg',
]);

if (loading) return <ProgressBar value={progress} />;
```

### `useSpriteSheetAnimation(src, config, frameDuration?)`

Compute `ExtractedFrame` descriptors for every cell in a sprite sheet:

```tsx
const { src, frames, config } = useSpriteSheetAnimation(
  '/sprites/player.png',
  { frameWidth: 32, frameHeight: 32, cols: 8, rows: 4 },
  100
);
```

---

## TypeScript

All public types are exported:

```typescript
import type {
  Animation,
  Frame,
  AnimationState,
  AnimatedSpriteRef,
  SpriteProps,
  AnimatedSpriteProps,
  SpriteSheetConfig,
  ExtractedFrame,
} from '@infinite-dungeon/sprite-manager';
```

---

## Requirements

- React ≥ 18
- Modern browser — Canvas API (`Sprite`, `AnimatedSprite`), `fetch` (`SvgSprite`, `SvgAnimatedSprite`)

## License

MIT
