import { useState, useEffect, useRef } from 'react';
import { Sprite, AnimatedSprite, useAnimations, useSpriteManager } from '../../../src/index';

export default function PerformanceDemo() {
  const [spriteCount, setSpriteCount] = useState(10);
  const [fps, setFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [renderTime, setRenderTime] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const { getStats } = useSpriteManager();

  // Create a simple animation for multiple sprites
  const animations = useAnimations({
    idle: {
      frames: [
        { sprite: '/hero_walk1.png', duration: 200 },
        { sprite: '/hero_walk2.png', duration: 200 },
      ],
      loop: true,
    },
  });

  // Calculate FPS
  useEffect(() => {
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
      
      requestAnimationFrame(calculateFps);
    };
    
    const fpsId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(fpsId);
  }, [getStats]);

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
    
    for (let i = 0; i < spriteCount; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const x = 50 + col * 60;
      const y = 50 + row * 60;
      
      if (i % 3 === 0) {
        // Static sprite
        sprites.push(
          <Sprite
            key={`static-${i}`}
            id={`sprite-${i}`}
            src={`https://picsum.photos/32/32?random=${300 + i}`}
            width={32}
            height={32}
            transform={{ x, y }}
          />
        );
      } else {
        // Animated sprite
        sprites.push(
          <AnimatedSprite
            key={`animated-${i}`}
            id={`animated-${i}`}
            idle="idle"
            animations={animations}
            width={32}
            height={32}
            transform={{ x, y }}
            autoPlay={true}
          />
        );
      }
    }
    
    return sprites;
  };

  return (
    <div className="demo-card">
      <h3 className="demo-title">Performance & Optimization</h3>
      <p className="demo-description">
        SpriteManager is optimized for performance with automatic caching,
        efficient rendering, and memory management. Test performance with different sprite counts.
      </p>
      
      <div className="demo-panel">
        <h4>Performance Metrics</h4>
        <p className="demo-description">
          Real-time performance metrics while rendering multiple sprites.
        </p>
        
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value" style={{ color: fps > 50 ? 'var(--success-color)' : fps > 30 ? 'var(--warning-color)' : 'var(--error-color)' }}>
              {fps} FPS
            </div>
            <div className="stat-label">Frame Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{spriteCount}</div>
            <div className="stat-label">Total Sprites</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{memoryUsage} KB</div>
            <div className="stat-label">Memory Usage</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{renderTime.toFixed(1)}ms</div>
            <div className="stat-label">Render Time</div>
          </div>
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label className="control-label">Sprite Count: {spriteCount}</label>
            <div className="control-buttons">
              <button 
                className="secondary"
                onClick={() => setSpriteCount(5)}
              >
                5 Sprites
              </button>
              <button 
                className="secondary"
                onClick={() => setSpriteCount(10)}
              >
                10 Sprites
              </button>
              <button 
                className="secondary"
                onClick={() => setSpriteCount(25)}
              >
                25 Sprites
              </button>
              <button 
                className="secondary"
                onClick={() => setSpriteCount(50)}
              >
                50 Sprites
              </button>
              <button 
                className="warning"
                onClick={() => setSpriteCount(100)}
              >
                100 Sprites
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Performance Actions</label>
            <div className="control-buttons">
              <button 
                className="success"
                onClick={() => {
                  // Clear cache to test loading performance
                  // Note: clearCache is not exposed in the current API
                  // This is a placeholder for future implementation
                  console.log('Cache cleared (placeholder)');
                }}
              >
                Clear Cache
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
                Request GC
              </button>
              <button 
                className="secondary"
                onClick={() => {
                  // Reset to default
                  setSpriteCount(10);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="demo-panel">
        <h4>Sprite Stress Test</h4>
        <p className="demo-description">
          Rendering {spriteCount} sprites ({Math.ceil(spriteCount / 3)} static, {Math.floor(spriteCount * 2 / 3)} animated).
          Each sprite is individually positioned and managed.
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
        </div>
        
        <div className="code-block">
          <pre>
            <code>{`// Performance optimization features in SpriteManager:

1. 🎯 AUTOMATIC CACHING
   - Sprites are loaded once and cached
   - Duplicate requests return cached resources
   - Memory is managed automatically

2. ⚡ EFFICIENT RENDERING
   - Canvas-based rendering (faster than DOM)
   - Batch rendering where possible
   - Minimal React re-renders

3. 📦 RESOURCE MANAGEMENT
   - Automatic preloading
   - Error handling and retry
   - Memory cleanup

4. 🔄 OPTIMIZED UPDATES
   - Only update when necessary
   - Efficient animation loops
   - RequestAnimationFrame based

// Example: Rendering multiple sprites efficiently
const sprites = Array.from({ length: ${spriteCount} }).map((_, i) => (
  i % 3 === 0 ? (
    <Sprite
      key={\`static-\${i}\`}
      src={\`/sprites/sprite-\${i}.png\`}
      transform={{ x: i * 60, y: 100 }}
    />
  ) : (
    <AnimatedSprite
      key={\`animated-\${i}\`}
      idle="idle"
      animations={animations}
      transform={{ x: i * 60, y: 100 }}
    />
  )
));`}</code>
          </pre>
        </div>
      </div>
      
      <div className="demo-panel">
        <h4>Performance Tips</h4>
        <div className="controls">
          <div className="control-group">
            <div className="status success">✅ Use Sprite Sheets</div>
            <p className="demo-description">
              Combine multiple frames into single images to reduce HTTP requests and memory usage.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status success">✅ Preload Resources</div>
            <p className="demo-description">
              Use <code>usePreloadSprites</code> to load assets before they're needed.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status success">✅ Limit Active Animations</div>
            <p className="demo-description">
              Pause animations that are off-screen or not visible to save CPU cycles.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status success">✅ Optimize Frame Rates</div>
            <p className="demo-description">
              Use appropriate frame durations (60fps = 16.7ms per frame).
            </p>
          </div>
        </div>
        
        <div className="controls">
          <div className="control-group">
            <div className="status warning">⚠️ Monitor Memory</div>
            <p className="demo-description">
              Clear cache periodically if loading many unique sprites.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status warning">⚠️ Batch Updates</div>
            <p className="demo-description">
              Update multiple sprites in single React state update when possible.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status warning">⚠️ Use Appropriate Sizes</div>
            <p className="demo-description">
              Don't load high-resolution images for small display sizes.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status warning">⚠️ Test on Target Devices</div>
            <p className="demo-description">
              Performance varies across devices; test on lowest target hardware.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}