import type { Animation, AnimationState, Frame } from "./types";

/**
 * Animation Controller - Core logic for managing sprite animations
 * 
 * Handles:
 * - Frame timing and sequencing
 * - Animation transitions
 * - Playback control (play, pause, stop, seek)
 * - Loop management
 * - Speed control
 */
export class AnimationController {
  private state: AnimationState;
  private animations: Record<string, Animation>;
  private lastUpdateTime: number = 0;
  private rafId: number | null = null;
  private onFrameChange?: (frame: Frame) => void;
  private onAnimationComplete?: (animationId: string) => void;

  constructor(
    initialState: AnimationState,
    animations: Record<string, Animation>,
    callbacks?: {
      onFrameChange?: (frame: Frame) => void;
      onAnimationComplete?: (animationId: string) => void;
    }
  ) {
    this.state = initialState;
    this.animations = animations;
    this.onFrameChange = callbacks?.onFrameChange;
    this.onAnimationComplete = callbacks?.onAnimationComplete;
  }

  /**
   * Get current animation
   */
  private getCurrentAnimation(): Animation | null {
    return this.animations[this.state.currentAnimation] || null;
  }

  /**
   * Get current frame
   */
  private getCurrentFrame(): Frame | null {
    const animation = this.getCurrentAnimation();
    if (!animation || animation.frames.length === 0) {
      return null;
    }
    return animation.frames[this.state.currentFrame];
  }

  /**
   * Update animation state based on elapsed time
   */
  private update(deltaTime: number): void {
    if (!this.state.isPlaying || this.state.isPaused) return;

    if (!Number.isFinite(deltaTime) || deltaTime <= 0) deltaTime = 16;
    if (deltaTime > 1000) deltaTime = 1000;

    if (!this.getCurrentAnimation()) return;

    this.state.frameTime += deltaTime * this.state.speed;

    // Consume as many frames as the accumulated time allows, carrying the remainder
    while (this.state.isPlaying) {
      const frame = this.getCurrentFrame();
      if (!frame) break;
      const frameDuration = frame.duration > 0 ? frame.duration : 100;
      if (this.state.frameTime < frameDuration) break;
      this.state.frameTime -= frameDuration;
      this.advanceFrame();
    }
  }

  /**
   * Advance to the next frame in the animation
   */
  private advanceFrame(): void {
    const animation = this.getCurrentAnimation();
    if (!animation) return;

    const frameCount = animation.frames.length;

    this.state.currentFrame++;

    if (this.state.currentFrame >= frameCount) {
      if (animation.loop !== false) {
        this.state.currentFrame = 0;
      } else {
        this.state.currentFrame = frameCount - 1;
        this.state.isPlaying = false;
        this.onAnimationComplete?.(animation.id);
      }
    }

    const newFrame = this.getCurrentFrame();
    if (newFrame) {
      this.onFrameChange?.(newFrame);
    }
  }

  /**
   * Start the animation loop
   */
  start(): void {
    if (this.rafId !== null) {
      return; // Already running
    }

    this.lastUpdateTime = performance.now();
    this.state.isPlaying = true;
    this.state.isPaused = false;

    const animate = (timestamp: number) => {
      if (!this.state.isPlaying) {
        this.rafId = null;
        return;
      }

      const deltaTime = timestamp - this.lastUpdateTime;
      this.lastUpdateTime = timestamp;

      this.update(deltaTime);

      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  /**
   * Pause the animation
   */
  pause(): void {
    this.state.isPaused = true;
  }

  /**
   * Resume the animation
   */
  resume(): void {
    this.state.isPaused = false;
    this.lastUpdateTime = performance.now();
  }

  /**
   * Stop the animation and reset to first frame
   */
  stop(): void {
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.currentFrame = 0;
    this.state.frameTime = 0;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Change to a different animation
   */
  playAnimation(animationId: string, forceRestart: boolean = false): boolean {
    if (!this.animations[animationId]) {
      console.warn(`Animation "${animationId}" not found`);
      return false;
    }

    const isSameAnimation = this.state.currentAnimation === animationId;
    
    if (isSameAnimation && !forceRestart) {
      if (this.state.isPaused) {
        this.resume();
      } else if (!this.state.isPlaying) {
        // Not started yet (e.g. freshly constructed controller)
        this.start();
      }
      return true;
    }

    // Stop current animation
    this.stop();

    // Switch to new animation
    this.state.currentAnimation = animationId;
    this.state.currentFrame = 0;
    this.state.frameTime = 0;
    this.state.isPlaying = true;
    this.state.isPaused = false;

    // Start the new animation
    this.start();

    // Notify frame change
    const frame = this.getCurrentFrame();
    if (frame) {
      this.onFrameChange?.(frame);
    }

    return true;
  }

  /**
   * Set animation playback speed
   */
  setSpeed(speed: number): void {
    // SAFETY: Clamp speed to reasonable range
    this.state.speed = Math.max(0.1, Math.min(10, speed));
  }

  /**
   * Jump to a specific frame in the current animation
   */
  seekToFrame(frameIndex: number): boolean {
    const animation = this.getCurrentAnimation();
    if (!animation) {
      return false;
    }

    if (frameIndex < 0 || frameIndex >= animation.frames.length) {
      return false;
    }

    this.state.currentFrame = frameIndex;
    this.state.frameTime = 0;

    // Notify frame change
    const frame = this.getCurrentFrame();
    if (frame) {
      this.onFrameChange?.(frame);
    }

    return true;
  }

  /**
   * Get current animation state
   */
  getState(): AnimationState {
    return { ...this.state };
  }

  /**
   * Get current frame data
   */
  getCurrentFrameData(): Frame | null {
    return this.getCurrentFrame();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    this.onFrameChange = undefined;
    this.onAnimationComplete = undefined;
  }
}