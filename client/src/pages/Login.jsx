import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ phone, password });
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
            <Plane color="var(--accent-primary)" size={32} />
          </div>
          <h1 style={{ fontFamily: 'Exo 2', fontSize: '24px', color: 'var(--text-primary)' }}>AeroDrive</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fleet Intelligence. Redefined.</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. 555-6666" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
