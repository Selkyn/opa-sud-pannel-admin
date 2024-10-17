// src/app/components/Header.js

import React from 'react';

export default function Header() {
  return (
    <div>
      <div className="container mx-auto px-4 mt-4 mb-4">
        <img 
          src='https://static.wixstatic.com/media/d82522_d998c214c72c4b61b21095b20589be9b~mv2.png/v1/crop/x_0,y_208,w_3508,h_1876/fill/w_168,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/IMG_1978_PNG.png'
          alt="Logo O.P.A SUD"
          className="mx-auto"
          />
      </div>

      <nav className="bg-green-900 p-4 text-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          <a className="text-xl font-semibold" href="/">Accueil</a>
          {/* <button
            className="md:hidden text-gray-700"
            type="button"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            // Tailwind n'a pas de collapse nativement, cela pourrait nécessiter un plugin JS pour gérer le menu mobile
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button> */}

          <div className="hidden md:flex space-x-4" id="navbarNav">
            <ul className="flex space-x-4">
              <li className="nav-item">
                <a className="text-gray-200 hover:text-gray-300" href="/patients">Patients</a>
              </li>
              <li className="nav-item">
                <a className="text-gray-200 hover:text-gray-300" href="/professionnels">Professionels</a>
              </li>
              <li className="nav-item">
                <a className="text-gray-200 hover:text-gray-300" href="/map">Map</a>
              </li>
              {/* <li className="nav-item">
                <p className="text-gray-200">Bienvenue ! Pseudo</p>
              </li> */}
              <li className="nav-item">
                <form action="/logout" method="get">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">Déconnexion</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}