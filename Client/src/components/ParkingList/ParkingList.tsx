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
    <div className="pl-64">
      <h1>Parkings</h1>
      <ul>
        {parkings.map((parking) => (
          <li key={parking.id} onClick={() => handleClick(parking)}>
            <h2>{parking.name}</h2>
            <p>{parking.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
