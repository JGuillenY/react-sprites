import { useState, useEffect, useRef } from "react";
import type { SpriteProps } from "./types";
import { useSpriteManager } from "./SpriteManager";

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
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);

  useEffect(() => { onLoadRef.current = onLoad; }, [onLoad]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  useEffect(() => {
    let isMounted = true;

    preloadResource(src)
      .then(() => {
        if (isMounted) {
          setIsLoaded(true);
          onLoadRef.current?.();
        }
      })
      .catch(err => {
        if (isMounted) {
          const loadError = err instanceof Error ? err : new Error("Failed to load sprite");
          setError(loadError);
          onErrorRef.current?.(loadError);
        }
      });

    return () => { isMounted = false; };
  }, [src, preloadResource]);

  const transformStyle = {
    transform: `translate(${transform.x || 0}px, ${transform.y || 0}px) rotate(${transform.rotation || 0}deg) scale(${transform.scaleX || 1}, ${transform.scaleY || 1})`,
    opacity: transform.opacity !== undefined ? transform.opacity : 1,
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    ...(transform.frameData ? {
      objectFit: 'none' as const,
      objectPosition: `-${transform.frameData.x}px -${transform.frameData.y}px`,
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
    />
  );
}

export default ImgSprite;
