import React from "react";

import Button from "../ui/Button/Button";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

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
      sessionStorage.setItem('token', result.token);
      setMessage("Login successful!");
      navigate("/");
    } else {
      sessionStorage.clear();
      setMessage(result.message);
    }
  };

  return (
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
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
      {message && <p>{message}</p>}
    </form>
  );
}
