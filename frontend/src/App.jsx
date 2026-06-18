import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import InstitutionDashboard from './pages/InstitutionDashboard';
import VerifierDashboard from './pages/VerifierDashboard';
import IssueCertificate from './pages/IssueCertificate';
import MyCertificates from './pages/MyCertificates';
import VerifyPage from './pages/VerifyPage';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'institution') return <Navigate to="/institution/dashboard" replace />;
  if (user.role === 'employer') return <Navigate to="/verifier/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:certId" element={<VerifyPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Shared layout routes */}
          <Route element={<Layout />}>
            {/* Student routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/student/certificates" element={
              <ProtectedRoute roles={['student']}><MyCertificates /></ProtectedRoute>
            } />
            <Route path="/student/verify" element={
              <ProtectedRoute roles={['student']}><VerifyPage embedded /></ProtectedRoute>
            } />

            {/* Institution routes */}
            <Route path="/institution/dashboard" element={
              <ProtectedRoute roles={['institution']}><InstitutionDashboard /></ProtectedRoute>
            } />
            <Route path="/institution/issue" element={
              <ProtectedRoute roles={['institution']}><IssueCertificate /></ProtectedRoute>
            } />
            <Route path="/institution/certificates" element={
              <ProtectedRoute roles={['institution']}><MyCertificates /></ProtectedRoute>
            } />

            {/* Verifier / Employer routes */}
            <Route path="/verifier/dashboard" element={
              <ProtectedRoute roles={['employer']}><VerifierDashboard /></ProtectedRoute>
            } />
            <Route path="/verifier/verify" element={
              <ProtectedRoute roles={['employer']}><VerifyPage embedded /></ProtectedRoute>
            } />

            {/* Legacy fallback */}
            <Route path="/issue" element={
              <ProtectedRoute roles={['institution']}><IssueCertificate /></ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute><MyCertificates /></ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
