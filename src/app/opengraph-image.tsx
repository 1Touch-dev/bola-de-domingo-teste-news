import { ImageResponse } from "next/og";

export const alt = "Bola de Domingo — O futebol do domingo, o ano inteiro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OpenGraphImage = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #1A120D 0%, #231910 58%, #3A2C22 100%)",
          color: "#FAF8F5",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 112,
              height: 112,
              borderRadius: 28,
              background: "linear-gradient(180deg, rgba(250,248,245,0.12) 0%, rgba(250,248,245,0.03) 100%)",
              border: "2px solid rgba(250,248,245,0.14)",
              boxShadow: "0 14px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: 20,
                border: "1px solid rgba(154,52,18,0.35)",
              }}
            />
            <span
              style={{
                color: "#F4EFE4",
                fontSize: 44,
                fontWeight: 800,
                letterSpacing: "-0.08em",
              }}
            >
              BD
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#D8B190" }}>BOLADEDOMINGO.COM</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1, letterSpacing: "-0.04em" }}>Bola de Domingo</div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 18, color: "#E7B78E" }}>
            O futebol do domingo
          </div>
        </div>
      </div>
    ),
    size,
  );

export default OpenGraphImage;
