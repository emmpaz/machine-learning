'use client'

import { aggregateByCity, CityGroups, JobsForCitiesByDate, aggregateByDate } from "@/app/data.actions";
import { useEffect, useState } from "react";
import { LineChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, Legend } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];



export default function TrendsChart(){

    const [data, setData] = useState<any[]>([]);
    const [cities, setCities] = useState<Set<string>>(new Set());
    useEffect(()=> {
        aggregateByDate().then((res) => {
            setData(res.transformedData);
            setCities(res.cityList);
        });

    }, []);

    
    const CustomToolTip = ({ active, payload, label }: any) => {
        if (!active || !payload || !payload.length) {
            return null;
        }
        return (
            <div className="custom-tooltip">
                <p className="label" style={{ fontSize: '12px', margin: 0, color: '#555' }}>{`Time: ${label}`}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.stroke }}>{`${entry.name}: ${entry.value}`}</p>
                ))}
                {/* <p>{`NYC: ${payload[0].payload["new york city"]}`}</p>
                <p>{`SF: ${payload[0].payload["san francisco"]}`}</p>
                <p>{`Seattle: ${payload[0].payload["seattle"]}`}</p>
                <p>{`SLC: ${payload[0].payload["salt lake city"]}`}</p> */}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date_posted" stroke="#f5f5f5" >
                    <Label value="Time" offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis type="number" domain={[0, 100]} >
                    <Label value="Number of Postings" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                </YAxis>
                <Tooltip content={<CustomToolTip />} />

                {cities && Array.from(cities).map((city, index) => (
                    <Line key={index} type="monotone" dataKey={city} stroke={COLORS[index]} />
                    ))}
                <Legend />
                

            </LineChart>
        </ResponsiveContainer>
    );
}