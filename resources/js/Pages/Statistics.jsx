import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatisticsCharts from '@/Pages/Statistics/StatisticsChart'; // Adjust the path if necessary


export default function Dashboard() {
    return (
        <AuthenticatedLayout

        >

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* Add the StatisticsCharts component here */}
                            <StatisticsCharts />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}