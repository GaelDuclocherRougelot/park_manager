import { useEffect, useState } from "react";
import { ParkingWithId } from "../../../types/parking";
import { useNavigate, useParams } from "react-router-dom";

export default function ParkingList() {
  const [parkings, setParkings] = useState<ParkingWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const naviate = useNavigate();
  const { ownerId } = useParams<{ ownerId: string }>();

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/parkings?owner=${ownerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch parkings");
        }

        const data = await response.json();
        setParkings(data.parkings);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  const handleClick = (parking: ParkingWithId) => {
    return naviate(`/owner/${ownerId}/parking/${parking.id}?floor=0&page=1&pageSize=100`);
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
      <h1 className="text-indigo-800">Parkings</h1>
      <ul className="flex flex-col gap-6 mt-14 overflow-scroll w-full h-[calc(80vh)] border rounded-xl p-6">
        {parkings.map((parking) => (
          <li
            key={parking.id}
            onClick={() => handleClick(parking)}
            className="py-4 px-4 border border-indigo-800 rounded-lg h-fit w-full cursor-pointer"
          >
            <p className="text-2xl text-indigo-900">{parking.name}</p>
            <p className="text-md">{parking.address}</p>
            <p className="text-md">{parking.floors} floors</p>
            <p className="text-md">{parking.space_per_floor * parking.floors} free spots</p>


          </li>
        ))}
      </ul>
    </div>
  </main>
  );
}
