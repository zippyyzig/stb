import Link from "next/link";
import { Phone, Mail } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const columns = [
  {
    title: "Product Categories",
    links: [
      { name: "Desktop", href: "/category/desktop" },
      { name: "Laptops", href: "/category/laptops" },
      { name: "Storage", href: "/category/storage" },
      { name: "Display", href: "/category/display" },
      { name: "Peripherals", href: "/category/peripherals" },
      { name: "Printers & Scanners", href: "/category/printers-scanners" },
      { name: "Networking", href: "/category/networking" },
      { name: "Security", href: "/category/security" },
      { name: "Software", href: "/category/software" },
    ],
  },
  {
    title: "Site Info",
    links: [
      { name: "About Smart Tech Bazaar", href: "/about" },
      { name: "Dealer Registration", href: "/auth/register?type=dealer" },
      { name: "All Brands", href: "/brands" },
      { name: "All Categories", href: "/categories" },
      { name: "Contact Us", href: "/support" },
    ],
  },
  {
    title: "Resource Center",
    links: [
      { name: "All Products", href: "/products" },
      { name: "My Orders", href: "/dashboard/orders" },
      { name: "Wishlist", href: "/wishlist" },
      { name: "Cart", href: "/cart" },
      { name: "Support", href: "/support" },
    ],
  },
  {
    title: "Policies",
    links: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Shipping & Delivery", href: "/shipping" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", href: "#", Icon: FacebookIcon },
  { name: "Instagram", href: "#", Icon: InstagramIcon },
  { name: "LinkedIn", href: "#", Icon: LinkedinIcon },
];

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#172337] pb-20 text-white md:mt-14 md:pb-0">
      <div className="mx-auto max-w-[1200px] px-4 pt-8 md:pt-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-xs font-medium uppercase tracking-wide text-[#878787]">{column.title}</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[13px] font-medium text-white transition-colors hover:underline">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-8 grid gap-6 border-t border-white/15 pt-6 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fk-blue text-white">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#878787]">Need help? Call us</p>
                <a href="tel:6363677588" className="text-sm font-medium hover:underline">
                  6363677588
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fk-blue text-white">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#878787]">Sales &amp; Billing</p>
                <Link href="/support" className="text-sm font-medium hover:underline">
                  Contact support
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <span className="text-xs uppercase tracking-wide text-[#878787]">Follow us</span>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-fk-blue"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/15 pt-5">
          <h3 className="text-xs font-medium uppercase tracking-wide text-[#878787]">Disclaimer</h3>
          <p className="mt-2 text-xs leading-relaxed text-white/70">
            Product prices, offers and availability are subject to change from time to time. All prices are inclusive
            of applicable taxes. Product colours and images are only for illustration and may not exactly match the
            actual product. Product specifications are subject to change and may vary from the actual product. While
            every care is taken to avoid inaccuracies in content, it is provided as is, without warranty of any kind.
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-white/15 py-5 text-center text-xs text-white/70">
        &copy; {new Date().getFullYear()} Smart Tech Bazaar. All rights reserved.
      </div>
    </footer>
  );
}
