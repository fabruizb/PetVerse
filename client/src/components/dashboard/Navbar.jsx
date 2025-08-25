import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, handleLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white/30 backdrop-blur-md border border-white/20 rounded-b-xl fixed w-full z-50 top-0">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
               
                <Link to="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                        src="/imagenes/Gemini_Generated_Image_xdgunexdgunexdgu.png"
                        className="h-8 rounded-lg"
                        alt="PetVerse Logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        PetVerse
                    </span>
                </Link>

                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button
                        type="button"
                        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        id="user-menu-button"
                        aria-expanded={isDropdownOpen}
                        onClick={toggleDropdown}
                    >
                        <span className="sr-only">Abrir menú de usuario</span>
                        <img
                            className="w-8 h-8 rounded-full"
                            src="https://placehold.co/100x100/3B82F6/ffffff?text=U"
                            alt="foto de usuario"
                        />
                    </button>

                    <div
                        className={`z-50 my-4 text-base list-none bg-white/50 backdrop-blur-md divide-y divide-gray-100 rounded-lg shadow-lg ${
                            isDropdownOpen ? "" : "hidden"
                        } absolute top-12 right-0 md:right-4 border border-white/20`}
                        id="user-dropdown"
                    >
                        <div className="px-4 py-3">
                            <span className="block text-sm text-gray-900">
                                {user?.userName || "Usuario"}
                            </span>
                            <span className="block text-sm text-gray-500 truncate">
                                {user?.email || "email@example.com"}
                            </span>
                        </div>
                        <ul className="py-2">
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/pets"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Mis Mascotas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/appointments"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Citas
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="navbar-user"
                        aria-expanded={isMobileMenuOpen}
                        onClick={toggleMobileMenu}
                    >
                        <span className="sr-only">Abrir menú principal</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? "" : "hidden"}`}
                    id="navbar-user"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                        <li>
                            <Link
                                to="/dashboard"
                                className="block py-2 px-3 text-white rounded-lg md:bg-transparent md:text-blue-500 md:p-0"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/pets"
                                className="block py-2 px-3 text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-500 md:p-0"
                            >
                                Mis Mascotas
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/appointments"
                                className="block py-2 px-3 text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-500 md:p-0"
                            >
                                Citas
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
