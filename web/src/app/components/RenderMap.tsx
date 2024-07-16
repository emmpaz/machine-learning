'use client'

import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css";

export default function RenderMap(){


    return(
        <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4.5}
            className="w-full min-h-screen"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    )
}