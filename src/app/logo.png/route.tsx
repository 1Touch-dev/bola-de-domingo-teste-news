import { ImageResponse } from "next/og";

export const GET = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1A120D 0%, #231910 58%, #3A2C22 100%)",
        }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 48,
            background: "linear-gradient(180deg, rgba(250,248,245,0.1) 0%, rgba(250,248,245,0.02) 100%)",
            border: "2px solid rgba(250,248,245,0.12)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 20,
              borderRadius: 32,
              border: "1px solid rgba(154,52,18,0.35)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0.9,
            }}
          >
            <span
              style={{
                fontSize: 170,
                fontWeight: 800,
                letterSpacing: "-0.08em",
                color: "#F4EFE4",
              }}
            >
              BD
            </span>
            <span
              style={{
                marginTop: 14,
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(154,52,18,0.16)",
                color: "#E7B78E",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Domingo
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
