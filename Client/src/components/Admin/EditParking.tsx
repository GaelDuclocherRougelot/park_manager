import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Button from "../ui/Button/Button";
import MainLayout from "../Layout/MainLayout";

type FormData = {
  name: string;
  address: string;
};

export default function EditParking() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { parkingId } = useParams<{ parkingId: string }>();

  const onSubmit = async (data: FormData) => {
    const res = await fetch(
      `http://localhost:3000/admin/parking/edit/${parkingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      navigate("/admin/parkings");
    }
  };

  return (
    <MainLayout pageTitle="Edit parking" classNames="flex flex-col md:flex-row">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full lg:w-2/4 md:px-6 lg:px-14 self-center rounded-xl md:border px-6 py-14"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label>Name</label>
          <input type="text" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label>Address</label>
          <input type="text" {...register("address")} />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        <Button type="submit" title="Edit parking" classNames="w-full mt-8" />
      </form>
    </MainLayout>
  );
}
