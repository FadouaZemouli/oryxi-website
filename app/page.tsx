import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { quoteHref } from "@/lib/navigation";

export default function Home() {
  return (
    <main className="flex-1">
      <Container className="py-12 sm:py-16">
        <SectionHeading
          title="Website under development"
          description="This page is a temporary layout preview for the shared header, footer, and reusable components. Homepage content will be added after approval."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="Shared layout">
            The header, desktop navigation, mobile navigation, and footer are
            now reusable across pages.
          </Card>
          <Card title="Brand components">
            Section wrappers, headings, cards, and primary and secondary buttons
            use the OMS brand colors and official logo.
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href={quoteHref}>Request a Quote</PrimaryButton>
          <SecondaryButton href="/about">About Us</SecondaryButton>
        </div>
      </Container>
    </main>
  );
}
