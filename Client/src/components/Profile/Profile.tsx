import { useEffect, useState } from "react";
import { UserBase } from "../../../types/user";
import { useAuth } from "../../contexts/authContext";

export default function Profile() {
  const { token } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserBase>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setCurrentUser(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="pt-14 md:pt-0 md:pl-64 h-screen w-screen overflow-hidden">
      <div className="shadow-lg px-6 py-6 md:m-4 rounded-2xl md:border h-screen md:h-auto w-full">
        <h1 className="text-indigo-800">Welcome {currentUser?.fullname}</h1>
        
      </div>
    </main>
  );
}
