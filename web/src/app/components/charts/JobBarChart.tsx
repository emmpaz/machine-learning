'use client'
import { aggregateByCity, CityGroups } from "@/app/data.actions";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";




const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];


export default function JobBarChart(){

    const [data, setData] = useState<CityGroups[]>([]);
    useEffect(()=> {
        aggregateByCity().then(setData)
    }, []);

    const CustomToolTip = ({active, payload, label} : any) => {
        if(!active || !payload || !payload.length){
            return null;
        }

        return(
            <div className="">
                <p>{`${payload[0].payload.city}`}</p>
                <p>{`Job Count: ${payload[0].value}`}</p>
            </div>
        )
    }

    const maxValue = Math.max(...data.map(item => item.posting_count));

    return(
        <ResponsiveContainer width="100%" height='100%'>
            <BarChart data={data}>
                <YAxis type="number" domain={[0, maxValue]}/>
                <Tooltip content={<CustomToolTip/>}/>
                <Legend/>
                <Bar dataKey="posting_count" fill="#8884d8"/>
            </BarChart>
        </ResponsiveContainer>
    )
}