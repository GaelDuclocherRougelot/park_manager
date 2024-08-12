"use client";

import Button from "@/components/ui/Button/Button";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { setRole } = useUser();
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect (() => {
    if(sessionStorage.getItem("token")) {
      router.push("/");
    }
  
  }, [])
  

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
  
    if (res.ok) {
      sessionStorage.setItem("token", result.token);
      setRole(result.user_role);
      setMessage("Login successful!");
      router.push("/");
    } else {
      setMessage(result.message);
    }
  };

  return (
    <main className="h-screen flex flex-col md:flex-row gap-10 items-center justify-center w-full px-4 md:px-0">
      <div className="flex flex-col md:w-[70%] md:px-6 lg:px-14 md:bg-slate-800 md:h-full justify-center text-slate-800 md:text-white">
        <h1>Login</h1>
        <h2>Welcome back! Please login to continue.</h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full md:w-4/8 md:px-6 lg:px-14"
      >
        <div className="flex flex-col">
          <label>Email</label>
          <input
            type="text"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" title="Login" classNames="w-full mt-8" />
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}

