import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from "react";
import type { AnimatedSpriteProps, Frame, AnimatedSpriteRef } from "./types";
import { AnimationController } from "./AnimationController";
import { useSpriteManager } from "./SpriteManager";
import { Sprite } from "./Sprite";

/**
 * Animated Sprite component for rendering sprite animations
 * 
 * Features:
 * - Multiple animation support (idle, walk, attack, death, etc.)
 * - Frame sequencing with duration control
 * - Loop and one-shot animations
 * - Animation transitions
 * - Playback control (play, pause, stop, speed)
 * - Preloading of all animation frames
 */

export const AnimatedSprite = forwardRef<AnimatedSpriteRef, AnimatedSpriteProps>(
  function AnimatedSprite(
    {
      id,
      idle,
      animations,
      width,
      height,
      className = "",
      transform = {},
      autoPlay = true,
      onAnimationComplete,
      onLoad,
    }: AnimatedSpriteProps,
    ref
  ) {
    const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const animationControllerRef = useRef<AnimationController | null>(null);
    const { preloadResource } = useSpriteManager();

    // Collect all unique sprite sources from all animations (memoized)
    const allSpriteSources = useMemo(() => 
      Array.from(
        new Set(
          Object.values(animations).flatMap(animation =>
            animation.frames.map(frame => frame.sprite)
          )
        )
      ),
      [animations]
    );

    // Preload all sprite resources
    useEffect(() => {
      const loadAllSprites = async () => {
        try {
          const loadPromises = allSpriteSources.map(src => preloadResource(src));
          await Promise.all(loadPromises);
          setIsLoaded(true);
          onLoad?.();
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Failed to load sprite resources");
          setError(error);
        }
      };

      loadAllSprites();
    }, [allSpriteSources, preloadResource, onLoad]);

    // Initialize animation controller
    useEffect(() => {
      if (!isLoaded || !animations[idle]) {
        return;
      }

      const initialState = {
        currentAnimation: idle,
        currentFrame: 0,
        frameTime: 0,
        isPlaying: false,
        isPaused: false,
        speed: animations[idle].speed || 1.0,
      };

      const controller = new AnimationController(
        initialState,
        animations,
        {
          onFrameChange: (frame) => {
            setCurrentFrame(frame);
          },
          onAnimationComplete: (animationId) => {
            onAnimationComplete?.(animationId);
            
            // If it's not a looping animation and it completes,
            // automatically switch back to idle
            if (animationId !== idle && animations[animationId]?.loop === false) {
              setTimeout(() => {
                playAnimation(idle);
              }, 100); // Small delay before switching back to idle
            }
          },
        }
      );

      animationControllerRef.current = controller;

      if (autoPlay) {
        controller.playAnimation(idle);
      }

      // Set initial frame
      const initialFrame = animations[idle].frames[0];
      setCurrentFrame(initialFrame);

      return () => {
        controller.destroy();
        animationControllerRef.current = null;
      };
    }, [isLoaded, idle, animations, autoPlay, onAnimationComplete]);

    // Play an animation
    const playAnimation = useCallback((animationId: string, forceRestart: boolean = false) => {
      if (!animationControllerRef.current) {
        console.warn("Animation controller not initialized");
        return false;
      }

      if (!animations[animationId]) {
        console.warn(`Animation "${animationId}" not found`);
        return false;
      }

      return animationControllerRef.current.playAnimation(animationId, forceRestart);
    }, [animations]);

    // Control functions
    const pauseAnimation = useCallback(() => {
      animationControllerRef.current?.pause();
    }, []);

    const resumeAnimation = useCallback(() => {
      animationControllerRef.current?.resume();
    }, []);

    const stopAnimation = useCallback(() => {
      animationControllerRef.current?.stop();
    }, []);

    const setAnimationSpeed = useCallback((speed: number) => {
      animationControllerRef.current?.setSpeed(speed);
    }, []);

    const getAnimationState = useCallback(() => {
      return animationControllerRef.current?.getState() || null;
    }, []);

    // Expose control methods via ref
    useImperativeHandle(ref, () => ({
      playAnimation,
      pauseAnimation,
      resumeAnimation,
      stopAnimation,
      setAnimationSpeed,
      getAnimationState,
    }), [playAnimation, pauseAnimation, resumeAnimation, stopAnimation, setAnimationSpeed, getAnimationState]);

    if (error) {
      return (
        <div className={`animated-sprite-error ${className}`} title={error.message}>
          ❌ Failed to load animated sprite
        </div>
      );
    }

    if (!isLoaded || !currentFrame) {
      return (
        <div className={`animated-sprite-loading ${className}`}>
          <div className="animated-sprite-loading-spinner" />
          <div className="animated-sprite-loading-text">
            Loading animation...
          </div>
        </div>
      );
    }

    // Combine frame transform with sprite transform
    const combinedTransform = {
      ...transform,
      ...currentFrame.transform,
    };

    return (
      <Sprite
        id={id}
        src={currentFrame.sprite}
        width={width}
        height={height}
        className={`animated-sprite ${className}`}
        transform={combinedTransform}
      />
    );
  }
);

// Default export for convenience
export default AnimatedSprite;