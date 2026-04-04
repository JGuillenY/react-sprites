import { useRef, useState, useEffect } from 'react';
import { AnimatedSprite, useAnimations, useAnimationControl, AnimatedSpriteRef } from '../../../src/index';

export default function AnimationControlDemo() {
  const spriteRef = useRef<AnimatedSpriteRef>(null);
  const [animationState, setAnimationState] = useState<any>(null);
  const [frameHistory, setFrameHistory] = useState<number[]>([]);
  const [eventLog, setEventLog] = useState<string[]>([]);

  // Create animations
  const animations = useAnimations({
    idle: {
      frames: [
        { sprite: '/hero_walk1.png', duration: 200 },
        { sprite: '/hero_walk2.png', duration: 200 },
        { sprite: '/hero_walk3.png', duration: 200 },
        { sprite: '/hero_walk4.png', duration: 200 },
      ],
      loop: true,
    },
    special: {
      frames: [
        { sprite: '/hero_attack1.png', duration: 150 },
        { sprite: '/hero_attack2.png', duration: 150 },
        { sprite: '/hero_attack3.png', duration: 150 },
        { sprite: '/hero_attack4.png', duration: 150 },
        { sprite: '/hero_walk1.png', duration: 150 },
      ],
      loop: false,
    },
  });

  // Set up animation control hook
  const animationControl = useAnimationControl();

  // Update animation state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (spriteRef.current) {
        const state = spriteRef.current.getAnimationState();
        setAnimationState(state);
        
        if (state) {
          setFrameHistory(prev => {
            const newHistory = [...prev, state.currentFrame];
            return newHistory.slice(-10); // Keep last 10 frames
          });
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Set control functions when sprite ref is available
  useEffect(() => {
    if (spriteRef.current) {
      animationControl.setControlFunctions({
        playAnimation: (id, forceRestart) => spriteRef.current!.playAnimation(id, forceRestart),
        pauseAnimation: () => spriteRef.current!.pauseAnimation(),
        resumeAnimation: () => spriteRef.current!.resumeAnimation(),
        stopAnimation: () => spriteRef.current!.stopAnimation(),
        setAnimationSpeed: (speed) => spriteRef.current!.setAnimationSpeed(speed),
      });
    }
  }, [animationControl]);

  const logEvent = (message: string) => {
    setEventLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handlePlaySpecial = () => {
    const success = animationControl.playAnimation('special');
    if (success) {
      logEvent('Playing special animation');
    }
  };

  const handleForceRestart = () => {
    const success = animationControl.playAnimation('idle', true);
    if (success) {
      logEvent('Force restarted idle animation');
    }
  };

  const handleSeekToFrame = (frameIndex: number) => {
    // Note: seekToFrame is not exposed in the ref API yet
    // This is a placeholder for future implementation
    logEvent(`Seek to frame ${frameIndex} (not implemented in ref API)`);
  };

  return (
    <div className="demo-card">
      <h3 className="demo-title">Advanced Animation Control</h3>
      <p className="demo-description">
        SpriteManager provides advanced animation control through refs and hooks.
        Monitor animation state, control playback, and handle animation events.
      </p>
      
      <div className="demo-grid">
        <div className="demo-panel">
          <h4>Animation State Monitor</h4>
          <p className="demo-description">
            Real-time monitoring of animation state using <code>getAnimationState()</code>.
          </p>
          
          <div className="sprite-container" style={{ minHeight: '200px' }}>
            <AnimatedSprite
              ref={spriteRef}
              id="monitored-sprite"
              idle="idle"
              animations={animations}
              width={48}
              height={48}
              transform={{ x: 100, y: 100 }}
              autoPlay={true}
              onAnimationComplete={(animationId) => {
                logEvent(`Animation "${animationId}" completed`);
              }}
              onLoad={() => {
                logEvent('Sprite loaded successfully');
              }}
            />
          </div>
          
          {animationState && (
            <div className="stats">
              <div className="stat-card">
                <div className="stat-value">{animationState.currentAnimation}</div>
                <div className="stat-label">Current Animation</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{animationState.currentFrame}</div>
                <div className="stat-label">Current Frame</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{animationState.isPlaying ? '▶️' : '⏸️'}</div>
                <div className="stat-label">Playing</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{animationState.speed.toFixed(1)}x</div>
                <div className="stat-label">Speed</div>
              </div>
            </div>
          )}
          
          <div className="control-group">
            <label className="control-label">Frame History (Last 10)</label>
            <div className="control-buttons">
              {frameHistory.map((frame, index) => (
                <button 
                  key={index}
                  className="secondary small"
                  onClick={() => handleSeekToFrame(frame)}
                  title={`Seek to frame ${frame}`}
                >
                  {frame}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="demo-panel">
          <h4>Control via useAnimationControl Hook</h4>
          <p className="demo-description">
            The <code>useAnimationControl</code> hook provides a clean way to control
            animations from parent components without direct ref manipulation.
          </p>
          
          <div className="controls">
            <div className="control-group">
              <label className="control-label">Animation Control</label>
              <div className="control-buttons">
                <button 
                  className="success"
                  onClick={handlePlaySpecial}
                >
                  Play Special
                </button>
                <button 
                  className="secondary"
                  onClick={handleForceRestart}
                >
                  Force Restart Idle
                </button>
                <button 
                  className="warning"
                  onClick={() => animationControl.pauseAnimation()}
                >
                  Pause
                </button>
                <button 
                  className="success"
                  onClick={() => animationControl.resumeAnimation()}
                >
                  Resume
                </button>
                <button 
                  className="error"
                  onClick={() => animationControl.stopAnimation()}
                >
                  Stop
                </button>
              </div>
            </div>
            
            <div className="control-group">
              <label className="control-label">Speed Control</label>
              <div className="control-buttons">
                <button 
                  className="secondary small"
                  onClick={() => animationControl.setAnimationSpeed(0.5)}
                >
                  0.5x
                </button>
                <button 
                  className="secondary small"
                  onClick={() => animationControl.setAnimationSpeed(1.0)}
                >
                  1.0x
                </button>
                <button 
                  className="secondary small"
                  onClick={() => animationControl.setAnimationSpeed(1.5)}
                >
                  1.5x
                </button>
                <button 
                  className="secondary small"
                  onClick={() => animationControl.setAnimationSpeed(2.0)}
                >
                  2.0x
                </button>
              </div>
            </div>
          </div>
          
          <div className="code-block">
            <pre>
              <code>{`// Using the useAnimationControl hook
import { useAnimationControl } from '../../../src/index';

function ParentComponent() {
  const animationControl = useAnimationControl();
  
  // Set control functions when sprite ref is available
  useEffect(() => {
    if (spriteRef.current) {
      animationControl.setControlFunctions({
        playAnimation: (id, forceRestart) => spriteRef.current!.playAnimation(id, forceRestart),
        pauseAnimation: () => spriteRef.current!.pauseAnimation(),
        resumeAnimation: () => spriteRef.current!.resumeAnimation(),
        stopAnimation: () => spriteRef.current!.stopAnimation(),
        setAnimationSpeed: (speed) => spriteRef.current!.setAnimationSpeed(speed),
      });
    }
  }, [animationControl]);
  
  // Control animations through the hook
  const handlePlaySpecial = () => {
    animationControl.playAnimation('special');
  };
  
  return (
    <>
      <AnimatedSprite ref={spriteRef} /* ... */ />
      <button onClick={handlePlaySpecial}>Play Special</button>
    </>
  );
}`}</code>
            </pre>
          </div>
        </div>
      </div>
      
      <div className="demo-panel">
        <h4>Event Log</h4>
        <p className="demo-description">
          Animation events are logged here. Try different actions to see events.
        </p>
        
        <div className="code-block" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <pre>
            <code>
              {eventLog.length > 0 ? eventLog.join('\n') : 'No events yet. Try controlling the animation!'}
            </code>
          </pre>
        </div>
        
        <div className="controls">
          <button 
            className="secondary"
            onClick={() => setEventLog([])}
          >
            Clear Log
          </button>
          <button 
            className="secondary"
            onClick={() => logEvent('Manual log entry')}
          >
            Add Test Event
          </button>
        </div>
      </div>
      
      <div className="demo-panel">
        <h4>Advanced Features</h4>
        <div className="controls">
          <div className="control-group">
            <div className="status">🎯 Frame-accurate Seeking</div>
            <p className="demo-description">
              Jump to specific frames in animations (requires custom implementation).
            </p>
          </div>
          
          <div className="control-group">
            <div className="status">🔔 Event Callbacks</div>
            <p className="demo-description">
              <code>onAnimationComplete</code>, <code>onLoad</code>, <code>onError</code> callbacks.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status">🔄 State Synchronization</div>
            <p className="demo-description">
              Keep UI in sync with animation state using periodic updates.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status">🎚️ Precise Speed Control</div>
            <p className="demo-description">
              Adjust animation speed from 0.1x to 10x with 0.1 increments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}