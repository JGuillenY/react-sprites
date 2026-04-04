import { useState, useMemo } from 'react';
import { calculateSpriteSheetFrames } from '../../../src/spriteSheet';
import { AnimatedSprite } from '../../../src/index';

export default function SpriteSheetDemo() {
  const [spriteSheetConfig, setSpriteSheetConfig] = useState({
    frameWidth: 64,
    frameHeight: 64,
    cols: 2,
    rows: 2,
    totalFrames: 4,
  });

  // Calculate frames from sprite sheet configuration
  const frames = useMemo(() => {
    return calculateSpriteSheetFrames({
      src: '/hero_down-Sheet.png',
      ...spriteSheetConfig,
    });
  }, [spriteSheetConfig]);

  // Create animations from sprite sheet frames
  const animations = useMemo(() => {
    return {
      walk: {
        id: 'walk',
        name: 'Walk Animation',
        frames: frames.map((frame, index) => ({
          id: index,
          sprite: '/hero_down-Sheet.png',
          duration: 100,
          frameData: frame,
        })),
        loop: true,
        speed: 1.0,
      },
    };
  }, [frames]);

  const updateConfig = (key: keyof typeof spriteSheetConfig, value: number) => {
    setSpriteSheetConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="demo-card">
      <h3 className="demo-title">Sprite Sheet Support</h3>
      <p className="demo-description">
        SpriteManager can extract individual frames from grid-based sprite sheets.
        This is more efficient than loading separate image files and allows for smooth animations.
      </p>
      
      <div className="demo-panel">
        <h4>Sprite Sheet Visualization</h4>
        <p className="demo-description">
          The image below represents a sprite sheet. Each frame is extracted based on the grid configuration.
        </p>
        
        <div className="sprite-container" style={{ minHeight: '250px' }}>
          <div 
            style={{
              position: 'relative',
              width: '128px',
              height: '128px',
              backgroundImage: 'url(/hero_down-Sheet.png)',
              backgroundSize: 'cover',
              border: '2px solid var(--primary-color)',
            }}
          >
            {/* Draw grid lines */}
            {Array.from({ length: spriteSheetConfig.cols - 1 }).map((_, i) => (
              <div
                key={`col-${i}`}
                style={{
                  position: 'absolute',
                  left: `${((i + 1) * spriteSheetConfig.frameWidth)}px`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }}
              />
            ))}
            {Array.from({ length: spriteSheetConfig.rows - 1 }).map((_, i) => (
              <div
                key={`row-${i}`}
                style={{
                  position: 'absolute',
                  top: `${((i + 1) * spriteSheetConfig.frameHeight)}px`,
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }}
              />
            ))}
            
            {/* Highlight current frame */}
            <div
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: `${spriteSheetConfig.frameWidth}px`,
                height: `${spriteSheetConfig.frameHeight}px`,
                border: '2px solid var(--success-color)',
                boxShadow: '0 0 10px var(--success-color)',
                animation: 'pulse 2s infinite',
              }}
            />
          </div>
        </div>
        
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{spriteSheetConfig.cols} × {spriteSheetConfig.rows}</div>
            <div className="stat-label">Grid Size</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{spriteSheetConfig.frameWidth}×{spriteSheetConfig.frameHeight}</div>
            <div className="stat-label">Frame Size</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{spriteSheetConfig.totalFrames}</div>
            <div className="stat-label">Total Frames</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{frames.length}</div>
            <div className="stat-label">Extracted</div>
          </div>
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label className="control-label">Grid Configuration</label>
            <div className="control-buttons">
              <button 
                className="secondary small"
                onClick={() => updateConfig('cols', Math.max(1, spriteSheetConfig.cols - 1))}
              >
                - Columns
              </button>
              <button 
                className="secondary small"
                onClick={() => updateConfig('cols', spriteSheetConfig.cols + 1)}
              >
                + Columns
              </button>
              <button 
                className="secondary small"
                onClick={() => updateConfig('rows', Math.max(1, spriteSheetConfig.rows - 1))}
              >
                - Rows
              </button>
              <button 
                className="secondary small"
                onClick={() => updateConfig('rows', spriteSheetConfig.rows + 1)}
              >
                + Rows
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Frame Size</label>
            <div className="control-buttons">
              <button 
                className="secondary small"
                onClick={() => updateConfig('frameWidth', Math.max(8, spriteSheetConfig.frameWidth - 8))}
              >
                - Width
              </button>
              <button 
                className="secondary small"
                onClick={() => updateConfig('frameWidth', spriteSheetConfig.frameWidth + 8)}
              >
                + Width
              </button>
              <button 
                className="secondary small"
                onClick={() => updateConfig('frameHeight', Math.max(8, spriteSheetConfig.frameHeight - 8))}
              >
                - Height
              </button>
              <button 
                className="secondary small"
                onClick={() => updateConfig('frameHeight', spriteSheetConfig.frameHeight + 8)}
              >
                + Height
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Frame Count</label>
            <div className="control-buttons">
              <button 
                className="secondary small"
                onClick={() => updateConfig('totalFrames', Math.max(1, spriteSheetConfig.totalFrames - 1))}
              >
                - Frames
              </button>
              <button 
                className="secondary small"
                onClick={() => updateConfig('totalFrames', Math.min(spriteSheetConfig.cols * spriteSheetConfig.rows, spriteSheetConfig.totalFrames + 1))}
              >
                + Frames
              </button>
              <button 
                className="secondary small"
                onClick={() => updateConfig('totalFrames', spriteSheetConfig.cols * spriteSheetConfig.rows)}
              >
                Use All
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="demo-panel">
        <h4>Extracted Frames Animation</h4>
        <p className="demo-description">
          The animation below uses the extracted frames from the sprite sheet above.
          Each frame is rendered from the sprite sheet using canvas clipping.
        </p>
        
        <div className="sprite-container" style={{ minHeight: '200px' }}>
          <AnimatedSprite
            id="sprite-sheet-character"
            idle="walk"
            animations={animations}
            width={spriteSheetConfig.frameWidth * 2}
            height={spriteSheetConfig.frameHeight * 2}
            transform={{ x: 200, y: 100 }}
            autoPlay={true}
          />
        </div>
        
        <div className="code-block">
          <pre>
            <code>{`// Calculate frames from sprite sheet
import { calculateSpriteSheetFrames } from '../../../src/spriteSheet';

const frames = calculateSpriteSheetFrames({
  src: '/hero_down-Sheet.png',
  frameWidth: ${spriteSheetConfig.frameWidth},
  frameHeight: ${spriteSheetConfig.frameHeight},
  cols: ${spriteSheetConfig.cols},
  rows: ${spriteSheetConfig.rows},
  totalFrames: ${spriteSheetConfig.totalFrames},
});

// Create animation using extracted frames
const animations = {
  walk: {
    id: 'walk',
    name: 'Walk Animation',
    frames: frames.map((frame, index) => ({
      id: index,
      sprite: '/path/to/sprite-sheet.png',
      duration: 100,
      frameData: frame, // Pass frame coordinates
    })),
    loop: true,
    speed: 1.0,
  },
};

// Use with AnimatedSprite component
<AnimatedSprite
  id="character"
  idle="walk"
  animations={animations}
  width={${spriteSheetConfig.frameWidth * 2}}
  height={${spriteSheetConfig.frameHeight * 2}}
  autoPlay={true}
/>`}</code>
          </pre>
        </div>
      </div>
      
      <div className="demo-panel">
        <h4>Benefits of Sprite Sheets</h4>
        <div className="controls">
          <div className="control-group">
            <div className="status success">✅ Reduced HTTP Requests</div>
            <p className="demo-description">
              One image file instead of many individual frames reduces network overhead.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status success">✅ Better Compression</div>
            <p className="demo-description">
              Sprite sheets compress better than separate images due to shared color palettes.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status success">✅ Memory Efficiency</div>
            <p className="demo-description">
              Single texture in GPU memory instead of multiple textures.
            </p>
          </div>
          
          <div className="control-group">
            <div className="status success">✅ Batch Rendering</div>
            <p className="demo-description">
              Can render multiple frames in single draw call with proper batching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}