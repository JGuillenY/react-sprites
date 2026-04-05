import { SpriteManagerProvider } from '../../src/SpriteManager';
import DemoLayout from './components/DemoLayout';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <SpriteManagerProvider>
      <DemoLayout>
        <Outlet />
      </DemoLayout>
    </SpriteManagerProvider>
  );
}

export default App;