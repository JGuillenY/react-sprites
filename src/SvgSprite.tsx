import { useState, useEffect, useRef } from "react";
import type { SpriteProps } from "./types";
import { useSpriteManager } from "./SpriteManager";
import { resizeSvg } from "./svgUtils";

export function SvgSprite({
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
  const { preloadResource, getResource } = useSpriteManager();
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
          const loadError = err instanceof Error ? err : new Error("Failed to load SVG");
          setError(loadError);
          onErrorRef.current?.(loadError);
        }
      });

    return () => { isMounted = false; };
  }, [src, preloadResource]);

  if (error) {
    return (
      <div className={`svg-sprite-error ${className}`} title={error.message}>
        Failed to load SVG sprite
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`svg-sprite-loading ${className}`}>
        <div className="svg-sprite-loading-spinner" />
      </div>
    );
  }

  const rawSvg = getResource(src)?.svgContent ?? "";
  const svgContent = resizeSvg(rawSvg, width, height);

  const wrapperStyle: React.CSSProperties = {
    display: "inline-block",
    transform: `translate(${transform.x || 0}px, ${transform.y || 0}px) rotate(${transform.rotation || 0}deg) scale(${transform.scaleX || 1}, ${transform.scaleY || 1})`,
    ...(transform.opacity !== undefined ? { opacity: transform.opacity } : {}),
  };

  return (
    <span
      id={id}
      className={`svg-sprite ${className}`}
      style={wrapperStyle}
      data-sprite-id={id}
      data-sprite-src={src}
      // SVG content from controlled asset sources — callers must not pass untrusted URLs
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default SvgSprite;
