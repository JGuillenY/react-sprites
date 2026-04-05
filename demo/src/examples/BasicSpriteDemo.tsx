import { useState } from "react";
import { ImgSprite } from "../../../src/index";

export default function BasicSpriteDemo() {
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
  });

  const handleTransformChange = (
    key: keyof typeof transform,
    value: number,
  ) => {
    setTransform((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetTransform = () => {
    setTransform({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      opacity: 1,
    });
  };

  return (
    <div className="demo-page">
      <h1 className="demo-title">Basic Sprite Demo</h1>
      <p className="demo-description">
        Simple static sprite rendering with transform support (position, scale,
        rotation, opacity). The <code>ImgSprite</code> component handles image
        loading, caching, and rendering.
      </p>

      <div className="sprite-container">
        <ImgSprite
          id="demo-sprite"
          src="/hero_idle.png"
          width={64}
          height={64}
          transform={transform}
          onLoad={() => console.log("Sprite loaded successfully")}
          onError={(error) => console.error("Failed to load sprite:", error)}
        />
      </div>

      <div className="controls">
        <div className="control-group">
          <label className="control-label">Position</label>
          <div className="control-buttons">
            <button
              className="secondary"
              onClick={() => handleTransformChange("x", transform.x - 10)}
            >
              ← X -10
            </button>
            <button
              className="secondary"
              onClick={() => handleTransformChange("x", transform.x + 10)}
            >
              X +10 →
            </button>
            <button
              className="secondary"
              onClick={() => handleTransformChange("y", transform.y - 10)}
            >
              ↑ Y -10
            </button>
            <button
              className="secondary"
              onClick={() => handleTransformChange("y", transform.y + 10)}
            >
              Y +10 ↓
            </button>
          </div>
          <div className="transform-values">
            <div>X: {transform.x}px</div>
            <div>Y: {transform.y}px</div>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Scale</label>
          <div className="control-buttons">
            <button
              className="secondary"
              onClick={() =>
                handleTransformChange(
                  "scaleX",
                  Math.max(0.1, transform.scaleX - 0.1),
                )
              }
            >
              Scale X -0.1
            </button>
            <button
              className="secondary"
              onClick={() =>
                handleTransformChange("scaleX", transform.scaleX + 0.1)
              }
            >
              Scale X +0.1
            </button>
            <button
              className="secondary"
              onClick={() =>
                handleTransformChange(
                  "scaleY",
                  Math.max(0.1, transform.scaleY - 0.1),
                )
              }
            >
              Scale Y -0.1
            </button>
            <button
              className="secondary"
              onClick={() =>
                handleTransformChange("scaleY", transform.scaleY + 0.1)
              }
            >
              Scale Y +0.1
            </button>
          </div>
          <div className="transform-values">
            <div>Scale X: {transform.scaleX.toFixed(1)}x</div>
            <div>Scale Y: {transform.scaleY.toFixed(1)}x</div>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Rotation & Opacity</label>
          <div className="control-buttons">
            <button
              className="secondary"
              onClick={() =>
                handleTransformChange("rotation", transform.rotation - 15)
              }
            >
              ↶ -15°
            </button>
            <button
              className="secondary"
              onClick={() =>
                handleTransformChange("rotation", transform.rotation + 15)
              }
            >
              ↷ +15°
            </button>
            <button
              className="secondary"
              onClick={() =>
                handleTransformChange(
                  "opacity",
                  Math.max(0, transform.opacity - 0.1),
                )
              }
            >
              Opacity -0.1
            </button>
            <button
              className="secondary"
              onClick={() =>
                handleTransformChange(
                  "opacity",
                  Math.min(1, transform.opacity + 0.1),
                )
              }
            >
              Opacity +0.1
            </button>
          </div>
          <div className="transform-values">
            <div>Rotation: {transform.rotation}°</div>
            <div>Opacity: {transform.opacity.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Presets</label>
        <div className="control-buttons">
          <button
            className="success"
            onClick={() =>
              setTransform({
                x: 200,
                y: 150,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                opacity: 1,
              })
            }
          >
            Reset to Default
          </button>
          <button
            className="secondary"
            onClick={() =>
              setTransform({
                x: 100,
                y: 100,
                scaleX: 2,
                scaleY: 2,
                rotation: 45,
                opacity: 0.8,
              })
            }
          >
            Large & Rotated
          </button>
          <button
            className="secondary"
            onClick={() =>
              setTransform({
                x: 300,
                y: 200,
                scaleX: 0.5,
                scaleY: 0.5,
                rotation: -30,
                opacity: 0.6,
              })
            }
          >
            Small & Faded
          </button>
          <button className="warning" onClick={resetTransform}>
            Reset All
          </button>
        </div>
      </div>

      <div className="code-block">
        <h3>Usage Example</h3>
        <pre>
          <code>{`import { ImgSprite } from "@infinite-dungeon/sprite-manager";

function MyComponent() {
  const [transform, setTransform] = useState({
    x: 200,
    y: 150,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
  });

  return (
    <ImgSprite
      id="my-sprite"
      src="/sprites/character.png"
      width={64}
      height={64}
      transform={transform}
      onLoad={() => console.log("Sprite loaded")}
      onError={(error) => console.error("Failed to load:", error)}
    />
  );
}`}</code>
        </pre>
      </div>

      <div className="demo-card">
        <h3>Features Demonstrated</h3>
        <div className="controls">
          <div className="control-group">
            <div className="status success">✅ Image Loading & Caching</div>
            <p className="demo-description">
              Sprites are automatically loaded and cached. Duplicate requests
              return cached resources.
            </p>
          </div>
          <div className="control-group">
            <div className="status success">✅ Transform Support</div>
            <p className="demo-description">
              Full CSS transform support: position (x, y), scale, rotation, and
              opacity.
            </p>
          </div>
          <div className="control-group">
            <div className="status success">✅ Error Handling</div>
            <p className="demo-description">
              Graceful error handling with fallback UI and error callbacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
