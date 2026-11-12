import { brandImage } from "@/lib/brandImage";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Bola de Domingo";

const OpenGraphImage = () => brandImage("brand/fallback.png");

export default OpenGraphImage;
