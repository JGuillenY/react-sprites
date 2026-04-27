import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { Animation, Frame, AnimationState } from "./types";
import { AnimationController } from "./AnimationController";
import { useSpriteManager } from "./SpriteManager";

type ControllerOptions = {
  idle: string;
  animations: Record<string, Animation>;
  autoPlay?: boolean;
  paused?: boolean;
  onAnimationComplete?: (animationId: string) => void;
  onLoad?: () => void;
};

type ControllerResult = {
  currentFrame: Frame | null;
  isLoaded: boolean;
  error: Error | null;
  playAnimation: (animationId: string, forceRestart?: boolean) => boolean;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  stopAnimation: () => void;
  setAnimationSpeed: (speed: number) => void;
  getAnimationState: () => AnimationState | null;
};

export function useAnimatedSpriteController({
  idle,
  animations,
  autoPlay = true,
  paused = false,
  onAnimationComplete,
  onLoad,
}: ControllerOptions): ControllerResult {
  const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const animationControllerRef = useRef<AnimationController | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { preloadResource } = useSpriteManager();

  // Refs for props that must not be effect dependencies
  const animationsRef = useRef(animations);
  const idleRef = useRef(idle);
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const onLoadRef = useRef(onLoad);

  useEffect(() => { animationsRef.current = animations; }, [animations]);
  useEffect(() => { idleRef.current = idle; }, [idle]);
  useEffect(() => { onAnimationCompleteRef.current = onAnimationComplete; }, [onAnimationComplete]);
  useEffect(() => { onLoadRef.current = onLoad; }, [onLoad]);

  const allSpriteSources = useMemo(() =>
    Array.from(new Set(
      Object.values(animations).flatMap(anim => anim.frames.map(f => f.sprite))
    )),
    [animations]
  );

  // Preload all frames in parallel
  useEffect(() => {
    let isMounted = true;

    Promise.all(allSpriteSources.map(src => preloadResource(src)))
      .then(() => {
        if (isMounted) {
          setIsLoaded(true);
          onLoadRef.current?.();
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to load sprite resources"));
        }
      });

    return () => { isMounted = false; };
  }, [allSpriteSources, preloadResource]);

  // Initialize controller once sprites are loaded
  useEffect(() => {
    if (!isLoaded || !animationsRef.current[idleRef.current]) return;

    const controller = new AnimationController(
      {
        currentAnimation: idleRef.current,
        currentFrame: 0,
        frameTime: 0,
        isPlaying: false,
        isPaused: false,
        speed: animationsRef.current[idleRef.current].speed ?? 1.0,
      },
      animationsRef.current,
      {
        onFrameChange: frame => setCurrentFrame(frame),
        onAnimationComplete: animationId => {
          onAnimationCompleteRef.current?.(animationId);
          if (
            animationId !== idleRef.current &&
            animationsRef.current[animationId]?.loop === false
          ) {
            completionTimeoutRef.current = setTimeout(() => {
              animationControllerRef.current?.playAnimation(idleRef.current);
            }, 100);
          }
        },
      }
    );

    animationControllerRef.current = controller;

    if (autoPlay) controller.playAnimation(idleRef.current);
    if (paused) controller.pause();

    setCurrentFrame(animationsRef.current[idleRef.current].frames[0] ?? null);

    return () => {
      if (completionTimeoutRef.current !== null) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
      controller.destroy();
      animationControllerRef.current = null;
    };
  }, [isLoaded, autoPlay]); // paused initial value applied inline above; changes handled below

  // Sync paused prop changes after controller exists
  useEffect(() => {
    const ctrl = animationControllerRef.current;
    if (!ctrl) return;
    paused ? ctrl.pause() : ctrl.resume();
  }, [paused]);

  const playAnimation = useCallback((animationId: string, forceRestart = false) => {
    if (!animationControllerRef.current) return false;
    if (!animationsRef.current[animationId]) {
      console.warn(`Animation "${animationId}" not found`);
      return false;
    }
    return animationControllerRef.current.playAnimation(animationId, forceRestart);
  }, []);

  const pauseAnimation = useCallback(() => { animationControllerRef.current?.pause(); }, []);
  const resumeAnimation = useCallback(() => { animationControllerRef.current?.resume(); }, []);
  const stopAnimation = useCallback(() => { animationControllerRef.current?.stop(); }, []);
  const setAnimationSpeed = useCallback((speed: number) => { animationControllerRef.current?.setSpeed(speed); }, []);
  const getAnimationState = useCallback(() => animationControllerRef.current?.getState() ?? null, []);

  return {
    currentFrame,
    isLoaded,
    error,
    playAnimation,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    setAnimationSpeed,
    getAnimationState,
  };
}
