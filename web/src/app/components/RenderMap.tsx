'use client'

import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import { divIcon, Icon, LatLngExpression } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

export default function RenderMap(){
    const getColor = (count : number, min : number, max : number) => {
        // Normalize the count between 0 and 1
        const normalized = (count - min) / (max - min)
        
        // Calculate RGB values
        const r = Math.floor(255 * normalized)
        const g = Math.floor(255 * (1 - normalized))
        const b = 0
      
        return `rgb(${r}, ${g}, ${b})`
      }
      
      const createCustomIcon = (jobCount : number, minCount : number, maxCount : number) => {
        const size = 20 // Fixed size for all icons
        const color = getColor(jobCount, minCount, maxCount)
        
        const svg = `
          <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size * 2} ${size * 2}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>
            </defs>
            <circle cx="${size}" cy="${size}" r="${size - 2}" fill="${color}" opacity="0.6" filter="url(#blur)" />
            <circle cx="${1}" cy="${1}" r="${1 / 2}" fill="${color}" />
          </svg>
        `
      
        return divIcon({
          html: renderToStaticMarkup(<div dangerouslySetInnerHTML={{ __html: svg }} />),
          className: '',
          iconSize: [size * 2, size * 2],
          iconAnchor: [size, size],
        })
      }

    const cities = [
        {
            city : [40.7127281, -74.0060152],
            jobCount : 421
        },
        {
            city : [34.0536909,-118.242766],
            jobCount: 123
        },
        {
            city :[40.7596198,-111.886797],
            jobCount: 32
        }
    ]  as {
        city : LatLngExpression,
        jobCount : number
    }[]

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
            {cities.map((city) => (
                <Marker
                position={city.city}
                icon={createCustomIcon(city.jobCount, 500, 0)}

          >
            <Tooltip>{city.jobCount}</Tooltip>
          </Marker>
            ))}
        </MapContainer>
    )
}