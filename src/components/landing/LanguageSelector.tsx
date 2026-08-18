"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LANGUAGES, type Language } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  /** Compact mode: show only flag + short code, no chevron text. Used inside mobile menus. */
  compact?: boolean;
  /** Visual variant — 'ghost' matches the navbar buttons, 'outline' for mobile menus */
  variant?: "ghost" | "outline";
  size?: "sm" | "default" | "lg";
}

export default function LanguageSelector({
  compact = false,
  variant = "ghost",
  size = "default",
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.nav.language}
        className={cn(
          "flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          variant === "ghost"
            ? "px-2.5 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            : "px-3 py-2.5 w-full justify-start text-foreground hover:bg-accent",
        )}
      >
        <Globe className="size-4 shrink-0" />
        {!compact && (
          <>
            <span className="hidden sm:inline">{current.nativeName}</span>
            <span className="sm:hidden">{current.code.toUpperCase()}</span>
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </>
        )}
        {compact && (
          <span className="text-xs font-semibold uppercase">
            {current.code}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={t.nav.language}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-[9999] mt-1 min-w-[170px] rounded-xl border border-border bg-popover p-1.5 shadow-lg shadow-black/10",
              // Right-align on desktop navbar; left-align in mobile menus
              variant === "ghost" ? "right-0" : "left-0",
            )}
          >
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === language;
              return (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {lang.flag}
                  </span>
                  <span className="flex-1 text-left">{lang.nativeName}</span>
                  {isActive && (
                    <Check className="size-3.5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
