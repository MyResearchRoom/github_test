import { View, Text, Image } from "@react-pdf/renderer";
import styles from "./styles";

import { capitalizeWords } from "../utils/capitalizeWords";
import { TopLeftSwoosh } from "./CornerSwoosh";
import { HospitalNameHindi } from "../utils/hindiTextImage";
const GREEN_DARK = "#1e4d2b";
const GREEN_MID = "#5c9a3b";
// const DEFAULT_DEPARTMENTS = [
//   "Orthopaedics Department",
//   "ICU Trauma Care Center",
//   "Radiology Department",
//   "Surgery Department",
//   "Medicine Department",
//   "Paediatrics Department",
//   "Ophthalmology Department",
//   "Obstetrics & Gynaecology Department",
// ];

const DEFAULT_DEPARTMENTS = [
  "अस्थिरोग विभाग",
  "अतिदक्षता व ट्रॉमा केअर सेंटर",
  "रेडिओलॉजी विभाग",
  "शस्त्रक्रिया विभाग",
  "औषधोपचार विभाग",
  "बालरोग विभाग",
  "नेत्ररोग विभाग",
  "प्रसूती व स्त्रीरोग विभाग",
];
export default function Header({ doctor }) {
  const departments = doctor?.departments?.length
    ? doctor.departments
    : DEFAULT_DEPARTMENTS;

  // split into two columns
  const mid = Math.ceil(departments.length / 2);
  const colA = departments.slice(0, mid);
  const colB = departments.slice(mid);

  return (
    <View style={styles.header} fixed>
      {/* <View style={styles.headerBand} /> */}
      <TopLeftSwoosh/>
      
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginLeft: 65,
          marginRight: 20,
          marginTop: 20
        }}
      >
        {doctor?.logo && (
          <Image
            src={doctor.logo}
            style={{ width: 55, height: 55, marginRight: 6 }}
          />
        )}

        <View style={{ flex: 1 }}>
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
          {/* <Text style={{ fontSize: 9 }}>
            Closed:{" "}
            {doctor?.closedDays?.length ? doctor.closedDays.join(", ") : "N/A"}
          </Text> */}
        </View>

        {/* vertical divider */}
        <View
          style={{
            width: 1,
            backgroundColor: "#c9c9c9",
            marginHorizontal: 12,
            alignSelf: "stretch",
          }}
        />

        {/* Departments block */}
        <View style={{ width: 230 }}>
          <View
            style={{
              backgroundColor: "#2f6b3a",
              borderRadius: 10,
              paddingVertical: 3,
              paddingHorizontal: 10,
              alignSelf: "flex-start",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 8.5, fontWeight: 700, color: "#fff" }}>
              Our Department
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              {colA.map((d, i) => (
                <View
                  key={`a-${i}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <View
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 1.5,
                      backgroundColor: "#2f6b3a",
                      marginRight: 4,
                    }}
                  />
                  <Text style={{ fontSize: 7, color: "#222", flex: 1 }}>
                    {d}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              {colB.map((d, i) => (
                <View
                  key={`b-${i}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <View
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 1.5,
                      backgroundColor: "#2f6b3a",
                      marginRight: 4,
                    }}
                  />
                  <Text style={{ fontSize: 7, color: "#222", flex: 1 }}>
                    {d}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}