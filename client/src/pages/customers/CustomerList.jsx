import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomerForm from './CustomerForm';
import CustomerProfile from './CustomerProfile';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/customers');
      setCustomers(res.data.data);
    } catch (error) {
      toast.error('Failed to load customers');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchCustomers();
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Customers</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Add Customer</button>
      </div>

      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Phone</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>CNIC</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.PersonID} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>CUST-{c.PersonID}</td>
                <td style={{ padding: '12px' }}>{c.Person?.FirstName} {c.Person?.LastName}</td>
                <td style={{ padding: '12px' }}>{c.Person?.Phone}</td>
                <td style={{ padding: '12px' }}>{c.CNIC}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => setSelectedCustomer(c.PersonID)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <CustomerForm onClose={() => setShowForm(false)} onSave={handleSave} />}
      {selectedCustomer && <CustomerProfile id={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
    </div>
  );
}
