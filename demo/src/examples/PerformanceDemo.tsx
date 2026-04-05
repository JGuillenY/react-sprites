import { useState, useEffect, useRef, useMemo } from 'react';
import { ImgSprite, ImgAnimatedSprite, useAnimations, useSpriteManager } from '../../../src/index';

export default function PerformanceDemo() {
  const [spriteCount, setSpriteCount] = useState(20); // Start with 20 sprites
  const [fps, setFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [renderTime, setRenderTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const { getStats } = useSpriteManager();

  // Create a simple animation for multiple sprites
  // Memoize animations config
  const animationsConfig = useMemo(() => ({
    walk: {
      frames: [
        { sprite: '/hero_walk1.png', duration: 150 },
        { sprite: '/hero_walk2.png', duration: 150 },
        { sprite: '/hero_walk3.png', duration: 150 },
        { sprite: '/hero_walk4.png', duration: 150 },
      ],
      loop: true,
    },
  }), []);
  
  const animations = useAnimations(animationsConfig);

  // Calculate FPS
  useEffect(() => {
    if (!isRunning) return;
    
    const calculateFps = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTimeRef.current;
      
      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
        
        // Update memory usage from sprite manager stats
        const stats = getStats();
        setMemoryUsage(stats.total * 5); // Rough estimate: 5KB per sprite
      }
      
      if (isRunning) {
        requestAnimationFrame(calculateFps);
      }
    };
    
    const fpsId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(fpsId);
  }, [getStats, isRunning]);

  // Measure render time
  useEffect(() => {
    const startTime = performance.now();
    
    // Force a re-render to measure
    const timeoutId = setTimeout(() => {
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [spriteCount]);

  const generateSprites = () => {
    const sprites = [];
    const columns = Math.ceil(Math.sqrt(spriteCount));
    const containerWidth = 800;
    const containerHeight = 400;
    const spacing = 60;
    
    // Calculate grid dimensions
    const gridWidth = columns * spacing;
    const gridHeight = Math.ceil(spriteCount / columns) * spacing;
    const offsetX = (containerWidth - gridWidth) / 2;
    const offsetY = (containerHeight - gridHeight) / 2;
    
    for (let i = 0; i < spriteCount; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const x = offsetX + col * spacing;
      const y = offsetY + row * spacing;
      
      if (i % 3 === 0) {
        // Static sprite
        sprites.push(
          <ImgSprite
            key={`static-${i}`}
            id={`sprite-${i}`}
            src={`/hero_walk${(i % 4) + 1}.png`}
            width={32}
            height={32}
            transform={{ x, y }}
          />
        );
      } else {
        // Animated sprite
        sprites.push(
          <ImgAnimatedSprite
            key={`animated-${i}`}
            id={`animated-${i}`}
            idle="walk"
            animations={animations}
            width={32}
            height={32}
            transform={{ x, y }}
            autoPlay={true}
            paused={!isRunning}
          />
        );
      }
    }
    
    return sprites;
  };

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setSpriteCount(20);
    setIsRunning(true);
  };

  return (
    <div className="demo-page">
      <h1 className="demo-title">Performance Demo</h1>
      <p className="demo-description">
        Stress test with {spriteCount} sprites (20-50 recommended). Monitor FPS, memory usage, and render performance.
        Each sprite is individually positioned and managed by SpriteManager.
      </p>
      
      <div className="warning-banner">
        <div className="warning-icon">⚠️</div>
        <div className="warning-content">
          <strong>Performance Warning:</strong> This demo creates multiple sprites which may impact performance on lower-end devices.
          Start with 20 sprites and increase gradually.
        </div>
      </div>
      
      <div className="demo-panel">
        <h3>Performance Metrics</h3>
        <p className="demo-description">
          Real-time performance metrics while rendering {spriteCount} sprites.
        </p>
        
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value" style={{ color: fps > 50 ? 'var(--success-color)' : fps > 30 ? 'var(--warning-color)' : 'var(--error-color)' }}>
              {fps} FPS
            </div>
            <div className="stat-label">Frame Rate</div>
            <div className="stat-hint">
              {fps > 50 ? 'Excellent' : fps > 30 ? 'Good' : 'Poor'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{spriteCount}</div>
            <div className="stat-label">Total Sprites</div>
            <div className="stat-hint">
              {Math.ceil(spriteCount / 3)} static, {Math.floor(spriteCount * 2 / 3)} animated
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{memoryUsage} KB</div>
            <div className="stat-label">Memory Usage</div>
            <div className="stat-hint">
              Estimated
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{renderTime.toFixed(1)}ms</div>
            <div className="stat-label">Render Time</div>
            <div className="stat-hint">
              Last render
            </div>
          </div>
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label className="control-label">Sprite Count: {spriteCount}</label>
            <div className="control-buttons">
              <button 
                className="secondary"
                onClick={() => setSpriteCount(10)}
              >
                10 Sprites (Light)
              </button>
              <button 
                className="secondary"
                onClick={() => setSpriteCount(20)}
              >
                20 Sprites (Recommended)
              </button>
              <button 
                className="secondary"
                onClick={() => setSpriteCount(35)}
              >
                35 Sprites (Medium)
              </button>
              <button 
                className="secondary"
                onClick={() => setSpriteCount(50)}
              >
                50 Sprites (Heavy)
              </button>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={spriteCount}
                onChange={(e) => setSpriteCount(parseInt(e.target.value))}
                className="sprite-slider"
              />
              <div className="slider-labels">
                <span>5</span>
                <span>20</span>
                <span>35</span>
                <span>50</span>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Performance Actions</label>
            <div className="control-buttons">
              <button 
                className={isRunning ? "warning" : "success"}
                onClick={handleToggleRunning}
              >
                {isRunning ? '⏸️ Pause Animations' : '▶️ Resume Animations'}
              </button>
              <button 
                className="secondary"
                onClick={() => {
                  // Force garbage collection (browser dependent)
                  if (window.gc) {
                    window.gc();
                  }
                  console.log('GC requested');
                }}
              >
                🗑️ Request GC
              </button>
              <button 
                className="secondary"
                onClick={handleReset}
              >
                🔄 Reset
              </button>
            </div>
            <p className="demo-description" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Pausing animations stops all animation loops, reducing CPU usage.
            </p>
          </div>
        </div>
      </div>
      
      <div className="demo-panel">
        <h3>Sprite Stress Test</h3>
        <p className="demo-description">
          Rendering {spriteCount} sprites in a grid layout. Each sprite is individually positioned and managed.
          {!isRunning && <span style={{ color: 'var(--warning-color)' }}> Animations are currently paused.</span>}
        </p>
        
        <div className="sprite-container" style={{ 
          minHeight: '400px',
          maxHeight: '500px',
          overflow: 'auto',
          position: 'relative',
        }}>
          {generateSprites()}
          
          {/* Grid background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
            zIndex: -1,
          }} />
          
          {/* Sprite count overlay */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}>
            {spriteCount} Sprites
          </div>
        </div>
        
        <div className="performance-tips">
          <h4>Performance Tips</h4>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🎯</div>
              <div className="tip-content">
                <h5>Limit Active Animations</h5>
                <p>Pause animations that are off-screen or not visible to save CPU cycles.</p>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📦</div>
              <div className="tip-content">
                <h5>Use Sprite Sheets</h5>
                <p>Combine multiple frames into single images to reduce HTTP requests.</p>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon">⚡</div>
              <div className="tip-content">
                <h5>Optimize Frame Rates</h5>
                <p>Use appropriate frame durations (60fps = 16.7ms per frame).</p>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🧹</div>
              <div className="tip-content">
                <h5>Clean Up Resources</h5>
                <p>Remove unused sprites from cache to free memory.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="code-block">
          <h4>Performance Optimization Code</h4>
          <pre>
            <code>{`// Performance optimization features in SpriteManager:

1. 🎯 AUTOMATIC CACHING
   // Sprites are loaded once and cached
   // Duplicate requests return cached resources
   // Memory is managed automatically

2. ⚡ EFFICIENT RENDERING
   // Image-based rendering (simpler than canvas)
   // Minimal React re-renders
   // Only update when necessary

3. 📦 RESOURCE MANAGEMENT
   // Automatic preloading
   // Error handling and retry
   // Memory cleanup on unmount

4. 🔄 OPTIMIZED UPDATES
   // Efficient animation loops
   // RequestAnimationFrame based
   // Automatic pause/resume

// Example: Rendering multiple sprites efficiently
const sprites = Array.from({ length: ${spriteCount} }).map((_, i) => (
  i % 3 === 0 ? (
    <ImgSprite
      key={\`static-\${i}\`}
      src={\`/sprites/sprite-\${i}.png\`}
      transform={{ x: i * 60, y: 100 }}
    />
  ) : (
    <ImgAnimatedSprite
      key={\`animated-\${i}\`}
      idle="idle"
      animations={animations}
      transform={{ x: i * 60, y: 100 }}
    />
  )
));

// Performance monitoring
useEffect(() => {
  let frameCount = 0;
  let lastTime = performance.now();
  
  const checkFps = () => {
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= 1000) {
      setFps(Math.round((frameCount * 1000) / elapsed));
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(checkFps);
  };
  
  const fpsId = requestAnimationFrame(checkFps);
  return () => cancelAnimationFrame(fpsId);
}, []);`}</code>
          </pre>
        </div>
      </div>
      
      <div className="demo-panel">
        <h3>Performance Guidelines</h3>
        <div className="guidelines">
          <div className="guideline">
            <div className="guideline-header">
              <span className="guideline-level success">Green</span>
              <span className="guideline-fps">50+ FPS</span>
            </div>
            <p className="guideline-description">
              Excellent performance. Can handle 50+ sprites on most devices.
              Suitable for complex games with many animated elements.
            </p>
          </div>
          
          <div className="guideline">
            <div className="guideline-header">
              <span className="guideline-level warning">Yellow</span>
              <span className="guideline-fps">30-50 FPS</span>
            </div>
            <p className="guideline-description">
              Good performance. Suitable for most games. Consider optimizing if FPS drops below 40.
              Reduce sprite count or pause off-screen animations.
            </p>
          </div>
          
          <div className="guideline">
            <div className="guideline-header">
              <span className="guideline-level error">Red</span>
              <span className="guideline-fps">Below 30 FPS</span>
            </div>
            <p className="guideline-description">
              Performance issues. Reduce sprite count, use sprite sheets,
              pause animations, or optimize frame rates.
            </p>
          </div>
        </div>
        
        <div className="recommendations">
          <h4>Recommendations by Device Type</h4>
          <div className="recommendation-grid">
            <div className="recommendation">
              <h5>Mobile Devices</h5>
              <ul>
                <li>Limit to 20-30 sprites</li>
                <li>Use sprite sheets</li>
                <li>Pause off-screen animations</li>
                <li>Test on actual devices</li>
              </ul>
            </div>
            <div className="recommendation">
              <h5>Tablets</h5>
              <ul>
                <li>30-40 sprites typically safe</li>
                <li>Monitor memory usage</li>
                <li>Consider device age/battery</li>
                <li>Provide quality settings</li>
              </ul>
            </div>
            <div className="recommendation">
              <h5>Desktop Computers</h5>
              <ul>
                <li>50+ sprites usually fine</li>
                <li>Monitor CPU usage</li>
                <li>Consider browser limits</li>
                <li>Test across browsers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}