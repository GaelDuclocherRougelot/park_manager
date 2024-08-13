import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button/Button";
import { useAuth } from "../../contexts/authContext";

type FormData = {
  name: string;
  space_per_floor: number;
  floors: number;
  address: string;
  owner: number;
};

export default function CreateParking() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {

    const res = await fetch("http://localhost:3000/admin/parking/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      navigate("/");
    } else {
      setMessage(result.message);
    }
  };

  return (
    <main className="h-screen w-full flex flex-col md:flex-row items-center justify-center gap-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full lg:w-2/4 px-4 md:px-6 lg:px-14"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label>Parking name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Space per floor */}
        <div className="flex flex-col">
          <label>Parking spot per floor</label>
          <input
            type="number"
            {...register("space_per_floor", { required: "Parking spot per floor is required" })}
          />
          {errors.space_per_floor && (
            <p className="text-red-500">{errors.space_per_floor.message}</p>
          )}
        </div>

        {/* Floors */}
        <div className="flex flex-col">
          <label>Floors</label>
          <input
            type="number"
            {...register("floors", {
              required: "Floors is required"
            })}
          />
          {errors.floors && (
            <p className="text-red-500">{errors.floors.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label>Address</label>
          <input
            type="text"
            {...register("address", {
              required: "Address is required"
            })}
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        <Button type="submit" title="Create parking" classNames="w-full mt-8" />
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
