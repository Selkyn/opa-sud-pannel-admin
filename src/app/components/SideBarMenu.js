"use client";

import { Home, Users, Settings, LogOut, Hospital, Stethoscope, MapPin, PawPrint } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/apiCall";

const menuItems = [
  { id: 1, name: "Accueil", icon: <Home />, path: "/" },
  { id: 2, name: "Patients", icon: <PawPrint />, path: "/patients" },
  { id: 3, name: "Vétérinaires", icon: <Hospital />, path: "/centres-veterinaires" },
  { id: 4, name: "Ostéopathes", icon: <Stethoscope />, path: "/centres-osteopathes" },
  { id: 4, name: "Calendrier", icon: <Stethoscope />, path: "/calendrier" },
  { id: 5, name: "Carte", icon: <MapPin />, path: "/map" },
  { id: 4, name: "Divers", icon: <Stethoscope />, path: "/calendrier" },
];

export default function SideBarMenu() {
  const pathname = usePathname();
  const router = useRouter();

//   const handleNavigation = async (path) => {
//     try {
//         await api.get("auth/check");
//         router.push(path);
//     } catch (error) {
//         console.error("session expiré")
//         // LogOut();
//         router.push("/auth");
//     }
//   }
const handleNavigation = async (path) => {
    try {
      await api.get("auth/check");
      window.location.href = path; // ✅ Recharge complètement la page
    } catch (error) {
      console.error("session expirée");
      window.location.href = "/auth"; // ✅ Redirige vers /auth si la session a expiré
    }
  };

  return (
    <aside className="w-46 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 shadow-md">
      {/* <div className="p-6 text-xl font-bold border-b border-gray-700">Admin Panel</div> */}
      <img
            src="https://static.wixstatic.com/media/d82522_d998c214c72c4b61b21095b20589be9b~mv2.png/v1/crop/x_0,y_208,w_3508,h_1876/fill/w_168,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/IMG_1978_PNG.png"
            alt="Logo O.P.A SUD"
            className="mt-4"
            style={{width: "60%", alignSelf:"center"}}
          />

      <nav className="flex-1 mt-8 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full flex justify-start items-center text-left px-4 py-8 hover:bg-gray-800 hover:text-white ${
              pathname === item.path ? "bg-gray-800 border-l-4 border-green-500" : ""
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Button>
        ))}
      </nav>

      <Button
        variant="destructive"
        className="m-4"
        onClick={() => console.log("Déconnexion...")}
      >
        <LogOut className="mr-2" />
        Déconnexion
      </Button>
    </aside>
  );
}
