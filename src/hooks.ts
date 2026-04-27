import { useCallback, useRef, useMemo, useEffect } from "react";
import type { Animation } from "./types";

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
  // Destructure to primitive/stable deps so a new options object reference
  // from the caller doesn't invalidate the memo on every render.
  const name = options?.name;
  const loop = options?.loop;
  const speed = options?.speed;
  const onComplete = options?.onComplete;

  // Stable wrapper so an inline onComplete function doesn't cause recreation.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  const stableOnComplete = useCallback(() => onCompleteRef.current?.(), []);

  return useMemo(() => ({
    id,
    name: name ?? id,
    frames: frames.map((frame, index) => ({
      id: index,
      duration: frame.duration,
      sprite: frame.sprite,
    })),
    loop,
    speed,
    onComplete: onComplete !== undefined ? stableOnComplete : undefined,
  }), [id, frames, name, loop, speed, stableOnComplete, onComplete]);
}

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
  return useMemo(() => {
    const result: Record<string, Animation> = {};
    for (const [animId, config] of Object.entries(animations)) {
      result[animId] = {
        id: animId,
        name: animId,
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
    return result;
  }, [animations]);
}

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

  const playAnimation = useCallback((animationId: string, forceRestart = false) =>
    playRef.current(animationId, forceRestart), []);
  const pauseAnimation = useCallback(() => pauseRef.current(), []);
  const resumeAnimation = useCallback(() => resumeRef.current(), []);
  const stopAnimation = useCallback(() => stopRef.current(), []);
  const setAnimationSpeed = useCallback((speed: number) => setSpeedRef.current(speed), []);

  return {
    setControlFunctions,
    playAnimation,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    setAnimationSpeed,
  };
}
