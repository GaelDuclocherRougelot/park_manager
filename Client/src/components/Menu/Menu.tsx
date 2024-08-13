"use client";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Button from "../ui/Button/Button";

const links = [
  {
    name: "Register",
    slug: "/register",
    role: "",
  },
  {
    name: "Login",
    slug: "/login",
    role: "",
  },
  {
    name: "Profile",
    slug: "/profile",
    role: "public",
  },
  {
    name: "Profile",
    slug: "/profile",
    role: "admin",
  },
  {
    name: "Create parking",
    slug: "/admin/parking/create",
    role: "admin",
  },
];

function Links({userRole, isAuthenticated}: {userRole: string, isAuthenticated: boolean}) {

  return (
    <>
      {links
        .filter((link) => {
          if (isAuthenticated && (link.name === "Register" || link.name === "Login")) {
            return false;
          }
          return link.role === "" || link.role === userRole;
        })
        .map((link) => (
          <a key={link.slug} href={link.slug} className="block p-2 hover:underline">
            {link.name}
          </a>
        ))}
    </>
  );
}


export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  if (
    location.pathname.includes("login") ||
    location.pathname.includes("register")
  )
    return <></>;
  const { setIsAuthenticated, isAuthenticated, userRole } = useAuth();
  return (
    <nav className="h-screen flex flex-col justify-between w-full md:w-64 transition-all duration-200 bg-white fixed left-0 md:p-6 shadow-md rounded-e-2xl">
      <div className="flex flex-col gap-10"><Links userRole={userRole} isAuthenticated={isAuthenticated}/></div>
      {isAuthenticated && (
        <Button
          title="Disconnect"
          classNames="w-full"
          onClick={() => {
            sessionStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate('/login');
          }}
        />
      )}
    </nav>
  );
}
