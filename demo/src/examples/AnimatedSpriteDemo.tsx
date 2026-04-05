import { useRef, useState, useMemo } from 'react';
import { AnimatedSprite, useAnimations, AnimatedSpriteRef } from '../../../src/index';

export default function AnimatedSpriteDemo() {
  const spriteRef = useRef<AnimatedSpriteRef>(null);
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.0);

  // Create animations using the useAnimations hook (memoize input)
  const animationsConfig = useMemo(() => ({
    idle: {
      frames: [
        { sprite: '/hero_walk1.png', duration: 300 },
        { sprite: '/hero_walk2.png', duration: 300 },
        { sprite: '/hero_walk3.png', duration: 300 },
        { sprite: '/hero_walk4.png', duration: 300 },
      ],
      loop: true,
      speed: 1.0,
    },
    walk: {
      frames: [
        { sprite: '/hero_walk1.png', duration: 150 },
        { sprite: '/hero_walk2.png', duration: 150 },
        { sprite: '/hero_walk3.png', duration: 150 },
        { sprite: '/hero_walk4.png', duration: 150 },
      ],
      loop: true,
      speed: 1.0,
    },
    attack: {
      frames: [
        { sprite: '/hero_attack1.png', duration: 100 },
        { sprite: '/hero_attack2.png', duration: 100 },
        { sprite: '/hero_attack3.png', duration: 100 },
        { sprite: '/hero_attack4.png', duration: 200 },
      ],
      loop: false,
      speed: 1.5,
    },
  }), []); // Empty dependencies - config never changes
  
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

  const handleStop = () => {
    spriteRef.current?.stopAnimation();
    setIsPlaying(false);
    setCurrentAnimation('idle');
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    spriteRef.current?.setAnimationSpeed(newSpeed);
  };

  return (
    <div className="demo-card">
      <h3 className="demo-title">Animated Sprite Examples</h3>
      <p className="demo-description">
        The <code>AnimatedSprite</code> component supports multiple animations with frame sequencing,
        loop control, speed adjustment, and playback control via ref.
      </p>
      
      <div className="demo-panel">
        <h4>Interactive Animation Demo</h4>
        <p className="demo-description">
          Control the sprite animation using the buttons below. Try different animations and adjust playback speed.
        </p>
        
        <div className="sprite-container" style={{ minHeight: '300px' }}>
          <AnimatedSprite
            ref={spriteRef}
            id="demo-character"
            idle="idle"
            animations={animations}
            width={64}
            height={64}
            transform={{ x: 200, y: 150 }}
            autoPlay={true}
            onAnimationComplete={(animationId) => {
              console.log(`Animation "${animationId}" completed`);
              if (animationId !== 'idle') {
                // Auto-return to idle after non-looping animations
                setTimeout(() => {
                  handlePlayAnimation('idle');
                }, 500);
              }
            }}
          />
        </div>
        
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{currentAnimation}</div>
            <div className="stat-label">Current Animation</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{isPlaying ? '▶️ Playing' : '⏸️ Paused'}</div>
            <div className="stat-label">Status</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{speed.toFixed(1)}x</div>
            <div className="stat-label">Speed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">3</div>
            <div className="stat-label">Animations</div>
          </div>
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label className="control-label">Animations</label>
            <div className="control-buttons">
              <button 
                className={currentAnimation === 'idle' ? 'success' : 'secondary'}
                onClick={() => handlePlayAnimation('idle')}
              >
                🛌 Idle
              </button>
              <button 
                className={currentAnimation === 'walk' ? 'success' : 'secondary'}
                onClick={() => handlePlayAnimation('walk')}
              >
                🚶 Walk
              </button>

              <button 
                className={currentAnimation === 'attack' ? 'success' : 'secondary'}
                onClick={() => handlePlayAnimation('attack')}
              >
                ⚔️ Attack
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Playback Control</label>
            <div className="control-buttons">
              <button 
                className={isPlaying ? 'secondary' : 'success'}
                onClick={handlePause}
                disabled={!isPlaying}
              >
                ⏸️ Pause
              </button>
              <button 
                className={isPlaying ? 'success' : 'secondary'}
                onClick={handleResume}
                disabled={isPlaying}
              >
                ▶️ Resume
              </button>
              <button 
                className="warning"
                onClick={handleStop}
              >
                ⏹️ Stop
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Speed Control</label>
            <div className="control-buttons">
              <button 
                className={speed === 0.5 ? 'success' : 'secondary'}
                onClick={() => handleSpeedChange(0.5)}
              >
                0.5x Slow
              </button>
              <button 
                className={speed === 1.0 ? 'success' : 'secondary'}
                onClick={() => handleSpeedChange(1.0)}
              >
                1.0x Normal
              </button>
              <button 
                className={speed === 1.5 ? 'success' : 'secondary'}
                onClick={() => handleSpeedChange(1.5)}
              >
                1.5x Fast
              </button>
              <button 
                className={speed === 2.0 ? 'success' : 'secondary'}
                onClick={() => handleSpeedChange(2.0)}
              >
                2.0x Turbo
              </button>
            </div>
          </div>
        </div>
        
        <div className="code-block">
          <pre>
            <code>{`// Creating animations with useAnimations hook
// Memoize the config to prevent recreating animations on every render
const animationsConfig = useMemo(() => ({
  idle: {
    frames: [
      { sprite: '/hero_walk1.png', duration: 300 },
      { sprite: '/hero_walk2.png', duration: 300 },
      { sprite: '/hero_walk3.png', duration: 300 },
      { sprite: '/hero_walk4.png', duration: 300 },
    ],
    loop: true,
    speed: 1.0,
  },
  // ... more animations
}), []); // Empty dependencies - config never changes

const animations = useAnimations(animationsConfig);

// Using the AnimatedSprite component
<AnimatedSprite
  ref={spriteRef}
  id="demo-character"
  idle="idle"
  animations={animations}
  width={64}
  height={64}
  transform={{ x: 200, y: 150 }}
  autoPlay={true}
  onAnimationComplete={(animationId) => {
    console.log(\`Animation "\${animationId}" completed\`);
  }}
/>

// Controlling animations via ref
const handlePlayAnimation = (animationId: string) => {
  spriteRef.current?.playAnimation(animationId);
};

const handlePause = () => {
  spriteRef.current?.pauseAnimation();
};

const handleSpeedChange = (speed: number) => {
  spriteRef.current?.setAnimationSpeed(speed);
};`}</code>
          </pre>
        </div>
      </div>
      
      <div className="demo-panel">
        <h4>Animation Types</h4>
        <p className="demo-description">
          SpriteManager supports different types of animations:
        </p>
        
        <div className="controls">
          <div className="control-group">
            <div className="status success">✅ Looping Animations</div>
            <p className="demo-description">
              Continuously play from start to end and repeat. Perfect for idle, walk, run animations.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status warning">⚠️ One-shot Animations</div>
            <p className="demo-description">
              Play once and stop. Can auto-return to idle. Ideal for attacks, jumps, death animations.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status">🎚️ Speed Control</div>
            <p className="demo-description">
              Adjust playback speed (0.1x to 10x). Useful for slow-motion or fast-forward effects.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status">🔄 Transitions</div>
            <p className="demo-description">
              Smooth transitions between animations with optional force restart.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}