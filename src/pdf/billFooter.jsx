import { View, Text } from "@react-pdf/renderer";
import { BottomRightSwoosh } from "./CornerSwoosh";
import { getFormattedDateTime } from "../utils/getFormattedDateTime";

export default function Footer({
  text = "This is a system generated bill",
  showDateTime = true,
}) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
      }}
    >
      <BottomRightSwoosh />

      {/* TEXT ROW PLACED AFTER THE SVG TO LAYER ON TOP OF THE GREEN CURVE */}
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 7,
            color: "#ffffff",
          }}
        >
          {text}
          {showDateTime ? ` - ${getFormattedDateTime()}` : ""}
        </Text>
      </View>
    </View>
  );
}