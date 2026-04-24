import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function CustomerProfile({ id, onClose }) {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`/customers/${id}`);
      setCustomer(res.data.data);
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  if (!customer) return null;

  return (
    <div className="slide-panel open" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '400px', background: 'var(--bg-surface)', borderLeft: '1px solid var(--bg-border)', padding: '24px', zIndex: 100, overflowY: 'auto' }}>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '16px' }}>Close ✕</button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
          {customer.Person?.FirstName[0]}{customer.Person?.LastName[0]}
        </div>
        <div>
          <h2 style={{ fontFamily: 'Exo 2', color: 'var(--text-primary)' }}>{customer.Person?.FirstName} {customer.Person?.LastName}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{customer.Occupation}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Identification</h3>
        <p>CNIC: <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{customer.CNIC}</span></p>
        <p>License: <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{customer.LicenseNo}</span></p>
        <p>DOB: {customer.DateOfBirth} {customer.Age && `(Age: ${customer.Age})`}</p>
      </div>
      
      <div className="card">
        <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Contact</h3>
        <p>Phone: {customer.Person?.Phone}</p>
        {customer.CustomerEmails && customer.CustomerEmails.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <p>Emails:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {customer.CustomerEmails.map(e => <span key={e.id} className="tag">{e.Email}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
