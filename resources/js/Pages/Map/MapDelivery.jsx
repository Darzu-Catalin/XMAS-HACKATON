import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FlightPathMap = ({ points }) => {
    // Points format example:
    // points = [
    //   { id: 1, name: "Point 1", coords: [47.0105, 28.8638], info: { country: "Moldova", city: "Chisinau" } },
    //   { id: 2, name: "Point 2", coords: [48.8566, 2.3522], info: { country: "France", city: "Paris" } },
    //   { id: 3, name: "Point 3", coords: [51.5074, -0.1278], info: { country: "UK", city: "London" } },
    // ];

    const polylinePoints = points.map(point => point.coords);

    return (
        <MapContainer center={[47.0105, 28.8638]} zoom={4} style={{ height: "500px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {points.map(point => (
                <Marker key={point.id} position={point.coords}>
                    <Popup>
                        <h3>{point.name}</h3>
                        <pre>{JSON.stringify(point.info, null, 2)}</pre>
                    </Popup>
                </Marker>
            ))}

            <Polyline positions={polylinePoints} color="blue" />
        </MapContainer>
    );
};

export default FlightPathMap;
