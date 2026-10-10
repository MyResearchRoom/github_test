// HospitalHeader.jsx
import { View, Text, Image } from "@react-pdf/renderer";
import { TopLeftSwoosh } from "./newSwooshCurve";
import "./fonts";
import styles from "./newbillStyle";
import { myImg } from "../assets/Images";
import { Svg, Path, Circle } from "@react-pdf/renderer";
import { HospitalNameHindi } from "../utils/hindiTextImage";

function PinIcon({ size = 9, color = "#1e4d2b" }) {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path
        d="M12 21c-4.5-4.5-7-8.2-7-11.5A7 7 0 0 1 12 2a7 7 0 0 1 7 7.5c0 3.3-2.5 7-7 11.5Z"
        fill={color}
      />
      <Circle cx="12" cy="9.3" r="2.3" fill="#ffffff" />
    </Svg>
  );
}

function PhoneIcon({ size = 9, color = "#1e4d2b" }) {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.6 21 3 12.4 3 2.7c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z"
        fill={color}
      />
    </Svg>
  );
}

export default function HospitalHeader({ copyLabel ,logo}) {
  // console.log("header");
  
  return (
    <View style={styles.headerWrapper}>
      <TopLeftSwoosh />

      <View style={styles.headerContentRow}>
        {/* Left: logo + name */}
        <View style={styles.logoBlock}>
          <View style={styles.logoCircle}>
            {/* <Image src={myImg.logo} style={styles.logoImage} /> */}
            <Image src={logo} style={styles.logoImage} />

          </View>
          <View style={styles.hospitalNameBlock}>
            <Text style={styles.hospitalNameEn}>Krishna ICU & </Text>
            <Text style={styles.hospitalSubEn}>Multi-Speciality Hospital</Text>
            {/* <Text style={styles.hospitalNameMr}>
              कृष्णा मल्टीस्पेशालिटी हॉस्पिटल
            </Text> */}
            {/* <HospitalNameHindi/> */}
          </View>
        </View>

        {/* Right: address + phone */}
        <View style={styles.contactBlock}>
          <View style={styles.contactRow}>
            <PinIcon size={10} color="#1e4d2b" />
            <View style={styles.contactTextGroup}>
              <Text style={styles.contactLineMr}>
                वसंतराव नाईक पुतळ्या जवळ, 
              </Text>
              <Text style={styles.contactLineMr}>वसमत रोड, परभणी, महाराष्ट्र. ४३१४०१</Text>
            </View>
          </View>
          {/* <View style={styles.contactRow}>
            <PhoneIcon size={8} color="#1e4d2b" />
            <Text style={styles.contactPhone}>
              Appointment No.: +91 9091905353
            </Text>
          </View> */}
           <View style={{ flexDirection: "row", alignItems: "center" }}>
              <PhoneIcon />
              <Text style={{ fontSize: 7, fontWeight: 600, color: "#1e4d2b", paddingBottom:3 , paddingLeft: 2}}>
                Appointment No.: +91 9091905353
              </Text>
            </View>
        </View>
      </View>

      <View style={styles.copyBadgeRow}>
        <Text style={styles.copyBadgeText}>{copyLabel}</Text>
      </View>
    </View>
  );
}
