import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zoom",
  description: "Video Calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>;
};

export default RootLayout;
