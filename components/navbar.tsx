"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon, MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          AI Image Generator
        </Link>

        {/* Centered Links for Large Screens */}
        <div className="hidden lg:flex flex-1 justify-center space-x-10">
          <Link href="/" className="text-sm font-medium hover:underline">
            Generate Image
          </Link>
          <Link href="/showcase" className="text-sm font-medium hover:underline">
            Showcase
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
        </div>

        {/* User & Theme Actions (Right Side) */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden lg:block"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {/* Auth Links */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>
                    {session.user?.name?.[0] || session.user?.email?.[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Link href="/showcase">Showcase</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/pricing">Pricing</Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2 hidden lg:flex">
              <Button variant="outline" asChild>
                <Link href="/contact">Contact</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}

          {/* Mobile Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="lg:hidden"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDrawer}
            className="lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          isDrawerOpen ? "opacity-100 z-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
      >
        <div
          className={`fixed top-0 right-0 bg-white dark:bg-black dark:text-slate-50 w-3/4 h-full shadow-lg transition-transform ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between p-4 border-b">
            <Link href="/" className="font-bold" onClick={toggleDrawer}>
              AI Image Generator
            </Link>
            <Button onClick={toggleDrawer} variant="ghost" size="icon">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-4 p-4">
            <Link href="/" onClick={toggleDrawer} className="text-lg">
              Generate Image
            </Link>
            <Link href="/showcase" onClick={toggleDrawer} className="text-lg">
              Showcase
            </Link>
            <Link href="/pricing" onClick={toggleDrawer} className="text-lg">
              Pricing
            </Link>

            {session ? (
              <>
                <Link href="/profile" onClick={toggleDrawer} className="text-lg">
                  Profile
                </Link>
                <Button
                  onClick={() => {
                    signOut();
                    toggleDrawer();
                  }}
                  variant="outline"
                  className="w-full text-lg"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/contact" onClick={toggleDrawer} className="text-lg">
                  Contact
                </Link>
                <Link href="/register" onClick={toggleDrawer} className="text-lg">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
