// Swooshes.jsx
import { Svg, Path } from "@react-pdf/renderer";

// viewBox width now matches a HALF-COLUMN width (~390pt), not full page
export function TopLeftSwoosh() {
  return (
    <Svg
      viewBox="0 0 390 100"
      preserveAspectRatio="none"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 100 }}
    >
      <Path d="M0,0 L0,98.7 C0,46.6 77.3,5.6 115.9,0 Z" fill="#AFD249" />
      <Path d="M0,0 L0,83.8 C0,39.6 65.6,4.8 98.4,0 Z" fill="#629E3E" />
    </Svg>
  );
}

export function BottomRightSwoosh() {
  return (
    <Svg
      viewBox="0 0 390 80"
      preserveAspectRatio="none"
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 160 }}
    >
      <Path
        d="M 0,80 L 390,80 L 390,45 Q 275,25 145,48 Q 72,58 0,35 Z"
        fill="#AFD249"
      />
      <Path
        d="M 0,80 L 390,80 L 390,52 Q 280,35 157,52 Q 78,60 0,45 Z"
        fill="#1e4d2b"
      />
    </Svg>
  );
}