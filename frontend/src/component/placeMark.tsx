import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline, 
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { ICars } from "../App";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PlaceMarkProps {
  width: number;
  height: number;
  cars: ICars[];
  selectedCar: ICars | null;
  trace: any[]; 
}

function MapController({ selectedCar, trace }: { selectedCar: ICars | null, trace: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCar && trace.length > 1) {
      const bounds = L.latLngBounds(trace.map(t => [t.lat, t.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (selectedCar) {
      map.setView([selectedCar.lat, selectedCar.lng], 15);
    } else {
      map.setView([41.3111, 69.2797], 12);
    }
  }, [selectedCar, trace, map]);

  return null;
}

export default function PlaceMark({ width, height, cars, selectedCar, trace }: PlaceMarkProps) {
  const displayMarkers = selectedCar ? [selectedCar] : cars;

  return (
    <MapContainer
      center={[41.3111, 69.2797]}
      zoom={12}
      style={{ width: `${width}%`, height: `${height}vh` }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController selectedCar={selectedCar} trace={trace} />

      {trace.length > 1 && (
        <Polyline 
          positions={trace.map(t => [t.lat, t.lng] as [number, number])} 
          pathOptions={{ color: 'blue', weight: 5 }} 
        />
      )}

      {displayMarkers.map((car) => (
        <Marker key={car.id} position={[car.lat, car.lng]}>
          <Popup>
            <div className="min-w-[150px]">
              <h3 className="font-bold text-lg">{car.model_name}</h3>
              <p><b>Raqam:</b> {car.plate_number}</p>
              <p><b>Tezlik:</b> {car.speed} km/soat</p>
              <p><b>Holati:</b> {car.ignition ? "Yoniq" : "O'chik"}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}