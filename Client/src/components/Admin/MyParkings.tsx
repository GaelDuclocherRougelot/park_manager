import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ParkingWithId } from "../../../types/parking";
import { useAuth } from "../../contexts/authContext";
import Button from "../ui/Button/Button";

export default function MyParkings() {
  const { token } = useAuth();
  const [parkings, setParkings] = useState<ParkingWithId[]>([]);
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
    navigate(
      `/admin/parking/${parking.id}/edit`
    );
  };
  const handleDeleteClick = (parking: ParkingWithId) => {
    const deleteParking = async () => {
      try {
        const response = await fetch(`http://localhost:3000/admin/parkings/delete/${parking.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch delete parking");
        }
        setParkings((prevSpaces) => prevSpaces.filter((s) => s.id !== parking.id));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if(confirm(`Delete ${parking.name} parking ?`) && token) {
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
    <main className="pt-14 md:pt-0 md:pl-64 h-screen w-screen overflow-hidden">
      <div className="shadow-lg px-6 py-6 md:m-4 rounded-2xl md:border h-screen md:h-auto w-full">
        <h1 className="text-indigo-800">My parkings</h1>
        <ul className="flex flex-col gap-6 mt-14 overflow-auto w-full h-[calc(80vh)] border rounded-xl p-6">
          {parkings.map((parking) => (
            <li
              key={parking.id}
              className="flex justify-between items-center py-4 px-4 border border-indigo-800 rounded-lg h-fit w-full"
            >
              <div className="flex flex-col">
                <p className="text-2xl text-indigo-900">{parking.name}</p>
                <p className="text-md">{parking.address}</p>
                <p className="text-md">{parking.floors} floors</p>
                <p className="text-md">
                  {parking.space_per_floor * parking.floors} free spots
                </p>
              </div>
              <div className="flex gap-4">
                <Button title="Edit" onClick={() => handleEditClick(parking)}/>
                <Button title="Delete" classNames="md:hover:bg-orange-700" onClick={() => handleDeleteClick(parking)}/>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
