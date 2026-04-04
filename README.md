# SpriteManager

A React-based sprite and animation management library for games. Built with TypeScript, optimized for performance, and designed to replace heavyweight libraries like Pixi.js for 2D game development.

## Features

- 🎨 **Canvas-based rendering** - High-performance sprite rendering
- 🎬 **Animation system** - Frame-based animations with timing control
- 📦 **Resource management** - Automatic preloading and caching
- 🧩 **Sprite sheet support** - Extract frames from grid-based sprite sheets
- 🔄 **Animation control** - Play, pause, resume, stop, speed control
- 🎯 **TypeScript support** - Full type safety
- ⚡ **Performance optimized** - Minimal re-renders, efficient updates
- 🎮 **Game-ready** - Designed for React-based games

## Installation

```bash
npm install @infinite-dungeon/sprite-manager
# or
yarn add @infinite-dungeon/sprite-manager
```

## Quick Start

```tsx
import React from 'react';
import { 
  SpriteManagerProvider, 
  AnimatedSprite, 
  useAnimations 
} from '@infinite-dungeon/sprite-manager';

function Game() {
  const animations = useAnimations({
    idle: {
      frames: [
        { sprite: '/sprites/character-idle-1.png', duration: 200 },
        { sprite: '/sprites/character-idle-2.png', duration: 200 },
      ],
      loop: true,
    },
    walk: {
      frames: [
        { sprite: '/sprites/character-walk-1.png', duration: 100 },
        { sprite: '/sprites/character-walk-2.png', duration: 100 },
      ],
      loop: true,
    },
  });

  return (
    <AnimatedSprite
      id="player"
      idle="idle"
      animations={animations}
      width={64}
      height={64}
      transform={{ x: 100, y: 100 }}
      autoPlay={true}
    />
  );
}

function App() {
  return (
    <SpriteManagerProvider>
      <Game />
    </SpriteManagerProvider>
  );
}
```

## Core Components

### SpriteManagerProvider
The context provider that manages sprite resources and caching. Wrap your app with this.

### Sprite
Static sprite component for rendering non-animated images.

```tsx
import { Sprite } from '@infinite-dungeon/sprite-manager';

<Sprite
  id="background"
  src="/sprites/background.png"
  width={800}
  height={600}
  transform={{ opacity: 0.8 }}
/>
```

### AnimatedSprite
Animated sprite component with multiple animations.

```tsx
import { AnimatedSprite, useAnimations } from '@infinite-dungeon/sprite-manager';

const animations = useAnimations({
  idle: { /* ... */ },
  attack: { /* ... */ },
  death: { /* ... */ },
});

<AnimatedSprite
  id="enemy"
  idle="idle"
  animations={animations}
  width={48}
  height={48}
/>
```

## Animation Control

Control animations via ref:

```tsx
import { useRef } from 'react';
import { AnimatedSprite, AnimatedSpriteRef } from '@infinite-dungeon/sprite-manager';

function Character() {
  const spriteRef = useRef<AnimatedSpriteRef>(null);

  const handleAttack = () => {
    spriteRef.current?.playAnimation('attack');
  };

  return (
    <>
      <AnimatedSprite ref={spriteRef} /* ... */ />
      <button onClick={handleAttack}>Attack!</button>
    </>
  );
}
```

## Sprite Sheets

Extract frames from sprite sheets:

```tsx
import { calculateSpriteSheetFrames } from '@infinite-dungeon/sprite-manager';

const frames = calculateSpriteSheetFrames({
  src: '/sprites/character-sheet.png',
  frameWidth: 32,
  frameHeight: 32,
  cols: 4,
  rows: 3,
  totalFrames: 10,
});

// Use frames with animations
const animations = useAnimations({
  walk: {
    frames: frames.map((frame, index) => ({
      sprite: '/sprites/character-sheet.png',
      duration: 100,
      frameData: frame, // Pass frame coordinates
    })),
    loop: true,
  },
});
```

## Hooks

### useAnimations
Create animation definitions with memoization.

### useAnimationControl
Control animations from parent components.

### usePreloadSprites
Preload multiple sprite resources with progress tracking.

```tsx
const { loading, progress } = usePreloadSprites([
  '/sprites/player.png',
  '/sprites/enemy.png',
  '/sprites/background.png',
]);
```

## Performance Features

- **Automatic caching** - Sprites are loaded once and cached
- **Promise-based loading** - Prevents duplicate loads
- **Canvas rendering** - More efficient than DOM images for games
- **Minimal re-renders** - Optimized with React hooks
- **Memory management** - Clear cache when needed

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { 
  Animation, 
  Frame, 
  SpriteProps,
  AnimatedSpriteRef 
} from '@infinite-dungeon/sprite-manager';
```

## Browser Support

- Modern browsers with Canvas support
- React 18+
- TypeScript 5.0+

## License

MIT

## Contributing

This library was extracted from the Infinite Dungeon game project. Contributions are welcome!