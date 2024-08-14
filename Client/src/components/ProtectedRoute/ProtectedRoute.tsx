import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
}) => {
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setRedirectPath("/login");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
