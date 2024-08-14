import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ParkingWithId, ParkingWithOccupation } from "../../../types/parking";
import { useAuth } from "../../contexts/authContext";
import MainLayout from "../Layout/MainLayout";
import ConfirmModal from "../Modal/ConfirmModal";
import Button from "../ui/Button/Button";

export default function MyParkings() {
  const { token } = useAuth();
  const [parkings, setParkings] = useState<ParkingWithOccupation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/admin/parkings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch parkings");
        }

        const data = await response.json();

        setParkings(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchParkings();
  }, [token]);

  const handleEditClick = (parking: ParkingWithId) => {
    navigate(`/admin/parking/${parking.id}/edit`);
  };
  const handleDeleteClick = (parking: ParkingWithId) => {
    const deleteParking = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/admin/parkings/delete/${parking.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch delete parking");
        }
        setParkings((prevSpaces) =>
          prevSpaces.filter((s) => s.id !== parking.id)
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      return deleteParking();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainLayout pageTitle="My parkings">
      <ul className="flex flex-col md:flex-row md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-14 overflow-auto w-full h-[calc(80vh)] border rounded-xl p-6">
        {parkings.map((parking) => (
          <li
            key={parking.id}
            className="flex flex-col md:flex-row gap-6 justify-between items-center py-4 px-4 border border-indigo-800 rounded-lg h-fit w-full"
          >
            <div className="flex flex-col w-full md:w-auto">
              <p className="text-2xl text-indigo-900">{parking.name}</p>
              <p className="text-md">{parking.address}</p>
              <p className="text-md">{parking.floors} floors</p>
              <p className="text-md">{parking.free_spaces} free spots</p>
              <p className="text-md">
                {parking.reserved_spaces} reserved spots
              </p>

              <p>
                Occupancy rate:{" "}
                {Number(Math.floor(parking.occupation_rate)).toFixed(2)}%
              </p>
            </div>
            <div className="flex md:flex-col gap-4">
              <Button
                title="Edit"
                onClick={() => handleEditClick(parking)}
                classNames="w-full"
              />
              <Button
                title="Delete"
                classNames="md:hover:bg-orange-700"
                onClick={() => setIsModalOpen(true)}
              />
              {isModalOpen && (
                <ConfirmModal
                  title={`You are about to delete ${parking.name} parking :`}
                  setIsModalOpen={setIsModalOpen}
                  handleClick={() => handleDeleteClick(parking)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </MainLayout>
  );
}
