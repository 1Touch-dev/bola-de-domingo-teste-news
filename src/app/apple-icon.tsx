import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const AppleIcon = () =>
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
            width: 136,
            height: 136,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(250,248,245,0.12) 0%, rgba(250,248,245,0.03) 100%)",
            border: "2px solid rgba(250,248,245,0.14)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
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
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: "-0.08em",
            }}
          >
            BD
          </span>
        </div>
      </div>
    ),
    size,
  );

export default AppleIcon;