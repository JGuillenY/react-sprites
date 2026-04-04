import { SpriteManagerProvider } from '../../src/SpriteManager';
import DemoLayout from './components/DemoLayout';
import BasicSpriteDemo from './examples/BasicSpriteDemo';
import AnimatedSpriteDemo from './examples/AnimatedSpriteDemo';
import SpriteSheetDemo from './examples/SpriteSheetDemo';
import AnimationControlDemo from './examples/AnimationControlDemo';
import PerformanceDemo from './examples/PerformanceDemo';

function App() {
  return (
    <SpriteManagerProvider>
      <DemoLayout>
        <h1>SpriteManager Demo</h1>
        <p className="subtitle">
          A React-based sprite and animation management library for games
        </p>
        
        <section id="basic-sprite">
          <h2>1. Basic Sprite</h2>
          <BasicSpriteDemo />
        </section>
        
        <section id="animated-sprite">
          <h2>2. Animated Sprite</h2>
          <AnimatedSpriteDemo />
        </section>
        
        <section id="sprite-sheet">
          <h2>3. Sprite Sheet</h2>
          <SpriteSheetDemo />
        </section>
        
        <section id="animation-control">
          <h2>4. Animation Control</h2>
          <AnimationControlDemo />
        </section>
        
        <section id="performance">
          <h2>5. Performance</h2>
          <PerformanceDemo />
        </section>
        
        <footer>
          <p>
            <strong>SpriteManager</strong> - A library for React-based game development
          </p>
          <p>
            Built with TypeScript • Canvas rendering • Optimized for performance
          </p>
        </footer>
      </DemoLayout>
    </SpriteManagerProvider>
  );
}

export default App;