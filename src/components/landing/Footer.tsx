'use client';

import { Heart, Phone, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/store';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#' },
      { label: 'Integrations', href: '#' },
      { label: 'Mobile App', href: '#' },
      { label: 'API Docs', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Partners', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'System Status', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Training', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Compliance', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Mail, label: 'Email', href: '#' },
];

export default function Footer() {
  const handleLinkClick = (href: string) => {
    if (href.startsWith('#') && href.length > 1) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      id="contact"
      className="relative bg-card/50"
    >
      {/* Gradient separator at top */}
      <div className="gradient-separator" />

      {/* Emergency hotline banner */}
      <div className="bg-emergency">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Phone className="size-5 animate-pulse text-emergency-foreground" />
          <span className="text-sm font-semibold text-emergency-foreground sm:text-base">
            Emergency Hotline:{' '}
            <a href="tel:108" className="underline underline-offset-2">
              108
            </a>{' '}
            &mdash; Available 24/7
          </span>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Logo & tagline - spans 2 columns on desktop */}
          <div className="col-span-2">
            <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emergency text-emergency-foreground">
                <Heart className="size-5" fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight">LifeLink</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Every second matters. LifeLink connects patients with hospitals and
              ambulances in real-time, powered by AI and built for emergencies.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors',
                    'hover:bg-accent hover:text-foreground'
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
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
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
            &copy; {new Date().getFullYear()} LifeLink Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </button>
            <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </button>
            <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
