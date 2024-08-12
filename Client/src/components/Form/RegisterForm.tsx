

import React from "react";
import Button from "../ui/Button/Button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  user_role: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect (() => {
    if(sessionStorage.getItem("token")) {
      navigate("/");
    }
  
  }, [])

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...formData } = data;

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      navigate('/login');
      setMessage("Registration successful!");
    } else {
      setMessage(result.message);
    }
  };

  const password = watch("password");

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full md:w-4/8 md:px-6 lg:px-14"
      >
        {/* Email */}
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

        {/* First Name */}
        <div className="flex flex-col">
          <label>First Name</label>
          <input
            type="text"
            {...register("firstname", { required: "First name is required" })}
          />
          {errors.firstname && (
            <p className="text-red-500">{errors.firstname.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label>Last Name</label>
          <input
            type="text"
            {...register("lastname", { required: "Last name is required" })}
          />
          {errors.lastname && (
            <p className="text-red-500">{errors.lastname.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* User Role */}
        <div className="flex flex-col">
          <label>User Role</label>
          <select
            {...register("user_role")}
            className="border border-slate-400 rounded-md py-2 px-4"
          >
            <option value="public">Public</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button type="submit" title="Register" classNames="w-full mt-8" />
        {message && <p>{message}</p>}
      </form>

  );
}
