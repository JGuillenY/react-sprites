# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a two-part project:

- **`/src`** — The library itself (`@infinite-dungeon/sprite-manager`), a React sprite/animation management library for games.
- **`/demo`** — A Vite + React demo app that imports the library directly via relative path (`../../src/`), not through npm. Runs on port 5175.

## Commands

**Library root (`/`):**
```bash
npm run build       # tsc + vite build → dist/
npm run dev         # vite dev server for library
npm run type-check  # tsc --noEmit
npm run clean       # rm -rf dist
```

**Demo app (`/demo`):**
```bash
npm run dev     # starts on http://localhost:5175 (opens browser automatically)
npm run build   # tsc + vite build
```

There are no tests in this repository.

## Architecture

### Resource management — `SpriteManager.tsx`

`SpriteManagerProvider` is a React context that deduplicates and caches image loads. The key design constraint: **only fully-loaded resources are stored in React state** to avoid infinite re-render loops. In-progress and errored loads are tracked exclusively in refs (`loadingPromisesRef`, `loadingResourcesRef`, `errorResourcesRef`). This distinction is intentional and must be preserved when modifying the loading logic.

### Animation engine — `AnimationController.ts`

A plain class (not a hook) that drives frame advancement via `requestAnimationFrame`. Relevant invariants:
- `deltaTime` is capped at 1000ms to prevent huge frame jumps after tab visibility changes.
- Speed is clamped to [0.1, 10] via `setSpeed`.
- Non-looping animations (`loop: false`) emit `onAnimationComplete` and stop at the last frame; `AnimatedSprite`/`ImgAnimatedSprite` automatically transition back to the `idle` animation after a 100ms `setTimeout`.

### Two animated sprite implementations

| Component | Rendering | When to use |
|---|---|---|
| `Sprite` / `AnimatedSprite` | Canvas (`<canvas>`) | Sprite-sheet frame extraction via `ctx.drawImage` |
| `ImgSprite` / `ImgAnimatedSprite` | `<img>` src-swapping | Preferred for individual-frame animations; simpler and no canvas bugs |

Both expose the same `AnimatedSpriteRef` interface (via `forwardRef` + `useImperativeHandle`): `playAnimation`, `pauseAnimation`, `resumeAnimation`, `stopAnimation`, `setAnimationSpeed`, `getAnimationState`.

### Hooks (`hooks.ts`)

- `useAnimations(config)` — Memoized animation map. **The config object passed in must itself be memoized** (e.g. with `useMemo`) or animations will be recreated on every render and trigger re-initialization of the `AnimationController`.
- `useAnimationControl()` — Lets a parent component drive an `AnimatedSprite` without a ref by injecting control functions through `setControlFunctions`.
- `usePreloadSprites(sources)` — Parallel preload with `{ loading, progress, error }` state.

### Sprite sheet utilities (`spriteSheet.ts`)

`calculateSpriteSheetFrames` computes pixel coordinates for a grid-based sheet. `extractAllFrames` draws each frame to a canvas and returns data URLs. `createAnimationFromSpriteSheet` returns frame descriptors with `frameData` attached; `ImgAnimatedSprite` uses `object-position` CSS to clip the sprite sheet to the correct frame when `frameData` is present on a frame.

### Demo routing

Routes are defined in `demo/src/routes.tsx` using `createBrowserRouter`. Each route under `/` renders inside `App`, which wraps everything in `SpriteManagerProvider`. The demo imports from `../../src/index` directly (the Vite alias `@sprite-manager` also resolves to `../src`).
