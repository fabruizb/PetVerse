import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardContainer from '../src/components/dashboard/Dashboardcontainer';
import Pets from './pages/Pets';
import Appointments from './pages/Appointments';
import { AuthContext } from './context/AuthContext';
import { children } from 'react';

const ProtectedRoute = ({ children }) => {
  const {user, isLoading} = React.useContext(AuthContext);

  if (isLoading) {
    return <p className="text-center mt-10">Cargando usuario...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/pets" element={<ProtectedRoute><Pets /></ProtectedRoute>} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardContainer /></ProtectedRoute>} 
      />
      <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
