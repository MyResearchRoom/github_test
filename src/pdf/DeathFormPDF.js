import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import "./fonts";

import styles from "./billStyle";
import ConsentFormHeader from "./ConsentFormHeader";
import Footer from "./billFooter";

export default function DeathFormPDF({
  patient,
  admissionDate,
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
        marginBottom: last ? 0 : 12,
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
            paddingTop: 7,
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
                रुग्णालयातील मृत्यूबाबत सारांश
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
                DEATH SUMMARY
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
                मृत्यू सारांश / डिस्चार्ज नोंद
              </Text>
            </View>
          </View>

          {/* ================= DEATH DETAILS ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>मृत्यूबाबत माहिती</Text>
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
                <FieldRow label="दाखल दिनांक" value={admissionDate} />
                <FieldRow label="मृत्यू दिनांक" value={""} />
                <FieldRow label="मृत्यूची वेळ" value={""} last />
              </View>

              {/* RIGHT COLUMN */}
              <View style={{ width: "48%", paddingLeft: 6 }}>
                <FieldRow label="निदान (Diagnosis)" value={""} />
                <FieldRow
                  label="मृत्यूचे प्रत्यक्ष कारण"
                  value={""}
                />
                <FieldRow
                  label="मृत्यूचे मूळ / पूर्वकारण"
                  value={""}
                  last
                />
              </View>
            </View>
          </View>

          {/* ================= RELATIVE ACKNOWLEDGEMENT ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>नातेवाईकांची पोच / घोषणा</Text>
            </View>

            <View
              style={{
                paddingHorizontal: 9,
                paddingVertical: 8,
              }}
            >
              <Text style={textStyle}>
                मी, श्री./श्रीमती ________________________________________,
                मृत रुग्ण {patient?.name ?? "________________________________________"} यांचा
                (नातेवाईक / कायदेशीर पालक या नात्याने) हे नमूद करतो / करते
                की, वरील रुग्णाच्या मृत्यूची व त्याच्या कारणाची माहिती मला
                रुग्णालयाकडून देण्यात आली असून, मृतदेह मी / आम्ही ताब्यात
                घेत आहे / आहोत.
              </Text>
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
              <View style={{ width: "35%" }}>
                <Text style={labelStyle}>नातेवाईकाची स्वाक्षरी</Text>
                <View
                  style={{
                    height: 25,
                    borderBottomWidth: 0.6,
                    borderBottomColor: "#555555",
                    marginTop: 5,
                  }}
                />
              </View>

              {/* Doctor signature */}
              <View style={{ width: "35%" }}>
                <Text style={labelStyle}>
                  उपचार करणाऱ्या डॉक्टरांची स्वाक्षरी व शिक्का
                </Text>
                <View
                  style={{
                    height: 25,
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
                    height: 25,
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
