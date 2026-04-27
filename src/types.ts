/**
 * Core types for the sprite and animation system
 */

export type Frame = {
  /** Unique identifier for the frame */
  id: number;
  /** Duration in milliseconds to display this frame */
  duration: number;
  /** Image source URL or path for this frame */
  sprite: string;
  /** Optional transform properties for the frame */
  transform?: {
    scaleX?: number;
    scaleY?: number;
    rotation?: number; // degrees
    opacity?: number; // 0-1
  };
  /** Optional sprite sheet frame data */
  frameData?: {
    /** X coordinate in sprite sheet (pixels) */
    x: number;
    /** Y coordinate in sprite sheet (pixels) */
    y: number;
    /** Width of frame (pixels) */
    width: number;
    /** Height of frame (pixels) */
    height: number;
    /** Column index (0-based) */
    col: number;
    /** Row index (0-based) */
    row: number;
  };
};

export type Animation = {
  /** Unique identifier for the animation */
  id: string;
  /** Display name for the animation */
  name: string;
  /** Array of frames in sequence */
  frames: Frame[];
  /** Whether the animation should loop (default: true for idle, false for one-shot) */
  loop?: boolean;
  /** Animation speed multiplier (1.0 = normal speed) */
  speed?: number;
  /** Callback when animation completes (for non-looping animations) */
  onComplete?: () => void;
};

export type SpriteProps = {
  /** Unique identifier for the sprite */
  id: string;
  /** Image source URL or path */
  src: string;
  /** Optional width in pixels */
  width?: number;
  /** Optional height in pixels */
  height?: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional transform properties */
  transform?: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    opacity?: number;
    /** Optional frame data for sprite sheets */
    frameData?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  /** Callback when sprite loads */
  onLoad?: () => void;
  /** Callback when sprite fails to load */
  onError?: (error: Error) => void;
};

export type AnimatedSpriteProps = {
  /** Unique identifier for the animated sprite */
  id: string;
  /** Default animation to play when no other animation is active */
  idle: string;
  /** Map of available animations */
  animations: Record<string, Animation>;
  /** Optional width in pixels */
  width?: number;
  /** Optional height in pixels */
  height?: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional initial transform properties */
  transform?: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    opacity?: number;
  };
  /** Whether to auto-play the idle animation on mount (default: true) */
  autoPlay?: boolean;
  /** Whether the animation is paused (default: false) */
  paused?: boolean;
  /** Callback when the current animation completes (for non-looping animations) */
  onAnimationComplete?: (animationId: string) => void;
  /** Callback when all sprites are loaded */
  onLoad?: () => void;
};

export type AnimationState = {
  /** Current animation ID */
  currentAnimation: string;
  /** Current frame index */
  currentFrame: number;
  /** Time elapsed on current frame in milliseconds */
  frameTime: number;
  /** Whether animation is playing */
  isPlaying: boolean;
  /** Whether animation is paused */
  isPaused: boolean;
  /** Animation playback speed multiplier */
  speed: number;
};

export type SpriteResource = {
  /** Image element (null for SVG resources) */
  image: HTMLImageElement;
  /** Whether the image is loaded */
  loaded: boolean;
  /** Loading error if any */
  error?: Error;
  /** Raw SVG text content, present only for .svg sources */
  svgContent?: string;
};

export type SpriteManagerState = {
  /** Map of sprite resources by source URL */
  resources: Record<string, SpriteResource>;
  /** Map of animation states by sprite ID */
  animationStates: Record<string, AnimationState>;
};

export type SpriteManagerContextType = {
  /** Get a sprite resource by source URL */
  getResource: (src: string) => SpriteResource | undefined;
  /** Preload a sprite resource */
  preloadResource: (src: string) => Promise<void>;
  /** Check if a resource is loaded */
  isResourceLoaded: (src: string) => boolean;
  /** Clear all cached resources */
  clearCache: () => void;
  /** Remove a specific resource from cache */
  removeResource: (src: string) => void;
  /** Get statistics about resource usage */
  getStats: () => {
    total: number;
    loaded: number;
    loading: number;
    errors: number;
  };
};

export type AnimatedSpriteRef = {
  /** Play a specific animation */
  playAnimation: (animationId: string, forceRestart?: boolean) => boolean;
  /** Pause the current animation */
  pauseAnimation: () => void;
  /** Resume the paused animation */
  resumeAnimation: () => void;
  /** Stop the current animation and return to idle */
  stopAnimation: () => void;
  /** Set animation playback speed */
  setAnimationSpeed: (speed: number) => void;
  /** Get current animation state */
  getAnimationState: () => AnimationState | null;
};

// Sprite sheet types (re-exported from spriteSheet.ts)
export type { SpriteSheetConfig, ExtractedFrame } from "./spriteSheet";