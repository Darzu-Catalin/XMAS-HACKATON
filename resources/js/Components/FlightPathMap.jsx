import React, { useEffect, useMemo } from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet-polylinedecorator";

const FlightPathMap = ({ points, isFullScreen }) => {
    // Determine the initial center of the map from the first point
    const initialCenter = useMemo(() => {
        return points.length > 0 ? points[0].coords : [0, 0]; // default [0, 0]
    }, [points]);

    // Custom green circle marker
    const createCustomMarker = (label) => {
        return L.divIcon({
            className: "custom-marker",
            html: `<div style="
        width: 30px; 
        height: 30px; 
        background-color: #226F54; 
        color: white; 
        border-radius: 50%; 
        display: flex; 
        justify-content: center; 
        align-items: center;
        font-weight: bold;
        font-size: 14px;
      ">${label}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        });
    };

    // Create simplified polyline paths
    const pathCoordinates = useMemo(() => {
        return points.map((point) => point.coords);
    }, [points]);

    // Use Leaflet.markercluster for optimized marker clustering
    const MarkerCluster = ({ points }) => {
        const map = useMap();

        useEffect(() => {
            const markerClusterGroup = L.markerClusterGroup();

            points.forEach((point, index) => {
                const isSpecial = point.isSpecial; // Check if the point is special
                const marker = L.marker(point.coords, {
                    icon: createCustomMarker(isSpecial ? "Carrot" : index + 1),
                }).bindPopup(
                    `<h3>${point.name}</h3><pre>${JSON.stringify(
                        point.info,
                        null,
                        2
                    )}</pre>`
                );
                markerClusterGroup.addLayer(marker);
            });

            map.addLayer(markerClusterGroup);

            return () => {
                map.removeLayer(markerClusterGroup);
            };
        }, [map, points]);

        return null;
    };

    // Add arrows using PolylineDecorator
    const ArrowDecorator = ({ positions }) => {
        const map = useMap();

        useEffect(() => {
            if (positions.length < 2) return;

            const decorator = L.polylineDecorator(positions, {
                patterns: [
                    {
                        offset: "25%",
                        repeat: "50%",
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 15,
                            polygon: false,
                            pathOptions: { stroke: true, color: "#DA2C38" },
                        }),
                    },
                ],
            });

            decorator.addTo(map);

            return () => {
                decorator.remove();
            };
        }, [map, positions]);

        return null;
    };

    return (
        <div
            style={{
                width: isFullScreen ? "100vw" : "100%",
                height: isFullScreen ? "100vh" : "500px",
                position: isFullScreen ? "absolute" : "relative",
                top: 0,
                left: 0,
                // Place map behind buttons
                zIndex: isFullScreen ? 1 : 0,
            }}
        >
            <MapContainer
                center={initialCenter}
                zoom={4}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    // Minimal or no attribution
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // Remove or customize the attribution text
                    attribution=""
                />

                {/* Render clustered markers */}
                <MarkerCluster points={points} />

                {/* Render simplified polyline */}
                {pathCoordinates.length > 1 && (
                    <>
                        <Polyline positions={pathCoordinates} color="#DA2C38" weight={3} />
                        
                    </>
                )}
            </MapContainer>
        </div>
    );
};

export default FlightPathMap;
