import Image from "next/image";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="fixed z-50 flex w-full justify-between bg-dark-1 px-4 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src={"/icons/logo.svg"}
          alt="Zoom Logo"
          width={32}
          height={32}
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">
          Zoom
        </p>
      </Link>

      <div className="flex justify-between gap-5">
        <SignedIn>
          <UserButton />
        </SignedIn>

        <MobileNavbar />
      </div>
    </nav>
  );
};

export default Navbar;
