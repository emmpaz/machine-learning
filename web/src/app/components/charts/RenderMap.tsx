'use client'

import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import L, { divIcon, Icon, LatLngExpression } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { useEffect, useRef } from "react";
import 'leaflet.heat';
import { CityGroups } from "@/app/data.actions";

export default function RenderMap({
  cityCoordinates
}: {
  cityCoordinates: CityGroups[]
}) {

  const mapRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      var map = L.map("map").setView([39.8283, -98.5795], 4.5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const maxCount = Math.max(...cityCoordinates.map(city => city.posting_count));

      const scaleFactor = 100 / maxCount;
      const baseIntensity = .3;

      const points = cityCoordinates.flatMap(city => {
        const scaledCount = Math.ceil(city.posting_count * scaleFactor);
        const relativeCount = city.posting_count / maxCount;
        const maxIntensity = baseIntensity + relativeCount * (1 - baseIntensity);

        return Array.from({length : scaledCount}, (_, i) => {
          const randomOffset = () => (Math.random() - .5) * .05;
          const intensity = baseIntensity + (i / scaledCount) * (maxIntensity - baseIntensity);
          return [
            parseFloat(city.latitude) + randomOffset(),
            parseFloat(city.longitude) + randomOffset(),
            intensity
          ]
        })
      });

      console.log(points)

      L.heatLayer(points, {
        radius: 20,
        blur: 30,
        maxZoom: 10,
        max: 1,
        gradient: {0.2: 'blue', 0.4: 'cyan', 0.5: 'lime', 0.6: 'yellow', .8: 'red'}
      }).addTo(map);

      cityCoordinates.forEach(city => {
        L.circleMarker([parseFloat(city.latitude), parseFloat(city.longitude)], {
          radius: 5,
          fillColor: "#000",
          color: "#fff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map).bindPopup(`${city.posting_count} in ${city.city}`);
      })
    }
  }, [cityCoordinates]);

  return <div id="map" ref={mapRef} className="h-full w-5/6"></div>;
}