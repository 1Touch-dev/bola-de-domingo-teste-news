import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import type { Metadata } from "next";
import { envConfig } from "@/config/env";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Cancelar newsletter",
    description: `Cancele a newsletter de ${site.name}.`,
    path: "/newsletter/unsubscribe",
  }),
  robots: { index: false, follow: false },
};

interface IUnsubscribePageProps {
  searchParams: Promise<{ email?: string; website?: string }>;
}

const messageFor = (status: number, body: unknown): string => {
  const message = typeof body === "object" && body !== null && "message" in body ? String(body.message) : "";
  if (status === 200) return "Você não receberá mais esta newsletter.";
  if (/already unsubscribed/i.test(message)) return "Este e-mail já estava cancelado.";
  if (status === 404) return "Não encontramos esta inscrição.";
  if (/required/i.test(message)) return "O link está incompleto.";
  return "Não foi possível cancelar. Tente de novo.";
};

const UnsubscribePage = async (props: IUnsubscribePageProps) => {
  const { searchParams } = props;
  const query = await searchParams;
  const email = query.email?.trim() ?? "";
  const website = query.website?.trim() || envConfig.targetWebsite;

  let result = "O link está incompleto.";
  if (email) {
    const url = new URL(`${envConfig.apiBaseUrl}/subscriptions/unsubscribe`);
    url.searchParams.set("email", email);
    url.searchParams.set("website", website);
    try {
      const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      result = messageFor(response.status, body);
    } catch {
      result = "Não foi possível cancelar. Tente de novo.";
    }
  }

  return (
    <Container className="py-10">
      <PageHeader kicker={site.folder} title="Newsletter" lede={result} />
      <AffiliateBanner preset="strip" className="mt-8" />
    </Container>
  );
};

export default UnsubscribePage;
