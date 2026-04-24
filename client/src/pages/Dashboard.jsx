import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Car, KeyRound, DollarSign, FileText, Wrench } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <p style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Exo 2', color: 'var(--text-primary)' }}>{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [utilisation, setUtilisation] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [summaryRes, utilRes, alertsRes, revenueRes, resRes] = await Promise.all([
        axios.get('/dashboard/summary'),
        axios.get('/dashboard/utilisation'),
        axios.get('/dashboard/alerts'),
        axios.get('/dashboard/revenue'),
        axios.get('/reservations?limit=5')
      ]);
      setSummary(summaryRes.data.data);
      setUtilisation(utilRes.data.data);
      setAlerts(alertsRes.data.data);
      setRevenue(revenueRes.data.data);
      setReservations(resRes.data.data || []);
    } catch (e) {
      // If not manager, some calls will fail — gracefully ignore
    } finally {
      setLoading(false);
    }
  };

  const alertColors = { danger: 'var(--status-danger)', warning: 'var(--status-maintenance)', info: 'var(--status-rented)' };

  return (
    <div>
      <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px', marginBottom: '24px' }}>Fleet Intelligence Dashboard</h1>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard icon={Car} label="Total Vehicles" value={summary?.totalVehicles} color="var(--accent-primary)" />
        <StatCard icon={KeyRound} label="Active Reservations" value={summary?.activeReservations} color="var(--status-reserved)" />
        <StatCard icon={DollarSign} label="Revenue Today" value={`$${parseFloat(summary?.revenueToday || 0).toFixed(2)}`} color="var(--status-available)" />
        <StatCard icon={FileText} label="Active Contracts" value={summary?.activeContracts} color="var(--status-rented)" />
        <StatCard icon={Wrench} label="In Maintenance" value={summary?.vehiclesMaintenance} color="var(--status-maintenance)" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '16px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header" style={{ fontFamily: 'Exo 2', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Revenue — Last 6 Months
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }} />
              <Bar dataKey="revenue" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Utilisation Donut */}
        <div className="card">
          <div className="card-header" style={{ fontFamily: 'Exo 2', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Fleet Utilisation
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={utilisation} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {utilisation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {utilisation.map(u => (
              <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.color }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{u.name} ({u.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '16px' }}>
        {/* Recent Reservations */}
        <div className="card">
          <div className="card-header" style={{ fontFamily: 'Exo 2', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Active Reservations
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pickup</th>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.slice(0, 5).map(r => (
                <tr key={r.ReservationID} style={{ borderTop: '1px solid var(--bg-border)' }}>
                  <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--text-accent)' }}>RES-{r.ReservationID}</td>
                  <td style={{ padding: '10px 8px', fontSize: '13px' }}>{r.Customer?.Person?.FirstName} {r.Customer?.Person?.LastName}</td>
                  <td style={{ padding: '10px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>{r.PickupDate}</td>
                  <td style={{ padding: '10px 8px' }}><span className={`badge badge-${r.Status?.toLowerCase()}`}>{r.Status}</span></td>
                </tr>
              ))}
              {reservations.length === 0 && <tr><td colSpan="4" style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'center' }}>No reservations</td></tr>}
            </tbody>
          </table>
        </div>

        {/* System Alerts */}
        <div className="card">
          <div className="card-header" style={{ fontFamily: 'Exo 2', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            System Alerts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.length === 0 && <p style={{ color: 'var(--status-available)', fontSize: '13px' }}>✓ All systems normal</p>}
            {alerts.map((alert, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: '8px', borderLeft: `3px solid ${alertColors[alert.type]}` }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
