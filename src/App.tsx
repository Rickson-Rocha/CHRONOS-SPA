
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';


import LoginPage from './pages/Login'; 

import Home from './pages/Home';
import Nav from './components/Nav';

import  PointListPage  from './pages/employee/PointListPage';
import EmployeeListPage from './pages/manager/EmployeeListPage';
import EmployeeDetailsPage from './pages/manager/EmployeeDetailsPage';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Nav />;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
      />
      
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
       
        {user?.role === 'ROLE_MANAGER' && (
          <>
            
            <Route path="/employees" element={<EmployeeListPage />} />
          
            <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
          </>
        )}

         {user?.role === 'ROLE_EMPLOYEE' && (
      
          <Route path="/my-points" element={<PointListPage />} />
        )}
        
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;