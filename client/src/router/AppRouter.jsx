import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import VehicleList from '../pages/vehicles/VehicleList';
import CustomerList from '../pages/customers/CustomerList';
import ReservationList from '../pages/reservations/ReservationList';
import ContractList from '../pages/contracts/ContractList';
import PaymentList from '../pages/payments/PaymentList';
import DamageList from '../pages/damage/DamageList';
import MaintenanceList from '../pages/maintenance/MaintenanceList';
import InsuranceList from '../pages/insurance/InsuranceList';
import BranchList from '../pages/branches/BranchList';

function WithLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<WithLayout><Dashboard /></WithLayout>} />
      <Route path="/vehicles" element={<WithLayout><VehicleList /></WithLayout>} />
      <Route path="/customers" element={<WithLayout><CustomerList /></WithLayout>} />
      <Route path="/reservations" element={<WithLayout><ReservationList /></WithLayout>} />
      <Route path="/contracts" element={<WithLayout><ContractList /></WithLayout>} />
      <Route path="/payments" element={<WithLayout><PaymentList /></WithLayout>} />
      <Route path="/damage" element={<WithLayout><DamageList /></WithLayout>} />
      <Route path="/maintenance" element={<WithLayout><MaintenanceList /></WithLayout>} />
      <Route path="/insurance" element={<WithLayout><InsuranceList /></WithLayout>} />
      <Route path="/branches" element={<WithLayout><BranchList /></WithLayout>} />
    </Routes>
  );
}
