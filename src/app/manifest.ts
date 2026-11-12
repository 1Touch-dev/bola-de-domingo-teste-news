import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const manifest = (): MetadataRoute.Manifest => ({
  name: `${site.name} · ${site.folder}`,
  short_name: site.name,
  description: site.description,
  start_url: "/",
  display: "standalone",
  background_color: "#f1efea",
  theme_color: "#231910",
  lang: "pt-BR",
  icons: [
    { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
  ],
});

export default manifest;
