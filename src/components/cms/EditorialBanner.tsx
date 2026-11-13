import EditorialBannerCarousel from "@/components/cms/EditorialBannerCarousel";
import { Container } from "@/components/ui";
import { getEditorialBanners } from "@/lib/banners";

/** Homepage destaque carousel — CMS public banners with auto-rotate + controls. */
export default async function EditorialBanner() {
  const slides = await getEditorialBanners();
  if (!slides.length) return null;

  return (
    <Container className="pt-6">
      <section aria-label="Destaques">
        <EditorialBannerCarousel slides={slides} />
      </section>
    </Container>
  );
}
