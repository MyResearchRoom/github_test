import { View, Text, Image, Svg, Path, Circle } from "@react-pdf/renderer";
import styles from "./billStyle";
import { TopLeftSwoosh } from "./CornerSwoosh";
import { HospitalNameHindi } from "../utils/hindiTextImage";


const GREEN_DARK = "#1e4d2b";
const GREEN_MID = "#5c9a3b";

function PinIcon() {
  return (
    <Svg
      viewBox="0 0 24 24"
      style={{ width: 12, height: 12, marginRight: 4, marginTop: 3 }}
    >
      <Path
        d="M12 2C7.6 2 4 5.6 4 10c0 5.4 8 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8Z"
        fill={GREEN_MID}
      />
      <Circle cx="12" cy="10" r="2.5" fill="#ffffff" />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 12, height: 12, marginRight: 4 }}>
      <Path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1.1.5 1.1 1.1v3.5c0 .6-.5 1.1-1.1 1.1C10.6 21.3 2.7 13.4 2.7 4.3c0-.6.5-1.1 1.1-1.1H7.3c.6 0 1.1.5 1.1 1.1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8Z"
        fill={GREEN_MID}
      />
    </Svg>
  );
}

export default function Header({ doctor }) {
  return (
    <View style={[styles.header]} fixed>
      <TopLeftSwoosh />

      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          alignItems: "flex-start",
          justifyContent: "space-between",
          zIndex: 2,
          padding: "5px 40px",
        }}
      >
        {/* Logo + clinic name block */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {doctor?.logo && (
            <Image
              src={doctor.logo}
              style={{ width: 55, height: 55, marginRight: 8 }}
            />
          )}
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: GREEN_DARK,
                letterSpacing: 0.5,
              }}
            >
              Krishna ICU & 
            </Text>
            <Text
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: GREEN_DARK,
              }}
            >
              Multi-Speciality Hospital
            </Text>
            {/* <Text
              style={{
                fontFamily: "NotoSansDevanagari", 
                fontSize: 9,
                fontWeight: 700,
                color: GREEN_DARK,
                marginTop: 2,
              }}
            >
              {"कृष्णा मल्टिस्पेशियलिटी हॉस्पिटल"}
            </Text> */}
            <HospitalNameHindi/>
          </View>
        </View>

        {/* Address + appointment number block */}
        <View style={{ alignItems: "flex-start", maxWidth: 190, marginTop: 4 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 3,
            }}
          >
            <PinIcon/>
            <Text style={{ fontSize: 9, color: "#3a3a3a", lineHeight: 1.3, fontFamily: "NotoSansDevanagari", fontWeight:700, }}>
              {!doctor?.clinicAddress || "वसंतराव नाईक पुतळ्या जवळ, \nवसमत रोड, परभणी, महाराष्ट्र. ४३१४०१"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <PhoneIcon />
            <Text style={{ fontSize: 9, fontWeight: 700, color: "#3a3a3a" }}>
              Appointment No.: +91 {doctor?.mobileNumber || "9091905353"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
