import { useEffect, useState } from "react";
import { UserBase } from "../../../types/user";
import { useNavigate } from "react-router-dom";

export default function ParkingOwnerList() {
  const [owners, setOwners] = useState<UserBase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const naviate = useNavigate();

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch("http://localhost:3000/parking-owners", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch parkings");
        }

        const data = await response.json();
        setOwners(data);
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

  const handleClick = (owner: UserBase) => {
    return naviate(`/owner/${owner.id}/parkings`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pl-64">
      <h1>Parking lot owners</h1>
      <ul>
        {owners.map((owner) => (
          <li key={owner.id} onClick={() => handleClick(owner)}>
            <h2>{owner.fullname}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
