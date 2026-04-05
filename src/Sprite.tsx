import { useEffect, useRef, useState } from "react";
import type { SpriteProps } from "./types";
import { useSpriteManager } from "./SpriteManager";

/**
 * Static Sprite component for rendering non-animated images
 * 
 * Features:
 * - Image preloading and caching
 * - Error handling
 * - Transform support (position, scale, rotation, opacity)
 * - Sprite sheet support (extract specific frames)
 * - Callbacks for load/error events
 */
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

  // Check if this sprite has frame data for sprite sheet extraction
  const hasFrameData = 'frameData' in transform && transform.frameData;

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

  // Draw the sprite to canvas when loaded or transform changes
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resource = getResource(src);
    if (!resource?.image) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transforms
    ctx.save();
    
    // Set opacity
    if (transform.opacity !== undefined) {
      ctx.globalAlpha = transform.opacity;
    }

    // Translate to position
    const x = transform.x || 0;
    const y = transform.y || 0;
    ctx.translate(x, y);

    // Apply rotation (convert degrees to radians)
    if (transform.rotation !== undefined) {
      const rotationRad = (transform.rotation * Math.PI) / 180;
      ctx.rotate(rotationRad);
    }

    // Apply scale
    const scaleX = transform.scaleX || 1;
    const scaleY = transform.scaleY || 1;
    ctx.scale(scaleX, scaleY);

    // Draw the image
    const resourceImage = resource.image;
    
    // Calculate draw dimensions
    let drawWidth: number;
    let drawHeight: number;
    
    // If no dimensions specified, use natural dimensions or frame data
    if (width) {
      drawWidth = width;
    } else if (hasFrameData && (transform.frameData as any)?.width) {
      drawWidth = (transform.frameData as any).width;
    } else {
      drawWidth = resourceImage.naturalWidth || 0;
    }
    
    if (height) {
      drawHeight = height;
    } else if (hasFrameData && (transform.frameData as any)?.height) {
      drawHeight = (transform.frameData as any).height;
    } else {
      drawHeight = resourceImage.naturalHeight || 0;
    }

    // Don't draw if dimensions are zero
    if (drawWidth <= 0 || drawHeight <= 0) {
      console.warn('Sprite: Cannot draw with zero dimensions', { src, drawWidth, drawHeight });
      ctx.restore();
      return;
    }

    // Center the image if no position specified
    const drawX = transform.x === undefined ? -drawWidth / 2 : 0;
    const drawY = transform.y === undefined ? -drawHeight / 2 : 0;
    
    try {
      // Check if we need to draw a specific frame from a sprite sheet
      if (hasFrameData && transform.frameData) {
        const frameData = transform.frameData as any;
        
        // Draw specific frame from sprite sheet
        ctx.drawImage(
          resourceImage,
          frameData.x, frameData.y, frameData.width, frameData.height, // Source rectangle (sprite sheet)
          drawX, drawY, drawWidth, drawHeight // Destination rectangle
        );
      } else {
        // Draw the entire image
        ctx.drawImage(resourceImage, drawX, drawY, drawWidth, drawHeight);
      }
    } catch (error) {
      console.error('Sprite: Failed to draw image', { src, error, drawWidth, drawHeight });
    }
    
    ctx.restore();
  }, [isLoaded, src, width, height, transform, getResource, hasFrameData]);

  // Set canvas dimensions
  useEffect(() => {
    if (!canvasRef.current) return;

    const resource = getResource(src);
    if (!resource?.image) return;

    const canvas = canvasRef.current;
    const resourceImage = resource.image;

    // Calculate dimensions
    let canvasWidth: number;
    let canvasHeight: number;

    if (hasFrameData && transform.frameData) {
      // Use frame dimensions for sprite sheet
      const frameData = transform.frameData as any;
      canvasWidth = width || frameData.width;
      canvasHeight = height || frameData.height;
    } else {
      // Use natural image dimensions
      canvasWidth = width || resourceImage.naturalWidth;
      canvasHeight = height || resourceImage.naturalHeight;
    }

    // Set canvas dimensions
    canvas.width = canvasWidth || 0;
    canvas.height = canvasHeight || 0;

    // Set CSS dimensions for display
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
  }, [src, width, height, transform, getResource, hasFrameData]);

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
      data-has-frame-data={hasFrameData ? "true" : "false"}
    />
  );
}

// Default export for convenience
export default Sprite;