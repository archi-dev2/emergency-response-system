"use client";

import { Heart, Phone, Twitter, Facebook, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const FOOTER_HREFS = [
  { hrefs: ["#features", "#", "#", "#", "#"] },
  { hrefs: ["#about", "#", "#", "#", "#"] },
  { hrefs: ["#", "#contact", "#", "#", "#"] },
  { hrefs: ["#", "#", "#", "#", "#"] },
];

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

export default function Footer() {
  const { t } = useLanguage();

  const footerColumns = [
    { ...t.footer.columns.product, hrefs: FOOTER_HREFS[0].hrefs },
    { ...t.footer.columns.company, hrefs: FOOTER_HREFS[1].hrefs },
    { ...t.footer.columns.support, hrefs: FOOTER_HREFS[2].hrefs },
    { ...t.footer.columns.legal, hrefs: FOOTER_HREFS[3].hrefs },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#") && href.length > 1) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="relative bg-card/50">
      <div className="gradient-separator" />

      {/* Emergency hotline banner */}
      <div className="bg-emergency">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Phone className="size-5 animate-pulse text-emergency-foreground" />
          <span className="text-sm font-semibold text-emergency-foreground sm:text-base">
            {t.footer.hotline.split("108")[0]}
            <a href="tel:108" className="underline underline-offset-2">
              108
            </a>
            {t.footer.hotline.split("108")[1]}
          </span>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Logo & tagline */}
          <div className="col-span-2">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emergency text-emergency-foreground">
                <Heart className="size-5" fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight">LifeLink</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  )}
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((label, idx) => (
                  <li key={label}>
                    <button
                      onClick={() => handleLinkClick(column.hrefs[idx] ?? "#")}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t.footer.bottomLinks.privacy}
            </button>
            <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t.footer.bottomLinks.terms}
            </button>
            <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t.footer.bottomLinks.cookies}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
