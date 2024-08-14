"use client";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Button from "../ui/Button/Button";
import { useMenu } from "../../contexts/MenuContext";

const links = [
  {
    name: "Home",
    slug: "/",
    role: "",
  },
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
    name: "My parking spots",
    slug: "/my-spots",
    role: "public",
  },
  {
    name: "Create parking",
    slug: "/admin/parking/create",
    role: "admin",
  },
  {
    name: "My parkings",
    slug: "/admin/parkings",
    role: "admin",
  },
];

function Links({
  userRole,
  isAuthenticated,
  path,
}: {
  userRole: string;
  isAuthenticated: boolean;
  path: string;
}) {
  return (
    <>
      {links
        .filter((link) => {
          if (
            isAuthenticated &&
            (link.name === "Register" || link.name === "Login")
          ) {
            return false;
          }
          return link.role === "" || link.role === userRole;
        })
        .map((link) => (
          <a
            key={link.slug}
            href={link.slug}
            className={`py-4 px-4 text-center md:text-left text-slate-800 border-b text-xl hover:border-slate-800 transition-colors duration-200 w-full ${
              path === link.slug ? "border-slate-800 font-semibold" : ""
            }`}
          >
            {link.name}
          </a>
        ))}
    </>
  );
}

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const {setMenuIsOpen, menuIsOpen} = useMenu();

  if (
    location.pathname.includes("login") ||
    location.pathname.includes("register")
  )
    return <></>;
  const { setIsAuthenticated, isAuthenticated, userRole } = useAuth();
  return (
    <>
      <div className="flex items-center justify-end px-4 md:hidden w-screen h-[60px] bg-white fixed top-0 z-20">
        <div className="flex flex-col justify-center gap-[7px] w-[30px] h-[30px]" onClick={() => setMenuIsOpen(!menuIsOpen)}>
          <span className={`transition-transform duration-500 ${menuIsOpen ? "translate-y-[9px]" : ""} h-[2px] bg-black`}></span>
          <span className={`transition-opacity duration-500 ${menuIsOpen ? "opacity-0" : ""} h-[2px] bg-black`}></span>
          <span className={`transition-transform duration-500 ${menuIsOpen ? "-translate-y-[9px]" : ""} h-[2px] bg-black`}></span>
        </div>
      </div>
      <nav className={`h-screen z-10 md:h-[calc(100vh-25px)] flex flex-col justify-between w-full md:w-64 transition-transform duration-500 bg-white fixed left-0 px-4 pt-20 pb-4 md:p-6 shadow-md md:rounded-e-2xl md:border md:my-4 ${menuIsOpen ? "translate-x-0": "-translate-x-full md:translate-x-0"}`}>
        <div className="flex flex-col gap-10 w-full">
          <Links
            userRole={userRole}
            isAuthenticated={isAuthenticated}
            path={location.pathname}
          />
        </div>
        {isAuthenticated && (
          <Button
            title="Disconnect"
            classNames="w-full"
            onClick={() => {
              sessionStorage.removeItem("token");
              setIsAuthenticated(false);
              navigate("/login");
            }}
          />
        )}
      </nav>
    </>
  );
}
