"use client";
import { useLocation } from "react-router-dom";
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
    name: "Create parking",
    slug: "/admin/parking/create",
    role: "admin",
  },
];


export default function Menu() {
  const location = useLocation();
  if(location.pathname.includes("login") || location.pathname.includes("register")) return <></>;
  return (
    <nav className="h-screen w-full md:w-64 transition-all duration-200 bg-white absolute left-0 md:p-6">
      <div className="flex flex-col gap-10">
        {/* <Links /> */}
      </div>

        <Button
          title="Disconnect"
          classNames="w-full"
          onClick={() => {

          }}
        />
    
    </nav>
  );
}
