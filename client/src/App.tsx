import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Entity routes */}
            <Route
              path="/entities"
              element={
                <ProtectedRoute>
                  <EntitiesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities/new"
              element={
                <ProtectedRoute>
                  <EntityForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities/:id"
              element={
                <ProtectedRoute>
                  <EntityForm />
                </ProtectedRoute>
              }
            />
            
            {/* Plan routes */}
            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <PlansList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans/new"
              element={
                <ProtectedRoute>
                  <PlanForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans/:id"
              element={
                <ProtectedRoute>
                  <PlanForm />
                </ProtectedRoute>
              }
            />
            
            {/* Audit routes */}
            <Route
              path="/audits"
              element={
                <ProtectedRoute>
                  <AuditsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audits/new"
              element={
                <ProtectedRoute>
                  <AuditForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audits/:id"
              element={
                <ProtectedRoute>
                  <AuditDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audits/:id/edit"
              element={
                <ProtectedRoute>
                  <AuditForm />
                </ProtectedRoute>
              }
            />
            
            {/* Finding routes */}
            <Route
              path="/audits/:auditId/findings/new"
              element={
                <ProtectedRoute>
                  <FindingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/findings/:id"
              element={
                <ProtectedRoute>
                  <FindingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/findings/:id/edit"
              element={
                <ProtectedRoute>
                  <FindingForm />
                </ProtectedRoute>
              }
            />
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
