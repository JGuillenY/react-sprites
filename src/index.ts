/**
 * SpriteManager - A React-based sprite and animation management library for games
 * 
 * @package @infinite-dungeon/sprite-manager
 * @version 0.1.0
 */

// Core components
export { SpriteManagerProvider, useSpriteManager, usePreloadSprites } from "./SpriteManager";
export { Sprite } from "./Sprite";
export { AnimatedSprite } from "./AnimatedSprite";

// Core classes
export { AnimationController } from "./AnimationController";

// Hooks
export { useAnimation, useAnimations, useAnimationControl, useSpriteSheetAnimation } from "./hooks";

// Utilities
export { 
  calculateSpriteSheetFrames, 
  extractFrameToCanvas, 
  extractAllFrames,
  createAnimationFromSpriteSheet,
  useSpriteSheetAnimation as useSpriteSheetAnimationHook
} from "./spriteSheet";

// Types
export type {
  // Core types
  Frame,
  Animation,
  SpriteProps,
  AnimatedSpriteProps,
  AnimationState,
  SpriteResource,
  SpriteManagerState,
  SpriteManagerContextType,
  AnimatedSpriteRef,
  
  // Sprite sheet types
  SpriteSheetConfig,
  ExtractedFrame,
} from "./types";