import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'Cash', amount: '', contractNo: '', subData: {} });

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments');
      setPayments(res.data.data);
    } catch { toast.error('Failed to load payments'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/payments', formData);
      toast.success('Payment recorded');
      setShowForm(false);
      fetchPayments();
    } catch { toast.error('Failed to record payment'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Payments</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add Payment</button>
      </div>
      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              {['ID', 'Amount', 'Type', 'Status', 'Date', 'Contract'].map(h => (
                <th key={h} style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.PaymentID} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>PAY-{p.PaymentID}</td>
                <td style={{ padding: '12px' }}>${parseFloat(p.Amount).toFixed(2)}</td>
                <td style={{ padding: '12px' }}>{p.PaymentType}</td>
                <td style={{ padding: '12px' }}><span className={`badge badge-${p.PaymentStatus === 'Paid' ? 'available' : 'danger'}`}>{p.PaymentStatus}</span></td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{new Date(p.PaymentDate).toLocaleDateString()}</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{p.ContractNo || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 style={{ marginBottom: '16px' }}>Add Payment</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="input" type="number" placeholder="Amount" required onChange={e => setFormData({ ...formData, amount: e.target.value })} />
              <select className="input" onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
              <input className="input" placeholder="Contract No (optional)" onChange={e => setFormData({ ...formData, contractNo: e.target.value })} />
              {formData.type === 'Cash' && <>
                <input className="input" placeholder="Cashier Name" onChange={e => setFormData({ ...formData, subData: { ...formData.subData, CashierName: e.target.value } })} />
                <input className="input" placeholder="Receipt No" onChange={e => setFormData({ ...formData, subData: { ...formData.subData, ReceiptNo: e.target.value } })} />
              </>}
              {formData.type === 'Card' && <>
                <select className="input" onChange={e => setFormData({ ...formData, subData: { ...formData.subData, CardType: e.target.value } })}>
                  <option>Visa</option><option>Mastercard</option><option>Amex</option>
                </select>
                <input className="input" placeholder="Last 4 digits" maxLength="4" onChange={e => setFormData({ ...formData, subData: { ...formData.subData, CardLast4: e.target.value } })} />
              </>}
              {formData.type === 'Online' && <>
                <select className="input" onChange={e => setFormData({ ...formData, subData: { ...formData.subData, PaymentGateway: e.target.value } })}>
                  <option>JazzCash</option><option>Easypaisa</option><option>PayPal</option><option>Stripe</option>
                </select>
                <input className="input" placeholder="Transaction Reference" onChange={e => setFormData({ ...formData, subData: { ...formData.subData, TransactionReference: e.target.value } })} />
              </>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-primary" style={{ background: 'var(--bg-elevated)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
