import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Car, UserPlus } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', password: '', 
    cnic: '', licenseNo: '', dateOfBirth: '', occupation: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/customers', formData);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-deep)', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
            <Car color="var(--accent-primary)" size={32} />
          </div>
          <h1 style={{ fontFamily: 'Exo 2', fontSize: '24px', color: 'var(--text-primary)', textAlign: 'center' }}>Join RideNext</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your account to start booking.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>First Name</label>
              <input className="input" placeholder="Ali" required onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Last Name</label>
              <input className="input" placeholder="Khan" required onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Phone Number</label>
            <input className="input" placeholder="e.g. 555-0123" required onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Password</label>
            <input className="input" type="password" placeholder="••••••••" required onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>CNIC</label>
              <input className="input" placeholder="ID Number" required onChange={e => setFormData({...formData, cnic: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>License No</label>
              <input className="input" placeholder="Driver License" required onChange={e => setFormData({...formData, licenseNo: e.target.value})} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Date of Birth</label>
            <input className="input" type="date" required onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
