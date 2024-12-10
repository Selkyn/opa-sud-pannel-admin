// src/app/components/Header.js
"use client"; 

import React, { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-green-800 text-gray-200 shadow-lg">
      {/* Logo */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/">
          <img
            src="https://static.wixstatic.com/media/d82522_d998c214c72c4b61b21095b20589be9b~mv2.png/v1/crop/x_0,y_208,w_3508,h_1876/fill/w_168,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/IMG_1978_PNG.png"
            alt="Logo O.P.A SUD"
            className="h-12"
          />
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="block md:hidden text-gray-200 hover:text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Navigation links */}
        <nav
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6`}
        >
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <li>
              <a
                href="/patients"
                className="hover:text-gray-300 text-lg font-medium"
              >
                Patients
              </a>
            </li>
            <li>
              <a
                href="/centres-veterinaires"
                className="hover:text-gray-300 text-lg font-medium"
              >
                Centres vétérinaires
              </a>
            </li>
            <li>
              <a
                href="/centres-osteopathes"
                className="hover:text-gray-300 text-lg font-medium"
              >
                Centres ostéopathes
              </a>
            </li>
            <li>
              <a
                href="/map"
                className="hover:text-gray-300 text-lg font-medium"
              >
                Map
              </a>
            </li>
            <li>
              <a
                href="/calendrier"
                className="hover:text-gray-300 text-lg font-medium"
              >
                Calendrier
              </a>
            </li>
            <li>
              <form action="/logout" method="get">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                  type="submit"
                >
                  Déconnexion
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
