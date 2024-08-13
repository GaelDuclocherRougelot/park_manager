import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/Form/LoginForm";
import RegisterForm from "./components/Form/RegisterForm";
import { useAuth } from "./contexts/authContext";
import useDecodeTokenAndSetUserRole from "./hooks/useDecodeToken";
import Menu from "./components/Menu/Menu";

function App() {
  const { isAuthenticated } = useAuth();
  useDecodeTokenAndSetUserRole(sessionStorage.getItem("token"));

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginForm /> : <Navigate to={'/'} replace />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterForm /> : <Navigate to={'/'} replace />} />
      </Routes>
    </>
  );
}

export default App;
