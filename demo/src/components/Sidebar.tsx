export default function Sidebar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SpriteManager</h2>
        <p className="version">v0.1.0</p>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <button onClick={() => scrollToSection('basic-sprite')}>
              <span className="nav-icon">🖼️</span>
              Basic Sprite
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('animated-sprite')}>
              <span className="nav-icon">🎬</span>
              Animated Sprite
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('sprite-sheet')}>
              <span className="nav-icon">🧩</span>
              Sprite Sheet
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('animation-control')}>
              <span className="nav-icon">🎮</span>
              Animation Control
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('performance')}>
              <span className="nav-icon">⚡</span>
              Performance
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="features">
          <h3>Features</h3>
          <ul>
            <li>🎨 Canvas rendering</li>
            <li>🎬 Frame animations</li>
            <li>📦 Resource caching</li>
            <li>🧩 Sprite sheets</li>
            <li>⚡ Performance optimized</li>
            <li>🔧 TypeScript support</li>
          </ul>
        </div>
        
        <div className="links">
          <a href="https://github.com/infinite-dungeon/sprite-manager" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://npmjs.com/package/@infinite-dungeon/sprite-manager" target="_blank" rel="noopener noreferrer">
            npm
          </a>
          <a href="https://docs.sprite-manager.dev" target="_blank" rel="noopener noreferrer">
            Documentation
          </a>
        </div>
      </div>
    </aside>
  );
}