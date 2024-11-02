"use client";

import Image from "next/image";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";

export function Navbar() {
  return (
    <nav className="w-full max-w-7xl flex justify-between items-center mb-12">
      <div className="flex items-center">
        <Image src="/logo.png" alt="AssetFlow Logo" width={32} height={32} />
        <span className="text-xl font-bold">AssetFlow</span>
      </div>
      <div className="text-black">
        <Button 
          variant="outline" 
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
}