'use client'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CityGroups } from '../data.actions';

export function DynamicJobChart(){

    const DynamicJobChart = useMemo(() => dynamic(
        () => import('@/app/components/charts/JobPieChart'),
        {
            loading: () => <div className='loading loading-spinner border-none'></div>,
            ssr: false
        }
    ), []);

    return(
        <div>
            <DynamicJobChart></DynamicJobChart>
        </div>
    )
}

export function DynamicHeatMap({
    cityCoordinates
} : {
    cityCoordinates : CityGroups[]
}){

    const DynamicHeatMap = useMemo(() => dynamic(
        () => import('@/app/components/charts/RenderMap'),
        {
            loading: () => <div className='loading loading-spinner border-none'></div>,
            ssr: false
        }
    ), []);

    return(
        <div className='flex justify-center h-fit flex-col items-center mb-10'>
            <div className='mb-5'>
                <h1 className='text-2xl'>Heat map</h1>
            </div>
            <DynamicHeatMap cityCoordinates={cityCoordinates}/>
        </div>
    )
}


export function DynamicTrendsChart(){

    const DynamicTrendsChart = useMemo(() => dynamic(
        () => import('@/app/components/charts/TrendsChart'),
        {
            loading: () => <div className='loading loading-spinner border-none'></div>,
            ssr: false
        }
    ), []);

    return(
        <div className='w-full h-[600px]'>
            <DynamicTrendsChart></DynamicTrendsChart>
        </div>
    )
}

export default {DynamicHeatMap, DynamicJobChart, DynamicTrendsChart}