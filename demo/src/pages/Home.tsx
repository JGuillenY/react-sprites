import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>SpriteManager Demo</h1>
        <p className="subtitle">
          A React-based sprite and animation management library for games
        </p>
      </header>

      <div className="demo-grid">
        <div className="demo-card">
          <h2>Basic Sprite</h2>
          <p className="demo-description">
            Simple static sprite rendering with transform support (position, scale, rotation, opacity).
          </p>
          <div className="demo-features">
            <span className="feature-tag">🖼️ Static images</span>
            <span className="feature-tag">🎯 Transform support</span>
            <span className="feature-tag">📦 Resource caching</span>
          </div>
          <Link to="/basic-sprite" className="demo-link">
            View Demo →
          </Link>
        </div>

        <div className="demo-card">
          <h2>Animated Sprite</h2>
          <p className="demo-description">
            Frame-based animations with timing control, loop management, and playback controls.
          </p>
          <div className="demo-features">
            <span className="feature-tag">🎬 Frame animations</span>
            <span className="feature-tag">🔄 Loop control</span>
            <span className="feature-tag">🎮 Playback controls</span>
          </div>
          <Link to="/animated-sprite" className="demo-link">
            View Demo →
          </Link>
        </div>

        <div className="demo-card">
          <h2>Sprite Sheet</h2>
          <p className="demo-description">
            Extract and animate frames from grid-based sprite sheets for efficient resource usage.
          </p>
          <div className="demo-features">
            <span className="feature-tag">🧩 Grid extraction</span>
            <span className="feature-tag">⚡ Efficient loading</span>
            <span className="feature-tag">🎨 Single image source</span>
          </div>
          <Link to="/sprite-sheet" className="demo-link">
            View Demo →
          </Link>
        </div>

        <div className="demo-card">
          <h2>Animation Control</h2>
          <p className="demo-description">
            Advanced animation control with transitions, speed adjustment, and event callbacks.
          </p>
          <div className="demo-features">
            <span className="feature-tag">🎚️ Speed control</span>
            <span className="feature-tag">🔄 Transitions</span>
            <span className="feature-tag">📞 Event callbacks</span>
          </div>
          <Link to="/animation-control" className="demo-link">
            View Demo →
          </Link>
        </div>

        <div className="demo-card">
          <h2>Performance</h2>
          <p className="demo-description">
            Stress test with multiple sprites (20-50). Monitor FPS, memory usage, and render performance.
          </p>
          <div className="demo-features">
            <span className="feature-tag">⚡ Performance metrics</span>
            <span className="feature-tag">📊 FPS monitoring</span>
            <span className="feature-tag">🧪 Stress testing</span>
          </div>
          <Link to="/performance" className="demo-link">
            View Demo →
          </Link>
        </div>

        <div className="demo-card info-card">
          <h2>About SpriteManager</h2>
          <p className="demo-description">
            A lightweight React library for 2D game development. Built with TypeScript, optimized for performance, and designed to be simple yet powerful.
          </p>
          <div className="info-features">
            <div className="info-feature">
              <span className="info-icon">🎯</span>
              <div>
                <h4>Simple API</h4>
                <p>Intuitive React components and hooks</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="info-icon">⚡</span>
              <div>
                <h4>Performance</h4>
                <p>Optimized rendering and resource management</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="info-icon">🔧</span>
              <div>
                <h4>TypeScript</h4>
                <p>Full type safety and editor support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>
          <strong>SpriteManager</strong> - A library for React-based game development
        </p>
        <p>
          Built with TypeScript • Optimized for performance • Open source
        </p>
      </footer>
    </div>
  );
}