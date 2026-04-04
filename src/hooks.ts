import { useCallback, useRef, useMemo } from "react";
import type { Animation } from "./types";

/**
 * Hook for creating animation definitions
 */
export function useAnimation(
  id: string,
  frames: Array<{ sprite: string; duration: number }>,
  options?: {
    name?: string;
    loop?: boolean;
    speed?: number;
    onComplete?: () => void;
  }
): Animation {
  // Use useMemo to prevent recreating animation on every render
  return useMemo(() => ({
    id,
    name: options?.name || id,
    frames: frames.map((frame, index) => ({
      id: index,
      duration: frame.duration,
      sprite: frame.sprite,
    })),
    loop: options?.loop,
    speed: options?.speed,
    onComplete: options?.onComplete,
  }), [id, frames, options]); // Recreate only when dependencies change
}

/**
 * Hook for creating multiple animations
 */
export function useAnimations(
  animations: Record<
    string,
    {
      frames: Array<{ sprite: string; duration: number }>;
      loop?: boolean;
      speed?: number;
      onComplete?: () => void;
    }
  >
): Record<string, Animation> {
  // Use useMemo to prevent recreating animations on every render
  const result = useMemo(() => {
    const memoizedResult: Record<string, Animation> = {};

    for (const [id, config] of Object.entries(animations)) {
      memoizedResult[id] = {
        id,
        name: id,
        frames: config.frames.map((frame, index) => ({
          id: index,
          duration: frame.duration,
          sprite: frame.sprite,
        })),
        loop: config.loop,
        speed: config.speed,
        onComplete: config.onComplete,
      };
    }

    return memoizedResult;
  }, [animations]); // Recreate only when animations input changes

  return result;
}

/**
 * Hook for controlling an AnimatedSprite from parent components
 */
export function useAnimationControl() {
  const playRef = useRef<(animationId: string, forceRestart?: boolean) => boolean>(() => false);
  const pauseRef = useRef<() => void>(() => {});
  const resumeRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});
  const setSpeedRef = useRef<(speed: number) => void>(() => {});

  const setControlFunctions = useCallback((controls: {
    playAnimation: (animationId: string, forceRestart?: boolean) => boolean;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    stopAnimation: () => void;
    setAnimationSpeed: (speed: number) => void;
  }) => {
    playRef.current = controls.playAnimation;
    pauseRef.current = controls.pauseAnimation;
    resumeRef.current = controls.resumeAnimation;
    stopRef.current = controls.stopAnimation;
    setSpeedRef.current = controls.setAnimationSpeed;
  }, []);

  const playAnimation = useCallback((animationId: string, forceRestart: boolean = false) => {
    return playRef.current(animationId, forceRestart);
  }, []);

  const pauseAnimation = useCallback(() => {
    pauseRef.current();
  }, []);

  const resumeAnimation = useCallback(() => {
    resumeRef.current();
  }, []);

  const stopAnimation = useCallback(() => {
    stopRef.current();
  }, []);

  const setAnimationSpeed = useCallback((speed: number) => {
    setSpeedRef.current(speed);
  }, []);

  return {
    setControlFunctions,
    playAnimation,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    setAnimationSpeed,
  };
}

/**
 * Hook for creating a simple sprite sheet animation
 * Note: This is a basic implementation. For full sprite sheet support,
 * you'll need to implement custom rendering logic.
 */
export function useSpriteSheetAnimation(
  spriteSheet: string,
  _frameWidth: number, // Currently unused, reserved for future implementation
  _frameHeight: number, // Currently unused, reserved for future implementation
  frameCount: number,
  frameDuration: number = 100
): Animation[] {
  const animations: Animation[] = [];

  // Create a simple animation that cycles through all frames
  const frames = Array.from({ length: frameCount }, () => {
    // TODO: Implement proper sprite sheet coordinate calculation
    // For now, we just use the full sprite sheet for each frame
    
    return {
      sprite: spriteSheet,
      duration: frameDuration,
      transform: {
        // Sprite sheet coordinates would be implemented here
        // For example: translate based on frame index
      },
    };
  });

  animations.push({
    id: "default",
    name: "Default",
    frames: frames.map((frame, index) => ({
      id: index,
      duration: frame.duration,
      sprite: frame.sprite,
      transform: frame.transform,
    })),
    loop: true,
  });

  return animations;
}