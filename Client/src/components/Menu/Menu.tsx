"use client";

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



// function Links() {

//   return links.map((link) => {
//       if(link.role === "admin" && link.role === role) {
//         return (<a href={link.slug}>{link.name}</a>)
//       }
//       if(link.role === "public" && link.role === role) {
//         return (<a href={link.slug}>{link.name}</a>)
//       }
//       if(link.role === "" && link.role === role) {
//         return (<a href={link.slug}>{link.name}</a>)
//       }
//   })
// }


export default function Menu() {

  return (
    <nav className="h-screen w-full md:w-64 transition-all duration-200 bg-white absolute left-0 md:p-6">
      <div className="flex flex-col gap-10">
        {/* <Links /> */}
      </div>

        {/* <Button
          title="Disconnect"
          classNames="w-full"
          onClick={() => {

          }}
        /> */}
    
    </nav>
  );
}
