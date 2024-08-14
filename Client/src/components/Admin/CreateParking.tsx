import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import MainLayout from "../Layout/MainLayout";
import Button from "../ui/Button/Button";

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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      navigate("/admin/parkings");
    } else {
      setMessage(result.message);
    }
  };

  return (
    <MainLayout pageTitle="Create parking" classNames="flex flex-col md:flex-row">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full lg:w-2/4 md:px-6 lg:px-14 self-center rounded-xl md:border px-6 py-14"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label>Parking name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Space per floor */}
        <div className="flex flex-col">
          <label>Parking spot per floor</label>
          <input
            type="number"
            {...register("space_per_floor", {
              required: "Parking spot per floor is required",
            })}
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
              required: "Floors is required",
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
              required: "Address is required",
            })}
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        <Button type="submit" title="Create parking" classNames="w-full mt-8" />
        {message && <p>{message}</p>}
      </form>
    </MainLayout>
  );
}
