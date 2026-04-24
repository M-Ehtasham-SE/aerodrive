import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicLayout({ children }) {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-primary)' }}>
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '16px 64px', borderBottom: '1px solid var(--bg-border)',
        background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px', color: 'var(--accent-primary)' }}>⚡</span>
          <span style={{ fontFamily: 'Exo 2', fontSize: '20px', fontWeight: 700 }}>RideNext</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/vehicles" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Browse Fleet</Link>
          {!user ? (
            <>
              <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Sign In</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px' }}>Sign Up</Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn-primary" style={{ padding: '8px 20px' }}>Dashboard</Link>
          )}
        </div>
      </nav>
      
      <main style={{ padding: '40px 64px' }}>
        {children}
      </main>
      
      <footer style={{ padding: '40px 64px', borderTop: '1px solid var(--bg-border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        &copy; 2026 RideNext. All rights reserved.
      </footer>
    </div>
  );
}
