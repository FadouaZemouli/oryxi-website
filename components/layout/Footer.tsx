import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { navItems } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-oms-dark bg-oms-dark text-oms-white">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link href="/" className="inline-block bg-oms-white px-3 py-2">
            <Image
              src="/logos/oms-logo.png"
              alt="ORYXI Maintenance Services"
              width={913}
              height={600}
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-4 text-sm font-medium">ORYXI Maintenance Services</p>
          <p className="mt-2 text-sm leading-6 text-oms-gray">
            Professional maintenance and technical services.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold tracking-wide uppercase text-oms-gray">
            Pages
          </p>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-oms-white transition-colors hover:text-oms-gray"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold tracking-wide uppercase text-oms-gray">
            Contact
          </p>
          <p className="mt-4 text-sm leading-6 text-oms-gray">
            Company contact details will be added here once approved.
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-4">
          <p className="text-xs text-oms-gray">
            Copyright {new Date().getFullYear()} ORYXI Maintenance Services. All
            rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
