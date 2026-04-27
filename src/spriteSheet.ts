import { useMemo } from "react";

/**
 * Sprite Sheet Utilities
 *
 * Functions for extracting individual frames from sprite sheets
 */

export interface SpriteSheetConfig {
  /** Path to the sprite sheet image */
  src: string;
  /** Width of each frame in pixels */
  frameWidth: number;
  /** Height of each frame in pixels */
  frameHeight: number;
  /** Number of columns in the sprite sheet */
  cols: number;
  /** Number of rows in the sprite sheet */
  rows: number;
  /** Total number of frames (optional, defaults to cols * rows) */
  totalFrames?: number;
}

export interface ExtractedFrame {
  /** Frame index (0-based) */
  index: number;
  /** Column position (0-based) */
  col: number;
  /** Row position (0-based) */
  row: number;
  /** X coordinate in sprite sheet (pixels) */
  x: number;
  /** Y coordinate in sprite sheet (pixels) */
  y: number;
  /** Width of frame (pixels) */
  width: number;
  /** Height of frame (pixels) */
  height: number;
}

/**
 * Calculate frame positions in a sprite sheet
 */
export function calculateSpriteSheetFrames(config: SpriteSheetConfig): ExtractedFrame[] {
  const { frameWidth, frameHeight, cols, rows, totalFrames } = config;
  const frameCount = totalFrames || cols * rows;
  const frames: ExtractedFrame[] = [];

  for (let i = 0; i < frameCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // Check if we've exceeded available rows
    if (row >= rows) {
      console.warn(`Frame ${i} exceeds sprite sheet bounds (max ${cols * rows} frames)`);
      break;
    }

    frames.push({
      index: i,
      col,
      row,
      x: col * frameWidth,
      y: row * frameHeight,
      width: frameWidth,
      height: frameHeight,
    });
  }

  return frames;
}

/**
 * Create a canvas element with a single frame extracted from a sprite sheet
 */
export function extractFrameToCanvas(
  image: HTMLImageElement,
  frame: ExtractedFrame
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = frame.width;
  canvas.height = frame.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Draw the specific frame from the sprite sheet
  ctx.drawImage(
    image,
    frame.x, frame.y, frame.width, frame.height, // Source rectangle
    0, 0, frame.width, frame.height // Destination rectangle
  );

  return canvas;
}

/**
 * Extract all frames from a sprite sheet as data URLs
 */
export async function extractAllFrames(
  src: string,
  config: SpriteSheetConfig
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    
    image.onload = () => {
      try {
        const frames = calculateSpriteSheetFrames(config);
        const dataUrls: string[] = [];
        
        for (const frame of frames) {
          const canvas = extractFrameToCanvas(image, frame);
          dataUrls.push(canvas.toDataURL());
        }
        
        resolve(dataUrls);
      } catch (error) {
        reject(error);
      }
    };
    
    image.onerror = () => {
      reject(new Error(`Failed to load sprite sheet: ${src}`));
    };
    
    image.src = src;
  });
}

/**
 * Create animation frames from a sprite sheet
 */
export function createAnimationFromSpriteSheet(
  src: string,
  config: SpriteSheetConfig,
  frameDuration: number = 100
): Array<{ sprite: string; duration: number }> {
  const frames = calculateSpriteSheetFrames(config);
  
  return frames.map((frame) => ({
    sprite: src,
    duration: frameDuration,
    transform: {
      // We'll use CSS clipping to show specific parts of the sprite sheet
      // This is more efficient than extracting to separate images
    },
    // Store frame coordinates for custom rendering
    frameData: frame,
  }));
}

/**
 * Hook for using sprite sheets with the animation system
 */
export function useSpriteSheetAnimation(
  src: string,
  config: SpriteSheetConfig,
  frameDuration: number = 100
) {
  // Destructure config to primitives so a new config object reference from the
  // caller doesn't invalidate the memo on every render.
  const { frameWidth, frameHeight, cols, rows, totalFrames } = config;

  return useMemo(() => {
    const sheetConfig: SpriteSheetConfig = { src, frameWidth, frameHeight, cols, rows, totalFrames };
    const frames = calculateSpriteSheetFrames(sheetConfig);
    return {
      src,
      frames: frames.map(frame => ({
        sprite: src,
        duration: frameDuration,
        frameData: frame,
      })),
      config: sheetConfig,
    };
  }, [src, frameWidth, frameHeight, cols, rows, totalFrames, frameDuration]);
}