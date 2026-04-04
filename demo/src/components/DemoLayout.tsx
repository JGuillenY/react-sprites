import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DemoLayoutProps {
  children: ReactNode;
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  return (
    <div className="demo-layout">
      <Sidebar />
      <main className="demo-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}