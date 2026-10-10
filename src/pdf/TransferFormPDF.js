import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import "./fonts";

import styles from "./billStyle";
import ConsentFormHeader from "./ConsentFormHeader";
import Footer from "./billFooter";

export default function TransferFormPDF({
  patient,
  logo,
  mobileNumber = "9091905353",
}) {
  const labelStyle = {
    fontFamily: "NotoSansDevanagari",
    fontSize: 9.2,
    fontWeight: 700,
    color: "#222222",
  };

  const textStyle = {
    fontFamily: "NotoSansDevanagari",
    fontSize: 9.4,
    lineHeight: 1.5,
    color: "#222222",
    textAlign: "justify",
  };

  const lineStyle = {
    flex: 1,
    borderBottomWidth: 0.6,
    borderBottomColor: "#555555",
    marginLeft: 5,
    minHeight: 16,
  };

  const sectionHeaderStyle = {
    backgroundColor: "#e8f0dc",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: "#4a7a3a",
  };

  const sectionTitleStyle = {
    fontFamily: "NotoSansDevanagari",
    fontSize: 10,
    fontWeight: 700,
    color: "#2f5425",
  };

  const sectionStyle = {
    borderWidth: 0.8,
    borderColor: "#4a7a3a",
    marginBottom: 10,
  };

  // reusable "label : ____ value ____" row, used inside two-column field grids
  const FieldRow = ({ label, value, last = false }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: last ? 0 : 6,
      }}
    >
      <Text style={labelStyle}>{label} :</Text>
      <View style={lineStyle}>
        <Text style={{ fontFamily: "NotoSansDevanagari", fontSize: 9.2 }}>
          {value || ""}
        </Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page
        size="A4"
        style={[
          styles.page,
          {
            paddingTop: 112,
            paddingBottom: 75,
          },
        ]}
        wrap
      >
        {/* ================= HEADER ================= */}

        <ConsentFormHeader logo={logo} mobileNumber={mobileNumber} />

        {/* ================= BODY ================= */}

        <View
          style={{
            flex: 1,
            paddingHorizontal: 38,
            paddingTop: 0,
            paddingBottom: 6,
          }}
        >
          {/* ================= TITLE ================= */}

          <View
            style={{
              borderWidth: 0.8,
              borderColor: "#4a7a3a",
              marginBottom: 10,
            }}
          >
            <View style={sectionHeaderStyle}>
              <Text
                style={{
                  ...sectionTitleStyle,
                  textAlign: "center",
                  fontSize: 11,
                }}
              >
                रुग्णालयातून दुसऱ्या रुग्णालयात स्थानांतर (रेफरल)
              </Text>
            </View>

            <View
              style={{
                paddingVertical: 6,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSansDevanagari",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#222222",
                }}
              >
                TRANSFER
              </Text>

              <Text
                style={{
                  fontFamily: "NotoSansDevanagari",
                  fontSize: 9.2,
                  fontWeight: 700,
                  color: "#444444",
                  marginTop: 1,
                }}
              >
                रुग्ण स्थानांतर घोषणापत्र व सारांश
              </Text>
            </View>
          </View>

          {/* ================= DECLARATION ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>रुग्ण / नातेवाईकांची घोषणा</Text>
            </View>

            <View
              style={{
                paddingHorizontal: 9,
                paddingVertical: 8,
              }}
            >
              {/* Intro */}

              <Text style={textStyle}>
                मी, श्री./श्रीमती ________________________________________,
                रुग्ण {patient?.name ?? "________________________________________"} यांचा
                (स्वतः / नातेवाईक / कायदेशीर पालक या नात्याने) हे घोषित
                करतो / करते की,
              </Text>

              <View style={{ height: 6 }} />

              {/* Paragraph 1 */}

              <Text style={textStyle}>
                रुग्णाच्या सध्याच्या वैद्यकीय स्थितीची व पुढील उपचारांसाठी
                अधिक प्रगत / विशेष सुविधा असलेल्या रुग्णालयात स्थानांतर करणे
                आवश्यक असल्याची माहिती डॉक्टरांनी मला माझ्या समजण्यास योग्य
                भाषेत दिली आहे. स्थानांतरादरम्यान होऊ शकणाऱ्या जोखमींची व
                घ्यावयाच्या काळजीची कल्पना मला देण्यात आली आहे.
              </Text>

              <View style={{ height: 6 }} />

              {/* Paragraph 2 */}

              <Text style={textStyle}>
                डॉक्टरांनी माझ्या प्रश्नांची समाधानकारक उत्तरे दिली असून,
                वरील सर्व माहिती समजून घेतल्यानंतर, कोणत्याही दबावाशिवाय
                मी / आम्ही रुग्णाच्या स्थानांतरास स्वेच्छेने संमती देत आहे /
                आहोत.
              </Text>
            </View>
          </View>

          {/* ================= TRANSFER DETAILS ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>स्थानांतराचा तपशील</Text>
            </View>

            <View
              style={{
                padding: 9,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {/* LEFT COLUMN */}
              <View style={{ width: "48%", paddingRight: 6 }}>
                <FieldRow
                  label="स्थानांतरित रुग्णालयाचे नाव"
                  value={""}
                />
                <FieldRow
                  label="रुग्णालयाचा पत्ता"
                  value={""}
                />
                <FieldRow
                  label="सोबत असलेले कर्मचारी"
                  value={""}
                  last
                />
              </View>

              {/* RIGHT COLUMN */}
              <View style={{ width: "48%", paddingLeft: 6 }}>
                <FieldRow label="स्थानांतराचे कारण" value={""} />
                <FieldRow
                  label="स्थानांतरावेळी रुग्णाची प्रकृती"
                  value={""}
                />
                <FieldRow
                  label="स्थानांतराचा दिनांक"
                  value={""}
                />
              </View>
            </View>
          </View>

          {/* ================= PATIENT / RELATIVE DETAILS ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>रुग्ण व नातेवाईकांची माहिती</Text>
            </View>

            <View
              style={{
                padding: 9,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {/* LEFT COLUMN */}
              <View style={{ width: "48%", paddingRight: 6 }}>
                <FieldRow label="पेशंटचे नाव" value={patient?.name} />
                <FieldRow label="वय" value={patient?.age} />
                <FieldRow label="सही" value="" />
                <FieldRow label="अंगठा" value="" last />
              </View>

              {/* RIGHT COLUMN */}
              <View style={{ width: "48%", paddingLeft: 6 }}>
                <FieldRow label="नातेवाईकांचे नाव" value="" />
                <FieldRow label="नाते" value="" />
                <FieldRow label="वय" value="" />
                <FieldRow label="सही" value="" last />
              </View>
            </View>
          </View>

          {/* ================= SIGNATURES ================= */}

          <View
            style={{
              borderWidth: 0.8,
              borderColor: "#c8c8c8",
              padding: 10,
              marginTop: 2,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              {/* Relative signature */}
              <View style={{ width: "30%" }}>
                <Text style={labelStyle}>रुग्ण / नातेवाईकाची स्वाक्षरी</Text>
                <View
                  style={{
                    height: 20,
                    borderBottomWidth: 0.6,
                    borderBottomColor: "#555555",
                    marginTop: 5,
                  }}
                />
              </View>

              {/* Doctor signature */}
              <View style={{ width: "40%" }}>
                <Text style={labelStyle}>
                  स्थानांतर करणाऱ्या डॉक्टरांची स्वाक्षरी व शिक्का
                </Text>
                <View
                  style={{
                    height: 20,
                    borderBottomWidth: 0.6,
                    borderBottomColor: "#555555",
                    marginTop: 5,
                  }}
                />
              </View>

              {/* Date */}
              <View style={{ width: "20%" }}>
                <Text style={labelStyle}>दिनांक :</Text>
                <View
                  style={{
                    height: 20,
                    borderBottomWidth: 0.6,
                    borderBottomColor: "#555555",
                    marginTop: 5,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ================= FOOTER ================= */}

        <Footer />
      </Page>
    </Document>
  );
}
