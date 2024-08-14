import { useEffect, useState } from "react";
import { Space } from "../../../types/parking";
import { useAuth } from "../../contexts/authContext";
import MainLayout from "../Layout/MainLayout";
import Button from "../ui/Button/Button";

export default function UserParkingSpaces() {
  const { token } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch(`http://localhost:3000/space/find`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setSpaces(data);
        console.log(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [token]);

  const handleClick = async (space: Space) => {
    try {
      const response = await fetch(
        `http://localhost:3000/space/unassign/${space.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unassign space");
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
    <MainLayout pageTitle="My parking spots">
      <ul className="flex flex-col md:flex-row md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 overflow-auto w-full h-[calc(75vh)] border rounded-xl p-6">
        {spaces.length > 0 ? (
          spaces.map((space) => (
            <li
              key={space.id}
              className="flex flex-col py-4 px-4 border border-indigo-800 rounded-lg h-fit w-full cursor-pointer"
            >
              <p className="text-2xl text-indigo-900">
                Spot {space.space_number}
              </p>
              <Button
                title="Leave the spot"
                onClick={() => handleClick(space)}
                classNames="w-full"
              />
            </li>
          ))
        ) : (
          <div>
            <h2 className="w-full col-span-4">You dont have rent a parking spot yet...</h2>
            <p>Click  <a href="/" className="text-indigo-700">here</a> to search a parking spot!</p>
          </div>
        )}
      </ul>
    </MainLayout>
  );
}
