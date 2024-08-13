import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  const navigate = useNavigate();
  if (isAuthenticated) {
    return <>{children}</>;
  } 

  navigate('/');
};

export default ProtectedRoute;
