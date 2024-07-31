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

      const points = cityCoordinates.map((val) => [val.latitude, val.longitude, val.posting_count * 1000]);

      //const points = [[39.8283, -98.5795, "2000"]]

      L.heatLayer(points, {
        radius: 25,
        blur: 40,
        maxZoom: 10,
        max: maxCount,
        gradient: {0: 'blue', .5: 'yellow', .8: 'red'}
      }).addTo(map);
    }
  }, []);

  return <div id="map" ref={mapRef} className="h-full w-5/6"></div>;
}