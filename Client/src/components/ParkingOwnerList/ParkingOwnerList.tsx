import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserBase } from "../../../types/user";

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
    <main className="pt-14 md:pt-0 md:pl-64 h-screen w-screen overflow-hidden">
      <div className="shadow-lg px-6 py-6 md:m-4 rounded-2xl md:border h-screen md:h-auto w-full">
        <h1 className="text-indigo-800">Parking owners</h1>
        <ul className="flex flex-col gap-6 mt-14 overflow-scroll w-full h-[calc(80vh)] border rounded-xl p-6">
          {owners.map((owner) => (
            <li
              key={owner.id}
              onClick={() => handleClick(owner)}
              className="py-4 px-4 border border-indigo-800 rounded-lg h-fit w-full cursor-pointer"
            >
              <p className="text-2xl text-indigo-900">{owner.fullname}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
