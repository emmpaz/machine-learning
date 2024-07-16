import Image from "next/image";
import { getData } from "./data.actions";
import { useCallback, useState } from "react";
import MyMap from "./components/Map";

export default async function Home() {
  const data = await getData();

  let coordinates : [];
  data.map( async (row) => {
    console.log(row.location);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${row.location}&format=jsonv2`);

    // const {lat, lon} = await res.json(); 
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
        <div>
          {data.map((row) => (
            <div key={row.job_id}>{row.job_title}, {row.date_posted}</div>
          ))}
        </div>
        <div className="border w-full">
          <MyMap/>
        </div>
    </main>
  );
}
