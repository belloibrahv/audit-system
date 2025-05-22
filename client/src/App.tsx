import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EntitiesList from './pages/Entities/EntitiesList';
import EntityForm from './pages/Entities/EntityForm';
import PlansList from './pages/Plans/PlansList';
import PlanForm from './pages/Plans/PlanForm';
import AuditsList from './pages/Audits/AuditsList';
import AuditForm from './pages/Audits/AuditForm';
import AuditDetails from './pages/Audits/AuditDetails';
import FindingForm from './pages/Findings/FindingForm';
import FindingDetails from './pages/Findings/FindingDetails';
import UserManagement from './pages/Admin/UserManagement';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout><Navigate to="/dashboard" replace /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/audits" element={<MainLayout><AuditsList /></MainLayout>} />
            <Route path="/entities" element={<MainLayout><EntitiesList /></MainLayout>} />
            <Route path="/entities/new" element={<MainLayout><EntityForm /></MainLayout>} />
            <Route path="/entities/:id" element={<MainLayout><EntityForm /></MainLayout>} />
            <Route path="/plans" element={<MainLayout><PlansList /></MainLayout>} />
            <Route path="/plans/new" element={<MainLayout><PlanForm /></MainLayout>} />
            <Route path="/plans/:id" element={<MainLayout><PlanForm /></MainLayout>} />
            <Route path="/audits/new" element={<MainLayout><AuditForm /></MainLayout>} />
            <Route path="/audits/:id" element={<MainLayout><AuditDetails /></MainLayout>} />
            <Route path="/audits/:id/edit" element={<MainLayout><AuditForm /></MainLayout>} />
            <Route path="/audits/:auditId/findings/new" element={<MainLayout><FindingForm /></MainLayout>} />
            <Route path="/findings/:id" element={<MainLayout><FindingDetails /></MainLayout>} />
            <Route path="/findings/:id/edit" element={<MainLayout><FindingForm /></MainLayout>} />
            {/* Admin routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MainLayout>
                    <UserManagement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* Default route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
