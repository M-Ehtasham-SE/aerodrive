import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
        <TopBar />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
