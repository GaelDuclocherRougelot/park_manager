import { Navigate, Route, Routes } from "react-router-dom";
import CreateParking from "./components/Admin/CreateParking";
import EditParking from "./components/Admin/EditParking";
import MyParkings from "./components/Admin/MyParkings";
import LoginForm from "./components/Form/LoginForm";
import RegisterForm from "./components/Form/RegisterForm";
import Menu from "./components/Menu/Menu";
import ParkingList from "./components/ParkingList/ParkingList";
import ParkingOwnerList from "./components/ParkingOwnerList/ParkingOwnerList";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ProtectedRouteAdmin from "./components/ProtectedRoute/ProtectedRouteAdmin";
import SpaceList from "./components/SpaceList/SpaceList";
import UserParkingSpaces from "./components/UserParkingSpaces/UserParkingSpaces";
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
          path="/my-spots"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserParkingSpaces />
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
          path="/admin/parking/:parkingId/edit"
          element={
            <ProtectedRouteAdmin
              isAuthenticated={isAuthenticated}
              userRole={userRole}
            >
              <EditParking />
            </ProtectedRouteAdmin>
          }
        />

        <Route
          path="/admin/parkings"
          element={
            <ProtectedRouteAdmin
              isAuthenticated={isAuthenticated}
              userRole={userRole}
            >
              <MyParkings />
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
