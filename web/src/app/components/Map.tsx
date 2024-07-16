'use client'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import RenderMap from '@/app/components/RenderMap';

export default function MyMap(){

    const Map = useMemo(() => dynamic(
        () => import('@/app/components/RenderMap'),
        {
            loading: () => <div className='loading loading-spinner border-none'></div>,
            ssr: false
        }
    ), []);

    return(
        <div className=''>
            <Map></Map>
        </div>
    )
}