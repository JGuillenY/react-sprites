import { useState, useRef, useMemo, useCallback } from "react";
import { ImgAnimatedSprite, useAnimations } from "../../../src/index";
import type { AnimatedSpriteRef } from "../../../src/index";

export default function AnimationControlDemo() {
  const spriteRef = useRef<AnimatedSpriteRef>(null);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  const [forceRestart, setForceRestart] = useState(false);
  const [lastEvent, setLastEvent] = useState<string>("");

  // Create animations with different properties
  const animationsConfig = useMemo(() => ({
    idle: {
      frames: [
        { sprite: "/hero_idle.png", duration: 500 },
      ],
      loop: true,
      speed: 1.0,
    },
    walk: {
      frames: [
        { sprite: "/hero_walk1.png", duration: 200 },
        { sprite: "/hero_walk2.png", duration: 200 },
        { sprite: "/hero_walk3.png", duration: 200 },
        { sprite: "/hero_walk4.png", duration: 200 },
      ],
      loop: true,
      speed: 1.0,
    },
    attack: {
      frames: [
        { sprite: "/hero_attack1.png", duration: 100 },
        { sprite: "/hero_attack2.png", duration: 100 },
        { sprite: "/hero_attack3.png", duration: 150 },
        { sprite: "/hero_attack4.png", duration: 200 },
      ],
      loop: false,
      speed: 1.5,
    },
    spin: {
      frames: [
        { sprite: "/hero_walk1.png", duration: 50 },
        { sprite: "/hero_walk2.png", duration: 50 },
        { sprite: "/hero_walk3.png", duration: 50 },
        { sprite: "/hero_walk4.png", duration: 50 },
      ],
      loop: true,
      speed: 2.0,
    },
  }), []);

  const animations = useAnimations(animationsConfig);

  const handlePlayAnimation = useCallback((animationId: string) => {
    if (spriteRef.current) {
      const success = spriteRef.current.playAnimation(animationId, forceRestart);
      if (success) {
        setCurrentAnimation(animationId);
        setIsPlaying(true);
        setLastEvent(`Started animation: ${animationId}${forceRestart ? " (force restart)" : ""}`);
      }
    }
  }, [forceRestart]);

  const handlePause = useCallback(() => {
    spriteRef.current?.pauseAnimation();
    setIsPlaying(false);
    setLastEvent("Animation paused");
  }, []);

  const handleResume = useCallback(() => {
    spriteRef.current?.resumeAnimation();
    setIsPlaying(true);
    setLastEvent("Animation resumed");
  }, []);

  const handleStop = useCallback(() => {
    spriteRef.current?.stopAnimation();
    setIsPlaying(false);
    setCurrentAnimation("idle");
    setLastEvent("Animation stopped");
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    spriteRef.current?.setAnimationSpeed(newSpeed);
    setLastEvent(`Speed changed to ${newSpeed.toFixed(1)}x`);
  }, []);

  const handleSeekToFrame = useCallback((frameIndex: number) => {
    if (spriteRef.current) {
      // Note: seekToFrame is not exposed in the current API
      // This is a placeholder for future implementation
      setLastEvent(`Seek to frame ${frameIndex} (not implemented in current API)`);
    }
  }, []);

  const getAnimationState = useCallback(() => {
    const state = spriteRef.current?.getAnimationState();
    if (state) {
      setLastEvent(`State: ${state.currentAnimation}, Frame: ${state.currentFrame}, Playing: ${state.isPlaying}, Speed: ${state.speed}x`);
    }
    return state;
  }, []);

  return (
    <div className="demo-page">
      <h1 className="demo-title">Animation Control Demo</h1>
      <p className="demo-description">
        Advanced animation control with transitions, speed adjustment, event callbacks, and playback control.
        Test different animation properties and observe how they interact.
      </p>

      <div className="sprite-container">
        <ImgAnimatedSprite
          ref={spriteRef}
          id="control-demo-character"
          idle="idle"
          animations={animations}
          width={96}
          height={96}
          autoPlay={true}
          onAnimationComplete={(animationId) => {
            setLastEvent(`Animation completed: ${animationId}`);
            if (animationId !== "idle") {
              // Auto-return to idle after non-looping animations
              setTimeout(() => {
                handlePlayAnimation("idle");
              }, 300);
            }
          }}
          onLoad={() => setLastEvent("Sprite loaded successfully")}
        />
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{currentAnimation}</div>
          <div className="stat-label">Current Animation</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {isPlaying ? "▶️ Playing" : "⏸️ Paused"}
          </div>
          <div className="stat-label">Status</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{speed.toFixed(1)}x</div>
          <div className="stat-label">Speed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">4</div>
          <div className="stat-label">Animations</div>
        </div>
      </div>

      <div className="event-log">
        <h3>Event Log</h3>
        <div className="log-content">
          {lastEvent || "No events yet"}
        </div>
        <button 
          className="secondary" 
          onClick={() => setLastEvent("")}
          style={{ marginTop: "0.5rem" }}
        >
          Clear Log
        </button>
      </div>

      <div className="controls">
        <div className="control-group">
          <label className="control-label">Animation Selection</label>
          <div className="control-buttons">
            <button
              className={currentAnimation === "idle" ? "success" : "secondary"}
              onClick={() => handlePlayAnimation("idle")}
            >
              🛌 Idle (Slow, 2 frames)
            </button>
            <button
              className={currentAnimation === "walk" ? "success" : "secondary"}
              onClick={() => handlePlayAnimation("walk")}
            >
              🚶 Walk (Normal, 4 frames)
            </button>
            <button
              className={currentAnimation === "attack" ? "success" : "secondary"}
              onClick={() => handlePlayAnimation("attack")}
            >
              ⚔️ Attack (Fast, one-shot)
            </button>
            <button
              className={currentAnimation === "spin" ? "success" : "secondary"}
              onClick={() => handlePlayAnimation("spin")}
            >
              🌀 Spin (Very fast, loop)
            </button>
          </div>
          <div className="control-option">
            <label>
              <input
                type="checkbox"
                checked={forceRestart}
                onChange={(e) => setForceRestart(e.target.checked)}
              />
              Force restart when switching animations
            </label>
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
            <button className="warning" onClick={handleStop}>
              ⏹️ Stop
            </button>
            <button className="secondary" onClick={() => getAnimationState()}>
              📊 Get State
            </button>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Speed Control</label>
          <div className="control-buttons">
            <button
              className={speed === 0.25 ? "success" : "secondary"}
              onClick={() => handleSpeedChange(0.25)}
            >
              0.25x Very Slow
            </button>
            <button
              className={speed === 0.5 ? "success" : "secondary"}
              onClick={() => handleSpeedChange(0.5)}
            >
              0.5x Slow
            </button>
            <button
              className={speed === 1.0 ? "success" : "secondary"}
              onClick={() => handleSpeedChange(1.0)}
            >
              1.0x Normal
            </button>
            <button
              className={speed === 2.0 ? "success" : "secondary"}
              onClick={() => handleSpeedChange(2.0)}
            >
              2.0x Fast
            </button>
            <button
              className={speed === 4.0 ? "success" : "secondary"}
              onClick={() => handleSpeedChange(4.0)}
            >
              4.0x Very Fast
            </button>
          </div>
          <div className="speed-slider">
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
            <div className="slider-labels">
              <span>0.1x</span>
              <span>2.5x</span>
              <span>5.0x</span>
            </div>
          </div>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Frame Control (Placeholder)</label>
        <div className="control-buttons">
          <button className="secondary" onClick={() => handleSeekToFrame(0)}>
            Seek to Frame 0
          </button>
          <button className="secondary" onClick={() => handleSeekToFrame(1)}>
            Seek to Frame 1
          </button>
          <button className="secondary" onClick={() => handleSeekToFrame(2)}>
            Seek to Frame 2
          </button>
          <button className="secondary" onClick={() => handleSeekToFrame(3)}>
            Seek to Frame 3
          </button>
        </div>
        <p className="demo-description" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Note: Frame seeking is not implemented in the current API. This shows how it could be extended.
        </p>
      </div>

      <div className="code-block">
        <h3>Advanced Animation Control</h3>
        <pre>
          <code>{`// Complete animation control example
import { useRef, useCallback } from "react";
import { ImgAnimatedSprite, useAnimations } from "@infinite-dungeon/sprite-manager";

function AnimationController() {
  const spriteRef = useRef<AnimatedSpriteRef>(null);
  
  const handlePlayAnimation = useCallback((animationId: string, forceRestart = false) => {
    spriteRef.current?.playAnimation(animationId, forceRestart);
  }, []);
  
  const handlePause = useCallback(() => {
    spriteRef.current?.pauseAnimation();
  }, []);
  
  const handleResume = useCallback(() => {
    spriteRef.current?.resumeAnimation();
  }, []);
  
  const handleStop = useCallback(() => {
    spriteRef.current?.stopAnimation();
  }, []);
  
  const handleSpeedChange = useCallback((speed: number) => {
    spriteRef.current?.setAnimationSpeed(speed);
  }, []);
  
  const getState = useCallback(() => {
    return spriteRef.current?.getAnimationState();
  }, []);
  
  return (
    <ImgAnimatedSprite
      ref={spriteRef}
      idle="idle"
      animations={animations}
      onAnimationComplete={(animationId) => {
        console.log(\`Animation \${animationId} completed\`);
      }}
    />
  );
}`}</code>
        </pre>
      </div>

      <div className="demo-card">
        <h3>Animation Properties Tested</h3>
        <div className="controls">
          <div className="control-group">
            <div className="status success">✅ Loop vs One-shot</div>
            <p className="demo-description">
              Idle/Walk/Spin loop continuously. Attack plays once then stops.
            </p>
          </div>
          <div className="control-group">
            <div className="status success">✅ Speed Control</div>
            <p className="demo-description">
              Adjust playback speed from 0.1x to 5.0x for slow-motion or fast-forward effects.
            </p>
          </div>
          <div className="control-group">
            <div className="status success">✅ Force Restart</div>
            <p className="demo-description">
              Option to restart animation from beginning even if it's already playing.
            </p>
          </div>
          <div className="control-group">
            <div className="status success">✅ Event Callbacks</div>
            <p className="demo-description">
              onAnimationComplete triggers when non-looping animations finish.
            </p>
          </div>
        </div>
      </div>

      <div className="demo-card">
        <h3>Animation State Management</h3>
        <p className="demo-description">
          The animation system maintains internal state that can be queried and controlled:
        </p>
        <div className="state-diagram">
          <div className="state-item">
            <div className="state-circle">▶️</div>
            <div className="state-label">Playing</div>
          </div>
          <div className="state-arrow">→</div>
          <div className="state-item">
            <div className="state-circle">⏸️</div>
            <div className="state-label">Paused</div>
          </div>
          <div className="state-arrow">→</div>
          <div className="state-item">
            <div className="state-circle">⏹️</div>
            <div className="state-label">Stopped</div>
          </div>
          <div className="state-arrow">→</div>
          <div className="state-item">
            <div className="state-circle">🔄</div>
            <div className="state-label">Completed</div>
          </div>
        </div>
        <p className="demo-description" style={{ marginTop: "1rem" }}>
          Transitions between states are managed by the AnimationController class,
          ensuring smooth animation playback and proper resource cleanup.
        </p>
      </div>
    </div>
  );
}