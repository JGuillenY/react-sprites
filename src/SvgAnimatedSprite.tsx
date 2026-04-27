import { forwardRef, useImperativeHandle } from "react";
import type { AnimatedSpriteProps, AnimatedSpriteRef } from "./types";
import { useAnimatedSpriteController } from "./useAnimatedSpriteController";
import { useSpriteManager } from "./SpriteManager";
import { resizeSvg } from "./svgUtils";

export const SvgAnimatedSprite = forwardRef<AnimatedSpriteRef, AnimatedSpriteProps>(
  function SvgAnimatedSprite(
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
    },
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

    const { getResource } = useSpriteManager();

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
        <div className={`svg-animated-sprite-error ${className}`} title={error.message}>
          Failed to load SVG animated sprite
        </div>
      );
    }

    if (!isLoaded || !currentFrame) {
      return (
        <div className={`svg-animated-sprite-loading ${className}`}>
          <div className="svg-animated-sprite-loading-spinner" />
        </div>
      );
    }

    const rawSvg = getResource(currentFrame.sprite)?.svgContent ?? "";
    const svgContent = resizeSvg(rawSvg, width, height);

    const wrapperStyle: React.CSSProperties = {
      display: "inline-block",
      transform: `translate(${transform.x || 0}px, ${transform.y || 0}px) rotate(${transform.rotation || 0}deg) scale(${transform.scaleX || 1}, ${transform.scaleY || 1})`,
      ...(transform.opacity !== undefined ? { opacity: transform.opacity } : {}),
    };

    const animState = getAnimationState();

    return (
      <span
        id={id}
        className={`svg-animated-sprite ${className}`}
        style={wrapperStyle}
        data-sprite-id={id}
        data-current-animation={animState?.currentAnimation ?? "none"}
        data-current-frame={animState?.currentFrame ?? 0}
        // SVG content from controlled asset sources — callers must not pass untrusted URLs
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }
);

export default SvgAnimatedSprite;
