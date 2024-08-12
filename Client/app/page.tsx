"use server";

import Menu from "@/components/Menu/Menu";
import { ParkingWithId } from "@/types/parking";

async function getData() {
  const res = await fetch("http://localhost:3000/parkings?page=1");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <>
      <Menu />
      <main className="md:ml-64">
        <div>
          <h1>Park Manager</h1>
          <ul>
            {data.parkings.map((item: ParkingWithId) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
