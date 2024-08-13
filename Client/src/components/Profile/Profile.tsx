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

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (currentUser) {
    return (
      <div className="pl-64">
        <h1>Welcome {currentUser.fullname}</h1>
      </div>
    );
  } else {
    return <></>;
  }
}
