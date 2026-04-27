import { useState, useMemo, useRef } from "react";
import { ImgAnimatedSprite, useAnimations } from "../../../src/index";
import { calculateSpriteSheetFrames } from "../../../src/spriteSheet";
import type { AnimatedSpriteRef } from "../../../src/index";

export default function SpriteSheetDemo() {
  const spriteRef = useRef<AnimatedSpriteRef>(null);
  const [currentAnimation, setCurrentAnimation] = useState("walk");
  const [isPlaying, setIsPlaying] = useState(true);

  // Calculate frames from sprite sheet
  const spriteSheetFrames = useMemo(() => {
    return calculateSpriteSheetFrames({
      src: "/hero_down-Sheet.png", // Use the actual sprite sheet we have
      frameWidth: 64,
      frameHeight: 64,
      cols: 4,
      rows: 4,
      totalFrames: 16, // 4x4 grid
    });
  }, []);

  // Create animations using the sprite sheet frames
  const animationsConfig = useMemo(() => ({
    idle: {
      frames: spriteSheetFrames.slice(0, 4).map((frame) => ({
        sprite: "/hero_down-Sheet.png", // Use the sprite sheet URL
        duration: 300,
        frameData: frame, // Pass frame data for sprite sheet coordinates
      })),
      loop: true,
      speed: 1.0,
    },
    walk: {
      frames: spriteSheetFrames.slice(4, 8).map((frame) => ({
        sprite: "/hero_down-Sheet.png", // Use the sprite sheet URL
        duration: 150,
        frameData: frame, // Pass frame data for sprite sheet coordinates
      })),
      loop: true,
      speed: 1.0,
    },
    attack: {
      frames: spriteSheetFrames.slice(8, 12).map((frame) => ({
        sprite: "/hero_down-Sheet.png", // Use the sprite sheet URL
        duration: 100,
        frameData: frame, // Pass frame data for sprite sheet coordinates
      })),
      loop: false,
      speed: 1.5,
    },
    jump: {
      frames: spriteSheetFrames.slice(12, 16).map((frame) => ({
        sprite: "/hero_down-Sheet.png", // Use the sprite sheet URL
        duration: 200,
        frameData: frame, // Pass frame data for sprite sheet coordinates
      })),
      loop: false,
      speed: 1.0,
    },
  }), [spriteSheetFrames]);

  const animations = useAnimations(animationsConfig);

  const handlePlayAnimation = (animationId: string) => {
    if (spriteRef.current) {
      const success = spriteRef.current.playAnimation(animationId);
      if (success) {
        setCurrentAnimation(animationId);
        setIsPlaying(true);
      }
    }
  };

  const handlePause = () => {
    spriteRef.current?.pauseAnimation();
    setIsPlaying(false);
  };

  const handleResume = () => {
    spriteRef.current?.resumeAnimation();
    setIsPlaying(true);
  };

  return (
    <div className="demo-page">
      <h1 className="demo-title">Sprite Sheet Demo</h1>
      <p className="demo-description">
        Extract and animate frames from grid-based sprite sheets. Sprite sheets combine multiple
        animation frames into a single image file for efficient loading and memory usage.
      </p>

      <div className="sprite-container">
        <div className="sprite-sheet-info">
          <div className="sprite-sheet-grid">
            {/* Display the sprite sheet grid */}
            <div className="grid-overlay">
              <div className="grid-lines">
                {/* Vertical lines */}
                <div className="grid-line vertical" style={{ left: "25%" }}></div>
                <div className="grid-line vertical" style={{ left: "50%" }}></div>
                <div className="grid-line vertical" style={{ left: "75%" }}></div>
                {/* Horizontal lines */}
                <div className="grid-line horizontal" style={{ top: "25%" }}></div>
                <div className="grid-line horizontal" style={{ top: "50%" }}></div>
                <div className="grid-line horizontal" style={{ top: "75%" }}></div>
              </div>
              <img 
                src="/hero_down-Sheet.png" 
                alt="Sprite Sheet" 
                className="sprite-sheet-preview"
                style={{ opacity: 0.3 }}
              />
            </div>
            
            {/* Animated sprite using the sprite sheet */}
            <div className="animated-sprite-container">
              <ImgAnimatedSprite
                ref={spriteRef}
                id="sprite-sheet-character"
                idle="walk"
                animations={animations}
                width={128}
                height={128}
                autoPlay={true}
                onAnimationComplete={(animationId) => {
                  if (animationId !== "idle" && animationId !== "walk") {
                    // Auto-return to walk after non-looping animations
                    setTimeout(() => {
                      handlePlayAnimation("walk");
                    }, 500);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">4×4</div>
          <div className="stat-label">Grid Size</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">16</div>
          <div className="stat-label">Total Frames</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">4</div>
          <div className="stat-label">Animations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">64×64</div>
          <div className="stat-label">Frame Size</div>
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label className="control-label">Animations (4 frames each)</label>
          <div className="control-buttons">
            <button
              className={currentAnimation === "idle" ? "success" : "secondary"}
              onClick={() => handlePlayAnimation("idle")}
            >
              🛌 Idle (Frames 0-3)
            </button>
            <button
              className={currentAnimation === "walk" ? "success" : "secondary"}
              onClick={() => handlePlayAnimation("walk")}
            >
              🚶 Walk (Frames 4-7)
            </button>
            <button
              className={currentAnimation === "attack" ? "success" : "secondary"}
              onClick={() => handlePlayAnimation("attack")}
            >
              ⚔️ Attack (Frames 8-11)
            </button>
            <button
              className={currentAnimation === "jump" ? "success" : "secondary"}
              onClick={() => handlePlayAnimation("jump")}
            >
              🦘 Jump (Frames 12-15)
            </button>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Playback Control</label>
          <div className="control-buttons">
            <button
              className={isPlaying ? "secondary" : "success"}
              onClick={handlePause}
              disabled={!isPlaying}
            >
              ⏸️ Pause
            </button>
            <button
              className={isPlaying ? "success" : "secondary"}
              onClick={handleResume}
              disabled={isPlaying}
            >
              ▶️ Resume
            </button>
          </div>
          <div className="transform-values">
            <div>Status: {isPlaying ? "Playing" : "Paused"}</div>
            <div>Current: {currentAnimation}</div>
          </div>
        </div>
      </div>

      <div className="code-block">
        <h3>Sprite Sheet Usage</h3>
        <pre>
          <code>{`import { calculateSpriteSheetFrames } from "@infinite-dungeon/sprite-manager";

// Calculate frames from a sprite sheet
const frames = calculateSpriteSheetFrames({
  src: "/sprites/character-sheet.png",
  frameWidth: 64,
  frameHeight: 64,
  cols: 4,      // 4 columns in the grid
  rows: 4,      // 4 rows in the grid
  totalFrames: 16, // Total frames to extract
});

// Use frames in animations
const animationsConfig = {
  walk: {
    frames: frames.slice(0, 4).map((frame) => ({
      sprite: frame.sprite,
      duration: 150,
      frameData: frame, // Include sprite sheet coordinates
    })),
    loop: true,
  },
  // ... more animations
};

// The ImgAnimatedSprite component will automatically
// use the frameData to display the correct portion
// of the sprite sheet for each frame.`}</code>
        </pre>
      </div>

      <div className="demo-card">
        <h3>Benefits of Sprite Sheets</h3>
        <div className="controls">
          <div className="control-group">
            <div className="status success">✅ Reduced HTTP Requests</div>
            <p className="demo-description">
              One image file instead of multiple files, reducing network overhead.
            </p>
          </div>
          <div className="control-group">
            <div className="status success">✅ Better Compression</div>
            <p className="demo-description">
              Single image compresses better than multiple small images.
            </p>
          </div>
          <div className="control-group">
            <div className="status success">✅ Memory Efficiency</div>
            <p className="demo-description">
              Browser loads one texture, reducing GPU memory usage.
            </p>
          </div>
          <div className="control-group">
            <div className="status success">✅ Batch Loading</div>
            <p className="demo-description">
              All frames load simultaneously, no staggered loading.
            </p>
          </div>
        </div>
      </div>

      <div className="demo-card">
        <h3>Sprite Sheet Grid</h3>
        <p className="demo-description">
          The sprite sheet is divided into a 4×4 grid (16 frames total):
        </p>
        <div className="sprite-sheet-layout">
          <table className="grid-table">
            <tbody>
              <tr>
                <td>Frame 0</td>
                <td>Frame 1</td>
                <td>Frame 2</td>
                <td>Frame 3</td>
              </tr>
              <tr>
                <td>Frame 4</td>
                <td>Frame 5</td>
                <td>Frame 6</td>
                <td>Frame 7</td>
              </tr>
              <tr>
                <td>Frame 8</td>
                <td>Frame 9</td>
                <td>Frame 10</td>
                <td>Frame 11</td>
              </tr>
              <tr>
                <td>Frame 12</td>
                <td>Frame 13</td>
                <td>Frame 14</td>
                <td>Frame 15</td>
              </tr>
            </tbody>
          </table>
          <div className="animation-mapping">
            <div className="mapping-item">
              <strong>Idle:</strong> Frames 0-3 (Row 1)
            </div>
            <div className="mapping-item">
              <strong>Walk:</strong> Frames 4-7 (Row 2)
            </div>
            <div className="mapping-item">
              <strong>Attack:</strong> Frames 8-11 (Row 3)
            </div>
            <div className="mapping-item">
              <strong>Jump:</strong> Frames 12-15 (Row 4)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}