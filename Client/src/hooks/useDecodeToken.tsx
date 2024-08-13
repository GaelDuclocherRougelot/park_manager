import { useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAuth } from "../contexts/authContext";

interface MyJwtPayload extends JwtPayload {
  id: number;
  role: string;
}

const useDecodeTokenAndSetUserRole = (token: string | null) => {
  const { setUserRole, setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        setUserRole(decoded.role || "");
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        setUserRole("");
        setIsAuthenticated(false);
      }
    }
  }, [token, setUserRole]);
};

export default useDecodeTokenAndSetUserRole;