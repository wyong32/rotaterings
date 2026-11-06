"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Play, Download, Sun, Moon, Menu, X, Search, BookOpen, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { MAX_LEVEL } from "@/lib/level-utils";
import { GAME_NAME } from "@/lib/site";
import { getLevelById } from "@/lib/data";

export function SiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const levelNum = parseInt(searchValue);
    if (levelNum >= 1 && levelNum <= MAX_LEVEL && getLevelById(String(levelNum))) {
      router.push(`/levels/${levelNum}`);
      setSearchValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setSearchValue(value);
    }
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/levels", label: "Levels", icon: Play },
    { href: "/find-level/", label: "Find Level", icon: ScanSearch },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/download", label: "Download", icon: Download },
  ];

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 md:container md:mx-auto h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side - Logo and Navigation */}
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
              <Image
                src="/logo.png"
                alt="Rotate Rings Logo"
                width={48}
                height={48}
                className="rounded-full object-cover w-full h-full"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-primary hidden sm:inline-block md:hidden xl:inline-block">
              {GAME_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const content = (
                <>
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              );
              const className = "flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted";
              return item.href === "/find-level/" ? (
                <a key={item.href} href={item.href} className={className}>{content}</a>
              ) : (
                <Link key={item.href} href={item.href} className={className}>{content}</Link>
              );
            })}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                    id="site-level-search"
                    name="level"
                type="text"
                inputMode="numeric"
                placeholder={`Enter level (1-${MAX_LEVEL})`}
                value={searchValue}
                onChange={handleInputChange}
                className="w-48 pl-10 h-9"
              />
            </div>
            {searchValue && (
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4"
              >
                Go
              </Button>
            )}
          </form>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card w-full">
          <div className="w-full px-4 sm:px-6 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const content = (
                <>
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              );
              const className = "flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors rounded-md active:bg-muted/50";
              return item.href === "/find-level/" ? (
                <a key={item.href} href={item.href} className={className} onClick={() => setMobileMenuOpen(false)}>{content}</a>
              ) : (
                <Link key={item.href} href={item.href} className={className} onClick={() => setMobileMenuOpen(false)}>{content}</Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
