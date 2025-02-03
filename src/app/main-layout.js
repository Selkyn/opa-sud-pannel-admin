import Header from "./components/header";
import Footer from "./components/footer";
import SideBarMenu from "./components/SideBarMenu"

export default function MainLayout({ children }) {
  return (
    <div>
      {/* <Header /> */}
      <SideBarMenu/>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
