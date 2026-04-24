import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [closingId, setClosingId] = useState(null);
  const [mileage, setMileage] = useState('');

  useEffect(() => { fetchContracts(); }, []);

  const fetchContracts = async () => {
    try {
      const res = await axios.get('/contracts');
      setContracts(res.data.data);
    } catch { toast.error('Failed to load contracts'); }
  };

  const closeContract = async (no) => {
    try {
      await axios.put(`/contracts/${no}/close`, { mileageAtEnd: mileage });
      toast.success('Contract closed');
      setClosingId(null);
      fetchContracts();
    } catch { toast.error('Failed to close contract'); }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px', marginBottom: '24px' }}>Contracts</h1>
      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              {['Contract No', 'Customer', 'Vehicle', 'Pickup', 'Return', 'Total Charge', 'Payment Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.ContractNo} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{c.ContractNo}</td>
                <td style={{ padding: '12px' }}>{c.Customer?.Person?.FirstName} {c.Customer?.Person?.LastName}</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{c.Vehicle?.LicensePlate}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{c.PickupDate}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{c.ReturnDate}</td>
                <td style={{ padding: '12px' }}>${parseFloat(c.TotalCharge || 0).toFixed(2)}</td>
                <td style={{ padding: '12px' }}><span className={`badge badge-${c.PaymentStatus === 'Paid' ? 'available' : c.PaymentStatus === 'Partial' ? 'reserved' : 'danger'}`}>{c.PaymentStatus}</span></td>
                <td style={{ padding: '12px' }}>
                  {c.PaymentStatus !== 'Paid' && (
                    closingId === c.ContractNo ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input className="input" placeholder="Mileage" style={{ width: '100px', padding: '4px 8px' }} onChange={e => setMileage(e.target.value)} />
                        <button onClick={() => closeContract(c.ContractNo)} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>Close</button>
                        <button onClick={() => setClosingId(null)} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px', background: 'var(--bg-elevated)' }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setClosingId(c.ContractNo)} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>Close Contract</button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
