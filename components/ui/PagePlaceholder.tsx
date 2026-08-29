import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type PagePlaceholderProps = {
  title: string;
  description: string;
  comingSoon: string;
};

export function PagePlaceholder({
  title,
  description,
  comingSoon,
}: PagePlaceholderProps) {
  return (
    <main className="flex-1">
      <Container className="py-12 sm:py-16">
        <SectionHeading title={title} description={description} />
        <p className="mt-6 text-base text-oms-dark/80">{comingSoon}</p>
      </Container>
    </main>
  );
}
