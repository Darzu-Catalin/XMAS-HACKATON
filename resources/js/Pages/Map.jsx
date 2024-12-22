import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FlightPathMap from "@/Components/FlightPathMap";
import GlobeMap from "@/Components/GlobeMap";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    const [points, setPoints] = useState([]);
    const [is3DMap, setIs3DMap] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [mapKey, setMapKey] = useState(0); 
    const [isStyleLoaded, setIsStyleLoaded] = useState(true);

    useEffect(() => {
        axios
            .get("/api/getPath")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    const mappedPoints = response.data
                        .filter((item) => !item.error)
                        .map((item) => ({
                            id: item.id,
                            name: item.details.Name,
                            coords: [
                                parseFloat(item.details.Latitude),
                                parseFloat(item.details.Longitude),
                            ],
                            info: {
                                gift: item.details.Gift_Preference,
                                listened_to_parents: item.details.Listened_To_Parents,
                                good_deed: item.details.Good_Deed,
                                bad_deed: item.details.Bad_Deed != null ? item.details.Bad_Deed : "No bad deeds",
                            },
                        }));
                    setPoints(mappedPoints);
                } else {
                    console.error("Invalid data format:", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching Santa path:", error);
            });
    }, []);

    // Example handler for "Generate Path" button
    const handleGeneratePath = () => {
        alert("Generate Path clicked!");
        // e.g. axios.post("/api/generatePath").then(...).catch(...);
    };

    const handleFullScreenToggle = () => {
        if (isStyleLoaded) {
            setIsStyleLoaded(false);
            setIsFullScreen((prev) => !prev);
            setMapKey((prevKey) => prevKey + 1);
            setTimeout(() => setIsStyleLoaded(true), 500);
        }
    };

    const handleToggleMap = () => {
        if (isStyleLoaded) {
            setIsStyleLoaded(false);
            setIs3DMap((prev) => !prev);
            setMapKey((prevKey) => prevKey + 1);
            setTimeout(() => setIsStyleLoaded(true), 500);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div
                className={`${
                    isFullScreen ? "fixed inset-0 bg-white" : "py-12"
                } overflow-hidden`}
                style={{
                    width: isFullScreen ? "100vw" : "100%",
                    height: isFullScreen ? "100vh" : "100%",
                }}
            >
                <div
                    className={`${
                        isFullScreen
                            ? "w-full h-full relative"
                            : "mx-auto max-w-7xl sm:px-6 lg:px-8"
                    }`}
                >
                    <div
                        className={`${
                            isFullScreen
                                ? "w-full h-full relative"
                                : "bg-white shadow-sm sm:rounded-lg"
                        }`}
                    >
                        <div className="relative w-full h-full p-6 text-gray-900">
                            {/* All buttons in one row */}
                            <div
                                className="relative flex flex-wrap gap-2"
                                style={{
                                    top: 0,
                                    left: "10px",
                                    zIndex: 10,
                                    margin: "16px",
                                }}
                            >
                                {/* Generate Path Button */}
                                <button
                                    onClick={handleGeneratePath}
                                    className={`rounded px-4 py-2 font-bold text-white ${
                                        isStyleLoaded
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    Generate Path
                                </button>

                                {/* Switch to 2D/3D Button */}
                                <button
                                    onClick={handleToggleMap}
                                    disabled={!isStyleLoaded}
                                    className={`rounded px-4 py-2 font-bold text-white ${
                                        isStyleLoaded
                                            ? "bg-blue-500 hover:bg-blue-700"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    {is3DMap ? "Switch to 2D Map" : "Switch to 3D Map"}
                                </button>

                                {/* Full Screen Button */}
                                <button
                                    onClick={handleFullScreenToggle}
                                    disabled={!isStyleLoaded}
                                    className={`rounded px-4 py-2 font-bold text-white ${
                                        isStyleLoaded
                                            ? "bg-green-500 hover:bg-green-700"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    {isFullScreen ? "Exit Full Screen" : "Full Screen"}
                                </button>
                            </div>

                            <div
                                className={`${
                                    isFullScreen ? "w-full h-full" : "h-full w-full mt-8"
                                }`}
                                style={{
                                    margin: "0 auto",
                                    maxWidth: isFullScreen ? "none" : "100%",
                                    position: isFullScreen ? "absolute" : "relative",
                                    left: "0",
                                    top: "0",
                                }}
                            >
                                {is3DMap ? (
                                    <GlobeMap
                                        key={mapKey}
                                        points={points}
                                        isFullScreen={isFullScreen}
                                        onStyleLoad={() => setIsStyleLoaded(true)}
                                    />
                                ) : (
                                    <FlightPathMap
                                        key={mapKey}
                                        points={points}
                                        isFullScreen={isFullScreen}
                                        onStyleLoad={() => setIsStyleLoaded(true)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
