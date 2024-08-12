"use client"

import { useEffect, useState } from "react";
import Button from "../ui/Button/Button"
import { useUser } from "@/contexts/UserContext";

export default function Menu() {
  const { setRole } = useUser();

  return (
    <nav className="h-screen w-full md:w-64 transition-all duration-200 bg-white absolute left-0 md:p-6">
      <Button title="Disconnect" classNames="w-full" onClick={() => sessionStorage.clear()}/>
    </nav>
  )
}
