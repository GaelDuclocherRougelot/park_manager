import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Button from "../ui/Button/Button";

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
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      setIsAuthenticated(true);
      setMessage("Login successful!");
      navigate("/");
    } else {
      sessionStorage.clear();
      setIsAuthenticated(false);
      setMessage(result.message);
    }
  };

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
        <h3>Login</h3>
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
        <div className="flex gap-2">
          <p>Don't have an account yet?</p>
          <a href="/register" className="font-medium">Register</a>
        </div>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
