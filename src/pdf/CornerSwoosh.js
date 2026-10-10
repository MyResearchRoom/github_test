import { Svg, Path } from "@react-pdf/renderer";

// Top-left corner swoosh (used in header)
// viewBox width matches A4 page width (595pt) so it aligns edge-to-edge
export function TopLeftSwoosh() {
  return (
    <Svg
      viewBox="0 0 595 100"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 100 }}
    >
      {/* Outer lime rim - slightly larger, sits behind */}
      <Path
        d="M0,0 L0,98.7 C0,46.6 77.3,5.6 115.9,0 Z"
        fill="#AFD249"
      />
      {/* Inner dark green fill - smaller, drawn on top, leaves lime rim visible */}
      <Path
        d="M0,0 L0,83.8 C0,39.6 65.6,4.8 98.4,0 Z"
        fill="#629E3E"
      />
    </Svg>
  );
}

// Bottom-right / footer swoosh - out of scope for this pass, left as-is until we tackle the footer

export function BottomRightSwoosh() {
  return (
    <Svg 
      viewBox="0 0 595 80" 
      style={{ 
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        width: "100%", 
        height: 80
      }}
    >
      {/* 1. Base Layer: Light Lime Green Curve (#AFD249) */}
      {/* Coordinates shifted down to Y=60 baseline to eliminate bottom gaps */}
      <Path 
        d="M 0,80 
           L 595,80 
           L 595,45 
           Q 420,25 220,48 
           Q 110,58 0,35 
           Z" 
        fill="#AFD249" 
      />

      {/* 2. Top Layer: Dark Forest Green Accent Curve (#1e4d2b) */}
      {/* Coordinates shifted down to Y=60 baseline to eliminate bottom gaps */}
      <Path 
        d="M 0,80 
           L 595,80 
           L 595,52 
           Q 430,35 240,52 
           Q 120,60 0,45 
           Z" 
        fill="#1e4d2b" 
      />
    </Svg>
  );
}
