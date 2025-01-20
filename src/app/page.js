import Image from "next/image";
import MainLayout from "../app/components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mt-72">
        <p>O.P.A SUD Pannel Admin</p>
      {/* <img 
      src="https://static.wixstatic.com/media/d82522_382d4140bd0b4728ba2e3d350b37f0ac~mv2.jpg/v1/fill/w_952,h_458,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/d82522_382d4140bd0b4728ba2e3d350b37f0ac~mv2.jpg"
      className="mt-6"
      /> */}
      </div>
    </div>
    </MainLayout>
  );
}
