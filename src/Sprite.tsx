import { useEffect, useRef, useState } from "react";
import type { SpriteProps } from "./types";
import { useSpriteManager } from "./SpriteManager";

export function Sprite({
  id,
  src,
  width,
  height,
  className = "",
  transform = {},
  onLoad,
  onError,
}: SpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getResource, preloadResource } = useSpriteManager();
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

  // Single effect: set dimensions first, then draw. Prevents canvas.width assignment
  // from clearing content that was drawn in a separate prior effect.
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const resource = getResource(src);
    if (!resource?.image) return;

    const resourceImage = resource.image;
    const frameData = transform.frameData;

    // 1. Set canvas dimensions before drawing
    const canvasWidth = width ?? frameData?.width ?? resourceImage.naturalWidth;
    const canvasHeight = height ?? frameData?.height ?? resourceImage.naturalHeight;

    canvas.width = canvasWidth || 0;
    canvas.height = canvasHeight || 0;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    if (!canvasWidth || !canvasHeight) {
      console.warn('Sprite: Cannot draw with zero dimensions', { src });
      return;
    }

    // 2. Draw
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    if (transform.opacity !== undefined) ctx.globalAlpha = transform.opacity;

    ctx.translate(transform.x || 0, transform.y || 0);
    if (transform.rotation !== undefined) ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.scaleX || 1, transform.scaleY || 1);

    const drawWidth = width ?? frameData?.width ?? resourceImage.naturalWidth ?? 0;
    const drawHeight = height ?? frameData?.height ?? resourceImage.naturalHeight ?? 0;
    const drawX = transform.x === undefined ? -drawWidth / 2 : 0;
    const drawY = transform.y === undefined ? -drawHeight / 2 : 0;

    try {
      if (frameData) {
        ctx.drawImage(
          resourceImage,
          frameData.x, frameData.y, frameData.width, frameData.height,
          drawX, drawY, drawWidth, drawHeight
        );
      } else {
        ctx.drawImage(resourceImage, drawX, drawY, drawWidth, drawHeight);
      }
    } catch (e) {
      console.error('Sprite: Failed to draw image', { src, error: e });
    }

    ctx.restore();
  }, [isLoaded, src, width, height, transform, getResource]);

  if (error) {
    return (
      <div className={`sprite-error ${className}`} title={error.message}>
        ❌ Failed to load sprite
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`sprite-loading ${className}`}>
        <div className="sprite-loading-spinner" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`sprite ${className}`}
      data-sprite-id={id}
      data-sprite-src={src}
      data-has-frame-data={transform.frameData ? "true" : "false"}
    />
  );
}

export default Sprite;
