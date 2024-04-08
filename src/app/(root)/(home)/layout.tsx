import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import StreamClientProvider from "@/providers/StreamClientProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zoom",
  description: "Video Calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">
            <StreamClientProvider>{children}</StreamClientProvider>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomeLayout;
