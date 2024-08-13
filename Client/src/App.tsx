import { Navigate, Route, Routes } from "react-router-dom";
import CreateParking from "./components/Admin/CreateParking";
import LoginForm from "./components/Form/LoginForm";
import RegisterForm from "./components/Form/RegisterForm";
import Menu from "./components/Menu/Menu";
import ParkingList from "./components/ParkingList/ParkingList";
import ParkingOwnerList from "./components/ParkingOwnerList/ParkingOwnerList";
import Profile from "./components/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ProtectedRouteAdmin from "./components/ProtectedRoute/ProtectedRouteAdmin";
import SpaceList from "./components/SpaceList/SpaceList";
import { useAuth } from "./contexts/authContext";
import useDecodeTokenAndSetUserRole from "./hooks/useDecodeToken";

function App() {
  const { isAuthenticated, userRole } = useAuth();
  useDecodeTokenAndSetUserRole(sessionStorage.getItem("token"));

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<ParkingOwnerList />} />
        <Route path="/owner/:ownerId/parkings" element={<ParkingList />} />

        <Route
          path="/owner/:ownerId/parking/:parkingId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SpaceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/parking/create"
          element={
            <ProtectedRouteAdmin
              isAuthenticated={isAuthenticated}
              userRole={userRole}
            >
              <CreateParking />
            </ProtectedRouteAdmin>
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginForm /> : <Navigate to={"/"} replace />
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? <RegisterForm /> : <Navigate to={"/"} replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
