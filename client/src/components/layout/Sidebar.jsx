import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Car, Users, KeyRound, CreditCard,
  Wrench, AlertTriangle, Shield, Building2, LogOut
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['manager'] },
  { path: '/vehicles', label: 'Vehicles', icon: Car, roles: ['manager', 'clerk', 'mechanic'] },
  { path: '/customers', label: 'Customers', icon: Users, roles: ['manager', 'clerk'] },
  { path: '/reservations', label: 'Reservations', icon: KeyRound, roles: ['manager', 'clerk'] },
  { path: '/contracts', label: 'Contracts', icon: KeyRound, roles: ['manager', 'clerk'] },
  { path: '/payments', label: 'Payments', icon: CreditCard, roles: ['manager', 'clerk'] },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['manager', 'mechanic'] },
  { path: '/damage', label: 'Damage', icon: AlertTriangle, roles: ['manager', 'clerk'] },
  { path: '/insurance', label: 'Insurance', icon: Shield, roles: ['manager'] },
  { path: '/branches', label: 'Branches', icon: Building2, roles: ['manager'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allowedItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <aside style={{
      width: '260px', minHeight: '100vh', background: 'var(--bg-surface)',
      borderRight: '1px solid var(--bg-border)', display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50
    }}>
      {/* Logo */}
      <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--bg-border)' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
          <Car size={18} color="#fff" />
        </div>
        <span style={{ fontFamily: 'Exo 2', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>AeroDrive</span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {allowedItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', textDecoration: 'none', cursor: 'pointer',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-subtle)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
              transition: 'all 0.15s ease',
              fontSize: '14px'
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--bg-border)' }}>
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{user?.name}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', padding: '6px 0' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
