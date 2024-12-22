import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-[#DC3845] text-2xl">
            
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-10 sm:px-16 lg:px-20">
                    <div className="flex h-28 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <img
                                        src="https://t3.ftcdn.net/jpg/06/69/36/86/360_F_669368662_WwRczEQCeaPOh7xRB4wAwRVfrtFKVwDU.jpg"
                                        alt="Application Logo"
                                        className="block h-28 w-auto"
                                    />
                                </Link>
                            </div>

                            <div className="hidden space-x-16 sm:-my-px sm:ms-16 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="!text-2xl !font-bold"
                                >
                                    FACTORY
                                </NavLink>
                                <NavLink
                                    href={route('statistics')}
                                    active={route().current('statistics')}
                                    className="!text-2xl !font-bold"
                                >
                                    STATISTICS
                                </NavLink>
                                <NavLink
                                    href={route('children')}
                                    active={route().current('children')}
                                    className="!text-2xl !font-bold"
                                >
                                    CHILDREN
                                </NavLink>
                                <NavLink
                                    href={route('map')}
                                    active={route().current('map')}
                                    className="!text-2xl !font-bold"
                                >
                                    MAP
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-10 sm:flex sm:items-center">
                            <div className="relative ms-6">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-6 py-4 text-2xl font-bold leading-5 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-1 ms-3 h-8 w-8"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="text-2xl"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="text-2xl"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-3 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-4 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-10 w-10"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={ 
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-3 pb-6 pt-4">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="text-2xl font-semibold hover:underline"
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-4 pt-6">
                        <div className="px-8">
                            <div className="text-2xl font-bold text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-lg font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                className="text-2xl font-semibold hover:underline"
                            >
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="text-2xl font-semibold hover:underline"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>
            
            
            
                
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-10 py-10 sm:px-16 lg:px-20 text-3xl font-bold">
                        {header}
                    </div>
                </header>
            )}

            <main className="px-10 sm:px-16 lg:px-20 py-8">{children}</main>
        </div>
    );
}
