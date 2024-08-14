import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Space } from "../../../types/parking";
import { useAuth } from "../../contexts/authContext";
import MainLayout from "../Layout/MainLayout";
import Button from "../ui/Button/Button";

export default function SpaceList() {
  const { token } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { parkingId } = useParams<{ parkingId: string }>();
  const floor = searchParams.get("floor") || "0";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const maxFloors = 4; // Valeur constante des étages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/space/${parkingId}?floor=${floor}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch spaces");
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

    fetchSpaces();
  }, [floor, page, pageSize, parkingId, token]);

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
        throw new Error("Failed to assign space");
      }

      setSpaces((prevSpaces) => prevSpaces.filter((s) => s.id !== space.id));
      navigate('/my-spots');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFloorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFloor = event.target.value;
    setSearchParams({
      floor: newFloor,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainLayout pageTitle="Parking spots">
      <section>
        <div>
          <label
            htmlFor="floor-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select Floor:
          </label>
          <select
            id="floor-select"
            value={floor}
            onChange={handleFloorChange}
            className="block w-full py-2 px-4 md:w-fit border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Array.from({ length: maxFloors + 1 }, (_, index) => index).map(
              (f) => (
                <option key={f} value={f}>
                  Floor {f}
                </option>
              )
            )}
          </select>
        </div>
        <ul className="flex flex-col md:flex-row md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 overflow-auto w-full h-[calc(75vh)] border rounded-xl p-6">
          {spaces.map((space) => (
            <li
              key={space.id}
              onClick={() => handleClick(space)}
              className="flex flex-col py-4 px-4 border border-indigo-800 rounded-lg h-fit w-full cursor-pointer"
            >
              <p className="text-2xl text-indigo-900">
                Spot {space.space_number}
              </p>

              <Button
                title="Rent"
                onClick={() => handleClick(space)}
                classNames="w-full"
              />
            </li>
          ))}
        </ul>
      </section>
    </MainLayout>
  );
}
