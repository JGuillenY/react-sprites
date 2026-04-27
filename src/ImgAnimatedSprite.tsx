import { forwardRef, useImperativeHandle } from "react";
import type { AnimatedSpriteProps, AnimatedSpriteRef } from "./types";
import { useAnimatedSpriteController } from "./useAnimatedSpriteController";

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

    const transformStyle = {
      transform: `translate(${transform.x || 0}px, ${transform.y || 0}px) rotate(${transform.rotation || 0}deg) scale(${transform.scaleX || 1}, ${transform.scaleY || 1})`,
      opacity: transform.opacity !== undefined ? transform.opacity : 1,
      width: width ? `${width}px` : undefined,
      height: height ? `${height}px` : undefined,
      ...(currentFrame.frameData ? {
        objectFit: 'none' as const,
        objectPosition: `-${currentFrame.frameData.x}px -${currentFrame.frameData.y}px`,
      } : {}),
    };

    const animState = getAnimationState();

    return (
      <img
        id={id}
        src={currentFrame.sprite}
        className={`img-animated-sprite ${className}`}
        style={transformStyle}
        alt={`Animated Sprite: ${id}`}
        data-sprite-id={id}
        data-current-animation={animState?.currentAnimation ?? 'none'}
        data-current-frame={animState?.currentFrame ?? 0}
      />
    );
  }
);

export default ImgAnimatedSprite;
