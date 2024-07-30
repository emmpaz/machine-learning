'use client'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CityGroups } from '../data.actions';

export function DynamicJobChart(){

    const DynamicJobChart = useMemo(() => dynamic(
        () => import('@/app/components/charts/JobBarChart'),
        {
            loading: () => <div className='loading loading-spinner border-none'></div>,
            ssr: false
        }
    ), []);

    return(
        <div className='w-full h-[600px]'>
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
        <div className='flex justify-center'>
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