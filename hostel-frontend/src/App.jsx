import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PublicHome from './pages/PublicHome';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import MyIssues from './pages/MyIssues';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import './App.css'

import { IssueProvider } from './context/IssueContext';

function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<PublicHome />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="student-dashboard" element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin-dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="my-issues" element={
                <ProtectedRoute>
                  <MyIssues />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </IssueProvider>
    </AuthProvider>
  );
}

export default App;
