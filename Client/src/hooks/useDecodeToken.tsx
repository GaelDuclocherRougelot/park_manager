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
        const decodedToken = jwtDecode<MyJwtPayload>(token);
        const currentDate = new Date();

        if (
          decodedToken.exp !== undefined &&
          decodedToken.exp * 1000 < currentDate.getTime()
        ) {
          sessionStorage.removeItem('token');
          setUserRole("");
          setIsAuthenticated(false);
          setToken(null);
        } else {
          setToken(token);
          setUserRole(decodedToken.role || "");
          setIsAuthenticated(true);
        }
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
