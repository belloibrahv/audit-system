import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthenticatedLayout } from './components/layout/AuthenticatedLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuditPlanningForm } from './components/audit/AuditPlanningForm';
import Dashboard from './pages/Dashboard'; // Updated import

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Navigate to="/dashboard" replace />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/planning" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <AuditPlanningForm />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      {/* Add other protected routes here */}
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};