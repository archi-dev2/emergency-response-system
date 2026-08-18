"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useNavigationStore } from "@/store";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "@/components/landing/LanguageSelector";
import { cn } from "@/lib/utils";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.features, href: "#features" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "navbar-glass shadow-lg" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#home");
          }}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emergency text-emergency-foreground">
            <Heart className="size-5" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            LifeLink
          </span>
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground"
          >
            <AnimatePresence mode="wait">
              {resolvedTheme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="size-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="size-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* Language selector — between theme and Login */}
          <LanguageSelector variant="ghost" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              useNavigationStore.getState().setCurrentPage("login")
            }
          >
            {t.nav.login}
          </Button>
          <Button
            size="sm"
            className="bg-emergency hover:bg-emergency/90 text-emergency-foreground"
            onClick={() =>
              useNavigationStore.getState().setCurrentPage("signup")
            }
          >
            {t.nav.getStarted}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-muted-foreground"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emergency text-emergency-foreground">
                    <Heart className="size-4" fill="currentColor" />
                  </div>
                  LifeLink
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4 pt-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="rounded-md px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Language selector in mobile menu */}
              <div className="px-4 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-3">
                  {t.nav.language}
                </p>
                <LanguageSelector variant="outline" />
              </div>

              <div className="flex flex-col gap-2 px-4 pt-4 border-t mt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMobileOpen(false);
                    useNavigationStore.getState().setCurrentPage("login");
                  }}
                >
                  {t.nav.login}
                </Button>
                <Button
                  className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                  onClick={() => {
                    setMobileOpen(false);
                    useNavigationStore.getState().setCurrentPage("signup");
                  }}
                >
                  {t.nav.getStarted}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
