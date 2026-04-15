import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  ExternalLink,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const infoLinks = [
  "About Us",
  "Shipping Information",
  "Privacy Policy",
  "Terms & Conditions",
  "Dealer Registration",
  "Customer Registration",
];

const contactDetails = [
  { department: "Sales", number: "9876543210" },
  { department: "Billing", number: "9876543211" },
  { department: "Support", number: "9876543212" },
  { department: "CCTV Sales", number: "9876543213" },
  { department: "Networking", number: "9876543214" },
  { department: "Dispatch", number: "9876543215" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-10 bg-stb-navy text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="font-heading text-lg font-bold text-white">S</span>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">STB</h3>
                <p className="body-sm -mt-0.5 text-white/60">Technologies</p>
              </div>
            </div>
            <p className="body-md mb-4 text-white/70">
              Your trusted partner for computer accessories, CCTV cameras, printers,
              networking equipment, and all your technology needs.
            </p>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <span className="body-sm">
                2nd Floor, Industrial Area, Jaipur - 302006
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-white/70">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a
                href="mailto:sales@stbtech.com"
                className="body-sm hover:text-white"
              >
                sales@stbtech.com
              </a>
            </div>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="heading-sm mb-4 text-white">Information</h3>
            <nav className="flex flex-col gap-2.5">
              {infoLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="body-sm flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" />
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="heading-sm mb-4 text-white">Contact Details</h3>
            <div className="flex flex-col gap-3">
              {contactDetails.map((contact) => (
                <div
                  key={contact.department}
                  className="flex items-center justify-between"
                >
                  <span className="body-sm text-white/60">
                    {contact.department}
                  </span>
                  <a
                    href={`tel:${contact.number}`}
                    className="body-sm flex items-center gap-1.5 text-white/80 hover:text-white"
                  >
                    <Phone className="h-3 w-3 text-stb-success" />
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h3 className="heading-sm mb-4 text-white">Bank Details</h3>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" />
                <span className="heading-sm text-sm text-white">
                  STB Technologies
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white/60">
                  <CreditCard className="h-3.5 w-3.5 shrink-0" />
                  <span className="body-sm">A/C: 1234567890</span>
                </div>
                <div className="body-sm text-white/60">IFSC: HDFC0001234</div>
                <div className="body-sm text-white/60">Branch: Main Branch, Jaipur</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Copyright Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <p className="body-sm text-white/50">
          Copyright © 2025, STB Technologies. All Rights Reserved.
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToTop}
          className="h-10 w-10 rounded-full bg-primary/20 text-white hover:bg-primary hover:text-white"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </footer>
  );
}
