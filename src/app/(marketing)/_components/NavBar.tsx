import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function NavBar() {
  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link className="text-lg" href="#">
          Features
        </Link>
        <Link className="text-lg" href="#pricing">
          Pricing
        </Link>
        <Link className="text-lg" href="#">
          About
        </Link>
        <span className="text-lg"></span>
      </nav>
    </header>
  );
}
