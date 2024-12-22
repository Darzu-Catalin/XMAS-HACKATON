import React, { useState, useEffect, useCallback, useRef } from "react";
import Map, { Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const ACCESS_TOKEN =
    "pk.eyJ1IjoiY3Jpc3RpYnVsYXQiLCJhIjoiY20xNWFvMngyMDdkbjJrcjRycGN3ejZpeCJ9.78KPoy6t5vaqVVhTXmG8sQ";

const GlobeMap = ({ points, isFullScreen }) => {
    const [viewState, setViewState] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 1.5,
        pitch: 45,
        bearing: 0,
    });

    const [styleLoaded, setStyleLoaded] = useState(false); // Track if style is loaded
    const mapRef = useRef(null);

    const onStyleLoad = useCallback(() => {
        setStyleLoaded(true); // Mark style as loaded
    }, []);

    const onClick = useCallback((event) => {
        const { features, point, lngLat } = event;
        if (!features || !features.length) return;

        const clusterFeature = features[0];
        if (clusterFeature.properties?.cluster) {
            const mapboxSource = mapRef.current.getMap().getSource("points");
            mapboxSource.getClusterExpansionZoom(
                clusterFeature.properties.cluster_id,
                (err, zoom) => {
                    if (err) {
                        return;
                    }
                    setViewState((prev) => ({
                        ...prev,
                        longitude: lngLat.lng,
                        latitude: lngLat.lat,
                        zoom: zoom,
                    }));
                }
            );
        }
    }, []);

    const pointsGeoJSON = {
        type: "FeatureCollection",
        features: points.map((p) => ({
            type: "Feature",
            properties: {
                id: p.id,
                name: p.name,
                info: p.info,
            },
            geometry: {
                type: "Point",
                coordinates: [p.coords[1], p.coords[0]],
            },
        })),
    };

    const flightLine = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: points.map((p) => [p.coords[1], p.coords[0]]),
        },
    };

    useEffect(() => {
        if (points.length > 0) {
            setViewState((prev) => ({
                ...prev,
                longitude: points[0].coords[1],
                latitude: points[0].coords[0],
            }));
        }
    }, [points]);

    return (
        <div className="relative w-full h-full">
            <Map
                {...viewState}
                ref={mapRef}
                style={{
                    width: isFullScreen ? "100vw" : "100%",
                    height: isFullScreen ? "100vh" : "500px",
                    position: isFullScreen ? "absolute" : "relative",
                }}
                onMove={(evt) => setViewState(evt.viewState)}
                mapboxAccessToken={ACCESS_TOKEN}
                mapStyle="mapbox://styles/mapbox/standard-satellite"
                attributionControl={false}
                projection="globe"
                onLoad={onStyleLoad} // Listen for the style to load
                onClick={onClick}
            >
                {styleLoaded && (
                    <>
                        <Source id="flight-path" type="geojson" data={flightLine}>
                            <Layer
                                id="flight-path-layer"
                                type="line"
                                paint={{
                                    "line-color": "#DA2C38",
                                    "line-width": 3,
                                }}
                            />
                        </Source>

                        <Source
                            id="points"
                            type="geojson"
                            data={pointsGeoJSON}
                            cluster={true}
                            clusterMaxZoom={14}
                            clusterRadius={50}
                        >
                            <Layer
                                id="clusters"
                                type="circle"
                                filter={["has", "point_count"]}
                                paint={{
                                    "circle-color": "#11b4da",
                                    "circle-radius": 18,
                                    "circle-stroke-width": 2,
                                    "circle-stroke-color": "#fff",
                                }}
                            />
                            <Layer
                                id="cluster-count"
                                type="symbol"
                                filter={["has", "point_count"]}
                                layout={{
                                    "text-field": "{point_count_abbreviated}",
                                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                                    "text-size": 12,
                                }}
                                paint={{
                                    "text-color": "#ffffff",
                                }}
                            />
                            <Layer
                                id="unclustered-point"
                                type="circle"
                                filter={["!", ["has", "point_count"]]}
                                paint={{
                                    "circle-color": "#ff0000",
                                    "circle-radius": 5,
                                    "circle-stroke-width": 2,
                                    "circle-stroke-color": "#fff",
                                }}
                            />
                        </Source>
                    </>
                )}
            </Map>
        </div>
    );
};

export default GlobeMap;
