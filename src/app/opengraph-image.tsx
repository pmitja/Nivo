import { ImageResponse } from "next/og";

export const alt = "Nivo — več povpraševanj za obrtnike";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(145deg, #f3f0ff 0%, #ffffff 68%)",
          color: "#16151d",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "radial-gradient(circle, rgba(106,90,224,.22), transparent 70%)",
            display: "flex",
            height: 700,
            position: "absolute",
            right: -180,
            top: -250,
            width: 700,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
            <div
              style={{
                alignItems: "center",
                background: "#6c4df6",
                borderRadius: 22,
                color: "white",
                display: "flex",
                fontSize: 54,
                fontWeight: 800,
                height: 82,
                justifyContent: "center",
                width: 82,
              }}
            >
              N
            </div>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 800 }}>Nivo</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-3px",
              lineHeight: 1.08,
              marginTop: 66,
              maxWidth: 940,
            }}
          >
            Vi opravljate delo. Mi poskrbimo za stranke.
          </div>
          <div style={{ color: "#5f5b69", display: "flex", fontSize: 30, marginTop: 32 }}>
            Spletna stran, povpraševanja, SMS obvestila in Google ocene.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
