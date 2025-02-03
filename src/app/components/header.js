// src/app/components/Header.js
"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Importation du contexte
import { UserCog } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout(); // Appelle la fonction `logout` du contexte
      router.push("/auth"); // Redirige vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };
  const breadcrumb = pathname.split("/").filter((part) => part);
  const breadcrumbDisplay = breadcrumb
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Met en majuscule la première lettre
    .join(" > ");

  return (
<header className="bg-gray-700 text-gray-200 shadow-lg">
  <div className="px-4 py-4 flex justify-between items-center">
    
    {/* ✅ Bloc aligné complètement à gauche */}
    <div className="flex items-center gap-x-4">
      <SidebarTrigger /> 
      <div className="text-sm text-gray-400">
        <a href="/" className="text-white hover:text-green-300">Accueil</a> 
        {breadcrumb.length > 0 && ` > ${breadcrumbDisplay}`}
      </div>
    </div>

    {/* ✅ Profil utilisateur à droite */}
    <div>
      {user ? (
        <div className="flex items-center space-x-3">
          <UserCog />
          <div>
            <p>{user.pseudo}, {user.role}</p>
          </div>
        </div>
      ) : (
        <p>Utilisateur</p>
      )}
    </div>
  </div>
</header>


  );
}


{/* <button
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
{/* <nav
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
    <div>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  </li>
</ul>
</nav>  */}
