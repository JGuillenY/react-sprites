import { useState, useEffect } from "react";
import type { SpriteProps } from "./types";
import { useSpriteManager } from "./SpriteManager";

/**
 * Simple Sprite component using <img> tag instead of canvas
 * 
 * Advantages:
 * - Simpler, more reliable
 * - Browser handles loading/error states
 * - CSS transforms work naturally
 * - No canvas rendering bugs
 */
export function ImgSprite({
  id,
  src,
  width,
  height,
  className = "",
  transform = {},
  onLoad,
  onError,
}: SpriteProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { preloadResource } = useSpriteManager();

  // Preload the sprite resource
  useEffect(() => {
    const loadSprite = async () => {
      try {
        await preloadResource(src);
        setIsLoaded(true);
        onLoad?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to load sprite");
        setError(error);
        onError?.(error);
      }
    };

    loadSprite();
  }, [src, preloadResource, onLoad, onError]);

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
    ...(transform.frameData ? {
      objectFit: 'none' as const,
      objectPosition: `-${transform.frameData.x || 0}px -${transform.frameData.y || 0}px`,
    } : {}),
  };

  if (error) {
    return (
      <div className={`img-sprite-error ${className}`} title={error.message}>
        ❌ Failed to load sprite
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`img-sprite-loading ${className}`}>
        <div className="img-sprite-loading-spinner" />
      </div>
    );
  }

  return (
    <img
      id={id}
      src={src}
      className={`img-sprite ${className}`}
      style={transformStyle}
      alt={`Sprite: ${id}`}
      data-sprite-id={id}
      data-sprite-src={src}
      onLoad={() => {
        setIsLoaded(true);
        onLoad?.();
      }}
      onError={() => {
        const error = new Error(`Failed to load image: ${src}`);
        setError(error);
        onError?.(error);
      }}
    />
  );
}

// Default export for convenience
export default ImgSprite;