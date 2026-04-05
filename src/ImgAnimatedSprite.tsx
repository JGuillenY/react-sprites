import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from "react";
import type { AnimatedSpriteProps, Frame, AnimatedSpriteRef } from "./types";
import { useSpriteManager } from "./SpriteManager";
import { AnimationController } from "./AnimationController";

/**
 * Animated Sprite component using <img> tag with src swapping
 * 
 * Advantages over canvas:
 * - Simpler animation logic
 * - Browser handles image rendering
 * - CSS transforms work naturally
 * - No canvas rendering bugs
 */
export const ImgAnimatedSprite = forwardRef<AnimatedSpriteRef, AnimatedSpriteProps>(
  function ImgAnimatedSprite(
    {
      id,
      idle,
      animations,
      width,
      height,
      className = "",
      transform = {},
      autoPlay = true,
      paused = false,
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
    
    // Use refs to track props that shouldn't trigger re-renders
    const animationsRef = useRef(animations);
    const idleRef = useRef(idle);
    const onAnimationCompleteRef = useRef(onAnimationComplete);
    
    // Update refs when props change
    useEffect(() => {
      animationsRef.current = animations;
    }, [animations]);
    
    useEffect(() => {
      idleRef.current = idle;
    }, [idle]);
    
    useEffect(() => {
      onAnimationCompleteRef.current = onAnimationComplete;
    }, [onAnimationComplete]);

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
      let isMounted = true;
      
      const loadAllSprites = async () => {
        try {
          const loadPromises = allSpriteSources.map(src => preloadResource(src));
          await Promise.all(loadPromises);
          if (isMounted) {
            setIsLoaded(true);
            onLoad?.();
          }
        } catch (err) {
          if (isMounted) {
            const error = err instanceof Error ? err : new Error("Failed to load sprite resources");
            setError(error);
          }
        }
      };

      loadAllSprites();
      
      return () => {
        isMounted = false;
      };
    }, [allSpriteSources, preloadResource, onLoad]);

    // Initialize animation controller
    useEffect(() => {
      if (!isLoaded || !animationsRef.current[idleRef.current]) {
        return;
      }

      const initialState = {
        currentAnimation: idleRef.current,
        currentFrame: 0,
        frameTime: 0,
        isPlaying: false,
        isPaused: false,
        speed: animationsRef.current[idleRef.current].speed || 1.0,
      };

      const controller = new AnimationController(
        initialState,
        animationsRef.current,
        {
          onFrameChange: (frame) => {
            setCurrentFrame(frame);
          },
          onAnimationComplete: (animationId) => {
            onAnimationCompleteRef.current?.(animationId);
            
            // If it's not a looping animation and it completes,
            // automatically switch back to idle
            if (animationId !== idleRef.current && animationsRef.current[animationId]?.loop === false) {
              setTimeout(() => {
                // Use the current playAnimation function
                if (animationControllerRef.current) {
                  animationControllerRef.current.playAnimation(idleRef.current);
                }
              }, 100); // Small delay before switching back to idle
            }
          },
        }
      );

      animationControllerRef.current = controller;

      if (autoPlay) {
        controller.playAnimation(idleRef.current);
      }

      // Set initial frame
      const initialFrame = animationsRef.current[idleRef.current].frames[0];
      setCurrentFrame(initialFrame);

      return () => {
        controller.destroy();
        animationControllerRef.current = null;
      };
    }, [isLoaded, autoPlay]); // Only depend on isLoaded and autoPlay

    // Play an animation
    const playAnimation = useCallback((animationId: string, forceRestart: boolean = false) => {
      if (!animationControllerRef.current) {
        console.warn("Animation controller not initialized");
        return false;
      }

      if (!animationsRef.current[animationId]) {
        console.warn(`Animation "${animationId}" not found`);
        return false;
      }

      return animationControllerRef.current.playAnimation(animationId, forceRestart);
    }, []); // No dependencies - uses ref

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

    // Handle paused prop
    useEffect(() => {
      if (!animationControllerRef.current) {
        return;
      }
      
      if (paused) {
        animationControllerRef.current.pause();
      } else {
        animationControllerRef.current.resume();
      }
    }, [paused]);

    // Expose control methods via ref
    useImperativeHandle(ref, () => ({
      playAnimation,
      pauseAnimation,
      resumeAnimation,
      stopAnimation,
      setAnimationSpeed,
      getAnimationState,
    }), [playAnimation, pauseAnimation, resumeAnimation, stopAnimation, setAnimationSpeed, getAnimationState]);

    // Build CSS transform string
    const transformStyle = {
      transform: `
        translate(${transform.x || 0}px, ${transform.y || 0}px)
        rotate(${transform.rotation || 0}deg)
        scale(${transform.scaleX || 1}, ${transform.scaleY || 1})
      `.trim(),
      opacity: transform.opacity !== undefined ? transform.opacity : 1,
      width: width ? `${width}px` : undefined,
      height: height ? `${height}px` : undefined,
      // Handle sprite sheet frames
      ...(currentFrame?.frameData ? {
        objectFit: 'none' as const,
        objectPosition: `-${currentFrame.frameData.x || 0}px -${currentFrame.frameData.y || 0}px`,
      } : {}),
    };

    if (error) {
      return (
        <div className={`img-animated-sprite-error ${className}`} title={error.message}>
          ❌ Failed to load animated sprite
        </div>
      );
    }

    if (!isLoaded || !currentFrame) {
      return (
        <div className={`img-animated-sprite-loading ${className}`}>
          <div className="img-animated-sprite-loading-spinner" />
        </div>
      );
    }

    return (
      <img
        id={id}
        src={currentFrame.sprite}
        className={`img-animated-sprite ${className}`}
        style={transformStyle}
        alt={`Animated Sprite: ${id}`}
        data-sprite-id={id}
        data-current-animation={animationControllerRef.current?.getState()?.currentAnimation || 'none'}
        data-current-frame={animationControllerRef.current?.getState()?.currentFrame || 0}
      />
    );
  }
);

// Default export for convenience
export default ImgAnimatedSprite;