import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function TopBar() {
  const { user } = useAuth();
  const location = useLocation();

  const pageName = location.pathname === '/' ? 'Dashboard'
    : location.pathname.replace('/', '').replace(/-/g, ' ')
        .split('/')[0]
        .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <header style={{
      height: '64px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--bg-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>RideNext: Vehicle Rental Management System</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>{pageName}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)',
          border: '1px solid var(--bg-border)', borderRadius: '8px', padding: '6px 12px', width: '220px'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Search... (Ctrl+K)</span>
        </div>

        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative' }}>
          <Bell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '13px'
          }}>
            {user?.name?.charAt(0)}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
