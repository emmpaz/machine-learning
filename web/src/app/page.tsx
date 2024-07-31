import Image from "next/image";
import { aggregateByCity, aggregateByDate, aggregateByTitle, getData } from "./data.actions";
import { useCallback, useState } from "react";
import {DynamicHeatMap, DynamicJobChart, DynamicTrendsChart} from "./components/DynamicRenderingCharts";

export default async function Home() {
  const count = await getData();
  const groups = await aggregateByCity();
  const title = await aggregateByTitle();
  const date = await aggregateByDate();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="p-10">
        <p className="text-8xl">
          {count.count}
          <span className="text-xl"> current jobs</span>
        </p>
      </div>
      <div className="grid grid-cols-2">
        <div className="">
          <div className="pb-4 ">
            <p className="text-5xl border-b-[1px] p-1">by city</p>
          </div>
          <div className="overflow-y-auto mb-10 h-[400px]">
            {groups.map((row, index) => (
              <div key={index} className="p-1">
                <p className="text-2xl">
                  {row.posting_count}
                  <span className="font-light text-base"> jobs in </span>
                  {row.city}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="pb-4">
            <p className="text-5xl border-b-[1px] p-1">by title</p>
          </div>
          <div className="overflow-y-auto mb-10 h-[400px]">
            {title.map((row, index) => (
              <div key={index} className="p-1">
                <p className="text-2xl">
                  {row.posting_count}
                  <span className="font-light text-base"> jobs in </span>
                  {row.job_title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-fit">
        <DynamicJobChart/>
      </div>
      <div className="w-full">
        <DynamicHeatMap cityCoordinates={groups}/>
      </div>
      <div className="w-full h-fit">
        <DynamicTrendsChart/>
      </div>
    </main>
  );
}
