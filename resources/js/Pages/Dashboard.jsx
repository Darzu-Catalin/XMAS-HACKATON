import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Factory from '@/Pages/Factory/FactoryComponent';
import Gear from '@/Components/GearAnimation';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    // Step 1: Create a state variable that will serve as the key for the Factory component
    const [factoryKey, setFactoryKey] = useState(Date.now());

    // Step 2: Use useEffect to set up an interval that updates factoryKey every 10 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            // Trigger a new key value
            setFactoryKey(Date.now());
        }, 10000);

        // Clear interval on unmount to avoid memory leaks
        return () => clearInterval(intervalId);
    }, []);

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Gear />
                            {/*
                              Step 3: Pass factoryKey as the `key` prop.
                              Every 10s, the key changes, forcing Factory to unmount and remount.
                            */}
                            <Factory key={factoryKey} />
                            {/* Add the StatisticsCharts component here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
