import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const Icon = () =>
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
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 7,
            background: "linear-gradient(180deg, rgba(250,248,245,0.12) 0%, rgba(250,248,245,0.03) 100%)",
            border: "1px solid rgba(250,248,245,0.14)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            color: "#F4EFE4",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "-0.08em",
          }}
        >
          BD
        </div>
      </div>
    ),
    size,
  );

export default Icon;