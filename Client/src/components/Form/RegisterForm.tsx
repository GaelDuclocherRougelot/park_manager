import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button/Button";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullname: string;
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
      navigate("/login");
      setMessage("Registration successful!");
    } else {
      setMessage(result.message);
    }
  };

  const password = watch("password");

  return (
    <main className="h-screen w-full flex flex-col md:flex-row items-center justify-center gap-10">
      <div className="flex flex-col justify-center md:bg-gradient-to-r from-slate-800 to-indigo-900 md:text-white w-full md:w-2/4 h-fit md:h-screen ">
        <img src="car.png" alt="" className="w-32 absolute top-10 left-10" />
        <h1 className="px-4 md:px-6 lg:px-14 w-full">Park manager</h1>
        <h2 className="px-4 md:px-6 lg:px-14">
          Welcome on our new parking platform !
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full lg:w-2/4 px-4 md:px-6 lg:px-14"
      >
        <h3>Register</h3>
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

        {/* Fullname */}
        <div className="flex flex-col">
          <label>Fullname</label>
          <input
            type="text"
            {...register("fullname", { required: "Fullname is required" })}
          />
          {errors.fullname && (
            <p className="text-red-500">{errors.fullname.message}</p>
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
        <div className="flex gap-2">
          <p>Don't have an account yet?</p>
          <a href="/login" className="font-medium">
            Login
          </a>
        </div>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
