import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type PagePlaceholderProps = {
  title: string;
};

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <main className="flex-1">
      <Container className="py-12 sm:py-16">
        <SectionHeading
          title={title}
          description="This page is a placeholder. Approved content will be added here."
        />
        <p className="mt-6 text-base text-oms-dark/80">Content coming soon.</p>
      </Container>
    </main>
  );
}
