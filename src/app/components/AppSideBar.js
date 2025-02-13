import {
  BriefcaseMedical,
  Calendar,
  Home,
  Inbox,
  MapPin,
  PawPrint,
  Search,
  Settings,
  Stethoscope,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const items = [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: PawPrint,
  },
  {
    title: "Vétérinaires",
    url: "/centres-veterinaires",
    icon: BriefcaseMedical,
  },
  {
    title: "Ostéopathes",
    url: "/centres-osteopathes",
    icon: Stethoscope,
  },
  {
    title: "Calendrier",
    url: "/calendrier",
    icon: Calendar,
  },
  {
    title: "Carte",
    url: "/map",
    icon: MapPin,
  },
  {
    title: "Configuration",
    url: "/configuration",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Appelle la fonction `logout` du contexte
      router.push("/auth"); // Redirige vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <img
              src="https://static.wixstatic.com/media/d82522_d998c214c72c4b61b21095b20589be9b~mv2.png/v1/crop/x_0,y_208,w_3508,h_1876/fill/w_168,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/IMG_1978_PNG.png"
              alt="Logo O.P.A SUD"
              className="mt-12"
              style={{ width: "70%", alignSelf: "center" }}
            />

          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-12">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full flex justify-start items-center text-left px-4 py-8 hover:bg-gray-800 hover:text-white ${
                      (pathname === "/" && item.url === "/") || // ✅ Activation correcte de l'accueil
                      (pathname !== "/" &&
                        pathname.startsWith(item.url) &&
                        item.url !== "/") // ✅ Activation correcte des autres pages
                        ? "bg-gray-800 border-l-4 border-green-500"
                        : ""
                    }`}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="destructive" onClick={handleLogout}>
          Se déconnecter
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
