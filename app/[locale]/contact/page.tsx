import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactMessage } from "@/components/contact/ContactMessage";
import { ContactValues } from "@/components/contact/ContactValues";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  return buildPageMetadata(locale, "contact");
}

export default async function ContactPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);

  return (
    <main className="oms-contact-page flex-1 bg-oms-white">
      <ContactHero locale={locale} dict={dict} />
      <ContactInfo locale={locale} dict={dict} />
      <ContactMessage locale={locale} dict={dict} />
      <ContactValues locale={locale} dict={dict} />
    </main>
  );
}
