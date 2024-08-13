import { jwtDecode, JwtPayload } from "jwt-decode";
import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";

interface MyJwtPayload extends JwtPayload {
  id: number;
  role: string;
}

const useDecodeTokenAndSetUserRole = (token: string | null) => {
  const { setUserRole, setIsAuthenticated, setToken } = useAuth();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        setUserRole(decoded.role || "");
        setIsAuthenticated(true);
        setToken(token);
      } catch (error) {
        console.error("Invalid token:", error);
        setUserRole("");
        setIsAuthenticated(false);
        setToken(null);
      }
    }
  }, [token, setUserRole]);
};

export default useDecodeTokenAndSetUserRole;
