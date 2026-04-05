import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DemoLayoutProps {
  children: ReactNode;
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className="demo-layout">
      <header className="demo-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-icon">🎮</span>
              <span className="logo-text">SpriteManager</span>
            </Link>
            
            <nav className="nav-links">
              <Link to="/basic-sprite" className={location.pathname === '/basic-sprite' ? 'active' : ''}>
                Basic Sprite
              </Link>
              <Link to="/animated-sprite" className={location.pathname === '/animated-sprite' ? 'active' : ''}>
                Animated Sprite
              </Link>
              <Link to="/sprite-sheet" className={location.pathname === '/sprite-sheet' ? 'active' : ''}>
                Sprite Sheet
              </Link>
              <Link to="/animation-control" className={location.pathname === '/animation-control' ? 'active' : ''}>
                Animation Control
              </Link>
              <Link to="/performance" className={location.pathname === '/performance' ? 'active' : ''}>
                Performance
              </Link>
            </nav>
            
            <Link to="/" className="home-link">
              Home
            </Link>
          </div>
        </div>
      </header>
      
      <main className="demo-content">
        <div className="container">
          {children}
        </div>
      </main>
      
      {!isHome && (
        <footer className="demo-footer">
          <div className="container">
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </footer>
      )}
    </div>
  );
}