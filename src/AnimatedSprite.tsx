import { forwardRef, useImperativeHandle } from "react";
import type { AnimatedSpriteProps, AnimatedSpriteRef } from "./types";
import { useAnimatedSpriteController } from "./useAnimatedSpriteController";
import { Sprite } from "./Sprite";

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
      paused = false,
      onAnimationComplete,
      onLoad,
    }: AnimatedSpriteProps,
    ref
  ) {
    const {
      currentFrame,
      isLoaded,
      error,
      playAnimation,
      pauseAnimation,
      resumeAnimation,
      stopAnimation,
      setAnimationSpeed,
      getAnimationState,
    } = useAnimatedSpriteController({ idle, animations, autoPlay, paused, onAnimationComplete, onLoad });

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
          <div className="animated-sprite-loading-text">Loading animation...</div>
        </div>
      );
    }

    return (
      <Sprite
        id={id}
        src={currentFrame.sprite}
        width={width}
        height={height}
        className={`animated-sprite ${className}`}
        transform={{ ...transform, ...currentFrame.transform }}
      />
    );
  }
);

export default AnimatedSprite;
