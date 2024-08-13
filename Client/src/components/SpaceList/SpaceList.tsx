import { useEffect, useState } from "react";
import { Space } from "../../../types/parking";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Button from "../ui/Button/Button";

export default function SpaceList() {
  const { token } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  // const naviate = useNavigate();
  const { parkingId } = useParams<{ floor: string; parkingId: string }>();
  const floor = searchParams.get("floor") || "0";
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "200";


  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/space/${parkingId}?floor=${floor}&page=${page}&pageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch parkings");
        }

        const data = await response.json();

        setSpaces(data.spaces);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, [floor, page, pageSize, parkingId]);

  const handleClick = async (space: Space) => {
      try {
        const response = await fetch(
          `http://localhost:3000/space/assign/${space.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch parkings");
        }

        setSpaces((prevSpaces) => prevSpaces.filter((s) => s.id !== space.id));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="ml-64 px-14">
      <h1>Parking spots</h1>
      <h2>Floor: {floor}</h2>
      <ul className="flex flex-col gap-10">
        {spaces.map((space) => (
          <li key={space.id} className="flex gap-10 border border-indigo-800 rounded-2xl py-4 px-4">
            <h2>Spot {space.space_number}</h2>
            <Button title="Rent" onClick={() => handleClick(space)}/>
          </li>
        ))}
      </ul>
    </div>
  );
}
