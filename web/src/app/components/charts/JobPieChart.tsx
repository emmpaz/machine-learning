'use client'
import { aggregateByCity, aggregateByTitle, CityGroups, JobTitleGroups } from "@/app/data.actions";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, Cell } from "recharts";




const COLORS = ['#AEC6CF', '#FFB347', '#B39EB5', '#FF6961', '#FDFD96', '#77DD77'];


export default function JobPieChart() {

    const [data, setData] = useState<{ name: string, value: number }[]>([]);
    useEffect(() => {
        aggregateByTitle().then((res) => {
            const transformdata = res.map(item => ({
                name: item.job_title,
                value: parseInt(item.posting_count)
            }))
            setData(transformdata)
        })
    }, []);

    const CustomToolTip = ({ active, payload, label }: any) => {
        if (!active || !payload || !payload.length) {
            return null;
        }
        console.log(payload)
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#0000', padding: '5px', border: '1px solid #ccc' }}>
                <p>{`${payload[0].name}`}</p>
                <p>{`Job Count: ${payload[0].value}`}</p>
            </div>
        )
    }

    return (
        <div className="w-full h-[650px] p-10 mb-10">
            <div className="flex justify-center">
                <h1 className="text-2xl m-auto">job title distribution</h1>
            </div>
            <ResponsiveContainer className="">
                <PieChart>
                    {data && <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={230}
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>}
                    <Tooltip content={<CustomToolTip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}