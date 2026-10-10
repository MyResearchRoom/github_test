import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import "./fonts";
import styles from "./billStyle";
import ConsentFormHeader from "./ConsentFormHeader";
import Footer from "./billFooter";
import { capitalizeWords } from "../utils/capitalizeWords";

export default function ConsentFormPDF({
  patient,
  consent,
  logo,
}) {
  const fieldStyle = {
    flexDirection: "row",
    alignItems: "flex-end",
    minHeight: 19,
  };

  const labelStyle = {
    fontSize: 9.2,
    fontWeight: 700,
    color: "#333333",
  };

  const valueStyle = {
    fontSize: 9.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#777777",
    paddingBottom: 1,
    flex: 1,
  };

  const sectionHeaderStyle = {
    backgroundColor: "#e8f0dc",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: "#4a7a3a",
  };

  const sectionTitleStyle = {
    fontSize: 10,
    fontWeight: 700,
    color: "#2f5425",
  };

  const sectionStyle = {
    borderWidth: 0.8,
    borderColor: "#4a7a3a",
    marginBottom: 8,
  };

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
        {/* Watermark */}
       {logo && (
          <Image
            src={logo}
            style={styles.watermark}
            fixed
          />
        )}

        {/* Header */}
        <ConsentFormHeader
          logo={logo}
          mobileNumber="9091905353"
        />

        {/* BODY */}
        <View
          style={{
            paddingHorizontal: 38,
            marginTop: 8,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* ================= TITLE ================= */}

          <View
            style={{
              position: "relative",
              marginBottom: 6,
              minHeight: 24,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: 700,
                color: "#222222",
              }}
            >
              संमतीपत्र
            </Text>

            <View
              style={{
                position: "absolute",
                right: 0,
                top: 3,
              }}
            >
              <Text
                style={{
                  fontSize: 8.8,
                  color: "#333333",
                }}
              >
                दिनांक:{" "}
                {consent?.date ||
                  ""}
              </Text>
            </View>
          </View>

          {/* ================= PATIENT DETAILS ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>
                रुग्णाची माहिती
              </Text>
            </View>

            <View style={{ padding: 7 }}>
              {/* Row 1 */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: "58%",
                    paddingRight: 12,
                  }}
                >
                  <View style={fieldStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 45,
                      }}
                    >
                      नाव:
                    </Text>

                    <Text style={valueStyle}>
                      {capitalizeWords(patient?.name || "")}
                    </Text>
                  </View>
                </View>

                <View style={{ width: "42%" }}>
                  <View style={fieldStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 72,
                      }}
                    >
                      रुग्ण क्रमांक:
                    </Text>

                    <Text style={valueStyle}>
                      {patient?.patientId || ""}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Row 2 */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: "25%",
                    paddingRight: 10,
                  }}
                >
                  <View style={fieldStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 28,
                      }}
                    >
                      वय:
                    </Text>

                    <Text style={valueStyle}>
                      {patient?.age || ""}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: "25%",
                    paddingRight: 10,
                  }}
                >
                  <View style={fieldStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 45,
                      }}
                    >
                      लिंग:
                    </Text>

                    <Text style={valueStyle}>
                      {patient?.gender || ""}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: "25%",
                    paddingRight: 10,
                  }}
                >
                  <View style={fieldStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 68,
                      }}
                    >
                      रक्तगट:
                    </Text>

                    <Text style={valueStyle}>
                      {patient?.bloodGroup || ""}
                    </Text>
                  </View>
                </View>

                <View style={{ width: "25%" }}>
                  <View style={fieldStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 43,
                      }}
                    >
                      IPD क्र.:
                    </Text>

                    <Text style={valueStyle}>
                      {consent?.ipdNumber ||
                        ""}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Row 3 */}
              <View style={fieldStyle}>
                <Text
                  style={{
                    ...labelStyle,
                    width: 70,
                  }}
                >
                  वॉर्ड / बेड:
                </Text>

                <Text style={valueStyle}>
                  {consent?.wardBed || ""}
                </Text>
              </View>
            </View>
          </View>

          {/* ================= CONSENT DETAILS ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>
                संमतीचा तपशील
              </Text>
            </View>

            <View style={{ padding: 7 }}>
              {/* Consent For */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 7,
                }}
              >
                <Text
                  style={{
                    ...labelStyle,
                    width: 82,
                  }}
                >
                  संमती कशासाठी:
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Text style={{ fontSize: 9.2 }}>
                    ☐ उपचार
                  </Text>
                </View>
              </View>

              {/* Diagnosis */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  marginBottom: 7,
                }}
              >
                <Text
                  style={{
                    ...labelStyle,
                    width: 125,
                  }}
                >
                  निदान / वैद्यकीय स्थिती:
                </Text>

                <Text style={valueStyle}>
                  {consent?.diagnosis || ""}
                </Text>
              </View>

              {/* Procedure */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    ...labelStyle,
                    width: 125,
                  }}
                >
                  प्रक्रिया / उपचार:
                </Text>

                <Text style={valueStyle}>
                  {/* {consent?.procedure || ""} */}
                </Text>
              </View>
            </View>
          </View>

          {/* ================= DECLARATION ================= */}

          <View
            style={{
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#2f5425",
                marginBottom: 5,
              }}
            >
              संमती घोषणा
            </Text>

            <View
              style={{
                borderWidth: 0.6,
                borderColor: "#c8c8c8",
                padding: 8,
                minHeight: 65,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  lineHeight: 1.5,
                  textAlign: "justify",
                  color: "#333333",
                }}
              >
                माझ्या आजाराची / वैद्यकीय स्थितीची माहिती,
                प्रस्तावित उपचार किंवा प्रक्रियेचे स्वरूप,
                त्याचे अपेक्षित फायदे, संभाव्य धोके तसेच
                उपलब्ध पर्याय याबाबत डॉक्टरांनी मला समजावून
                सांगितले आहे. मला आवश्यक प्रश्न विचारण्याची
                संधी मिळाली असून माझ्या प्रश्नांची समाधानकारक
                उत्तरे देण्यात आली आहेत. वरील उपचार किंवा
                प्रक्रियेसाठी मी माझ्या स्वेच्छेने संमती देत आहे.
              </Text>
            </View>
          </View>

          {/* ================= CONSENT GIVEN BY ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>
                संमती देणारी व्यक्ती
              </Text>
            </View>

            <View style={{ padding: 7 }}>
              {/* Name + Relationship - KEEP BLANK */}

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 7,
                }}
              >
                <View
                  style={{
                    width: "55%",
                    paddingRight: 12,
                  }}
                >
                  <View style={fieldStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 38,
                      }}
                    >
                      नाव:
                    </Text>

                    <Text style={valueStyle}>
                      {" "}
                    </Text>
                  </View>
                </View>

                <View style={{ width: "45%" }}>
                  <View style={fieldStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 70,
                      }}
                    >
                      नाते:
                    </Text>

                    <Text style={valueStyle}>
                      {" "}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Consent By - KEEP ALL EMPTY */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    ...labelStyle,
                    width: 75,
                  }}
                >
                  संमती देणारे:
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 9.2 }}>
                    ☐ रुग्ण
                  </Text>

                  <Text style={{ fontSize: 9.2 }}>
                    ☐ पालक / संरक्षक
                  </Text>

                  <Text style={{ fontSize: 9.2 }}>
                    ☐ प्रतिनिधी
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================= SIGNATURES ================= */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 2,
              paddingTop: 8,
              paddingBottom: 2,
            }}
          >
            {/* Patient */}

            <View style={{ width: "30%" }}>
              <View
                style={{
                  height: 30,
                  borderBottomWidth: 0.8,
                  borderBottomColor: "#333333",
                  marginBottom: 4,
                }}
              />

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                रुग्ण / प्रतिनिधी
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 8.5,
                  color: "#666666",
                  marginTop: 2,
                }}
              >
                स्वाक्षरी
              </Text>
            </View>

            {/* Doctor */}

            <View style={{ width: "30%" }}>
              <View
                style={{
                  height: 30,
                  borderBottomWidth: 0.8,
                  borderBottomColor: "#333333",
                  marginBottom: 4,
                }}
              />

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                डॉक्टर
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 8.5,
                  color: "#666666",
                  marginTop: 2,
                }}
              >
                स्वाक्षरी
              </Text>
            </View>

            {/* Witness */}

            <View style={{ width: "30%" }}>
              <View
                style={{
                  height: 30,
                  borderBottomWidth: 0.8,
                  borderBottomColor: "#333333",
                  marginBottom: 4,
                }}
              />

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                साक्षीदार
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 8.5,
                  color: "#666666",
                  marginTop: 2,
                }}
              >
                स्वाक्षरी
              </Text>
            </View>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}