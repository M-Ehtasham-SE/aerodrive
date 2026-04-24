import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ReservationWizard from './ReservationWizard';

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => { fetchReservations(); }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get('/reservations');
      setReservations(res.data.data);
    } catch { toast.error('Failed to load reservations'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/reservations/${id}/status`, { status });
      toast.success(`Reservation ${status}`);
      fetchReservations();
    } catch { toast.error('Failed to update status'); }
  };

  const tabs = ['All', 'Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'];
  const filtered = activeTab === 'All' ? reservations : reservations.filter(r => r.Status === activeTab);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Reservations</h1>
        <button onClick={() => setShowWizard(true)} className="btn-primary">
          <Plus size={16} /> New Reservation
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--bg-border)', paddingBottom: '12px' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
            background: activeTab === tab ? 'var(--accent-primary)' : 'var(--bg-elevated)',
            color: activeTab === tab ? '#fff' : 'var(--text-secondary)'
          }}>{tab}</button>
        ))}
      </div>

      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              {['ID', 'Customer', 'Vehicle', 'Pickup', 'Return', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.ReservationID} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>RES-{r.ReservationID}</td>
                <td style={{ padding: '12px' }}>{r.Customer?.Person?.FirstName} {r.Customer?.Person?.LastName}</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{r.Vehicle?.LicensePlate}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{r.PickupDate}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{r.ReturnDate}</td>
                <td style={{ padding: '12px' }}><span className={`badge badge-${r.Status?.toLowerCase()}`}>{r.Status}</span></td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {r.Status === 'Pending' && <button onClick={() => updateStatus(r.ReservationID, 'Confirmed')} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>Confirm</button>}
                    {(r.Status === 'Pending' || r.Status === 'Confirmed') && <button onClick={() => updateStatus(r.ReservationID, 'Cancelled')} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px', background: 'var(--status-danger)' }}>Cancel</button>}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No reservations found</td></tr>}
          </tbody>
        </table>
      </div>

      {showWizard && (
        <ReservationWizard 
          onClose={() => setShowWizard(false)} 
          onSave={() => { setShowWizard(false); fetchReservations(); }} 
        />
      )}
    </div>
  );
}
