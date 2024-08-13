import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  userRole: string;
  children: React.ReactNode;
}

const ProtectedRouteAdmin: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  userRole,
  children,
}) => {

  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setRedirectPath('/login');
      } else if (isAuthenticated && userRole !== 'admin') {
        setRedirectPath('/');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, userRole]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRouteAdmin;
