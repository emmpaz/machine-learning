'use client'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CityGroups } from '../data.actions';

export default function MyMap(){

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