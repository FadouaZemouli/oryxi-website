import type { Metadata } from "next";
import { ClientsMarquee } from "@/components/projects/ClientsMarquee";
import { CompletedProjects } from "@/components/projects/CompletedProjects";
import { OngoingProjects } from "@/components/projects/OngoingProjects";
import { ProjectsCta } from "@/components/projects/ProjectsCta";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  return buildPageMetadata(locale, "projects");
}

export default async function ProjectsPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);

  return (
    <main className="oms-projects-page flex-1 bg-oms-white">
      <ProjectsHero locale={locale} dict={dict} />
      <OngoingProjects locale={locale} dict={dict} />
      <CompletedProjects locale={locale} dict={dict} />
      <ClientsMarquee locale={locale} dict={dict} />
      <ProjectsCta locale={locale} dict={dict} />
    </main>
  );
}
