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
// Image-based components (simpler, more reliable)
export { ImgSprite } from "./ImgSprite";
export { ImgAnimatedSprite } from "./ImgAnimatedSprite";

// SVG components (inline rendering, no <img> element)
export { SvgSprite } from "./SvgSprite";
export { SvgAnimatedSprite } from "./SvgAnimatedSprite";

// Core classes
export { AnimationController } from "./AnimationController";

// Hooks
export { useAnimation, useAnimations, useAnimationControl } from "./hooks";
export { useSpriteSheetAnimation } from "./spriteSheet";

// Lower-level hook for building custom sprite components
export { useAnimatedSpriteController } from "./useAnimatedSpriteController";

// Utilities
export {
  calculateSpriteSheetFrames,
  extractFrameToCanvas,
  extractAllFrames,
  createAnimationFromSpriteSheet,
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
