import { useState } from 'react';
import { Sprite } from '../../../src/Sprite';

export default function BasicSpriteDemo() {
  const [transform, setTransform] = useState({
    x: 150,
    y: 100,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
  });

  const spriteExamples = [
    {
      id: 'example-1',
      src: '/hero_walk1.png',
      label: 'Basic Sprite',
      description: 'Simple static image with default settings',
    },
    {
      id: 'example-2',
      src: '/hero_attack1.png',
      label: 'Custom Size',
      description: 'Sprite with custom width and height',
      width: 80,
      height: 80,
    },
    {
      id: 'example-3',
      src: '/hero_walk2.png',
      label: 'Transformed',
      description: 'With rotation, scale, and opacity',
      transform: {
        rotation: 45,
        scaleX: 1.2,
        scaleY: 1.2,
        opacity: 0.8,
      },
    },
  ];

  return (
    <div className="demo-card">
      <h3 className="demo-title">Basic Sprite Examples</h3>
      <p className="demo-description">
        The <code>Sprite</code> component renders static images with transform support.
        Sprites are automatically cached and can be positioned, scaled, rotated, and faded.
      </p>
      
      <div className="demo-grid">
        {spriteExamples.map((example) => (
          <div key={example.id} className="demo-panel">
            <h4>{example.label}</h4>
            <p className="demo-description">{example.description}</p>
            <div className="sprite-container">
              <Sprite
                id={example.id}
                src={example.src}
                width={example.width}
                height={example.height}
                transform={example.transform}
                onLoad={() => console.log(`${example.label} loaded`)}
                onError={(error) => console.error(`Failed to load ${example.label}:`, error)}
              />
            </div>
            
            <div className="code-block">
              <pre>
                <code>{`<Sprite
  id="${example.id}"
  src="${example.src}"${example.width ? `\n  width={${example.width}}` : ''}${example.height ? `\n  height={${example.height}}` : ''}${example.transform ? `\n  transform={{${Object.entries(example.transform).map(([key, value]) => `\n    ${key}: ${value},`).join('')}\n  }}` : ''}
/>`}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
      
      <div className="demo-panel">
        <h4>Interactive Transform Controls</h4>
        <p className="demo-description">
          Adjust the transform properties below to see how they affect the sprite.
        </p>
        
        <div className="sprite-container" style={{ minHeight: '300px' }}>
          <Sprite
            id="interactive-sprite"
            src="/hero_walk3.png"
            width={100}
            height={100}
            transform={transform}
          />
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label className="control-label">Position</label>
            <div className="control-buttons">
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, x: t.x - 10 }))}
              >
                ← Move Left
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, x: t.x + 10 }))}
              >
                Move Right →
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, y: t.y - 10 }))}
              >
                ↑ Move Up
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, y: t.y + 10 }))}
              >
                ↓ Move Down
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform({ x: 150, y: 100, scaleX: 1, scaleY: 1, rotation: 0, opacity: 1 })}
              >
                Reset Position
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Scale</label>
            <div className="control-buttons">
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, scaleX: t.scaleX * 1.1, scaleY: t.scaleY * 1.1 }))}
              >
                + Scale Up
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, scaleX: t.scaleX * 0.9, scaleY: t.scaleY * 0.9 }))}
              >
                - Scale Down
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, scaleX: 1, scaleY: 1 }))}
              >
                Reset Scale
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Rotation</label>
            <div className="control-buttons">
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, rotation: t.rotation - 15 }))}
              >
                ↶ Rotate Left
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, rotation: t.rotation + 15 }))}
              >
                ↷ Rotate Right
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, rotation: 0 }))}
              >
                Reset Rotation
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Opacity</label>
            <div className="control-buttons">
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, opacity: Math.max(0, t.opacity - 0.1) }))}
              >
                - Decrease
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, opacity: Math.min(1, t.opacity + 0.1) }))}
              >
                + Increase
              </button>
              <button 
                className="secondary small"
                onClick={() => setTransform(t => ({ ...t, opacity: 1 }))}
              >
                Reset Opacity
              </button>
            </div>
          </div>
        </div>
        
        <div className="code-block">
          <pre>
            <code>{`// Current transform state
const transform = {
  x: ${transform.x},
  y: ${transform.y},
  scaleX: ${transform.scaleX.toFixed(1)},
  scaleY: ${transform.scaleY.toFixed(1)},
  rotation: ${transform.rotation},
  opacity: ${transform.opacity.toFixed(1)},
};`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}