import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import "./fonts";

import styles from "./billStyle";
import ConsentFormHeader from "./ConsentFormHeader";
import Footer from "./billFooter";

export default function DAMAFormPDF({
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

        <ConsentFormHeader
          logo={logo}
          mobileNumber={mobileNumber}
        />

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
                वैद्यकीय सल्ल्याविरुद्ध रुग्णालयातून सुट्टी
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
                DAMA
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
                रुग्ण / नातेवाईकांची घोषणा
              </Text>
            </View>
          </View>

          {/* ================= DECLARATION ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>
                DAMA बाबत रुग्ण / नातेवाईकांची घोषणा
              </Text>
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
                रुग्ण ________________________________________ यांचा
                (स्वतः / नातेवाईक / कायदेशीर पालक या नात्याने) हे घोषित
                करतो / करते की,
              </Text>

              <View style={{ height: 6 }} />

              {/* Paragraph 1 */}

              <Text style={textStyle}>
                रुग्णाच्या आजाराची, सध्याच्या वैद्यकीय स्थितीची व आवश्यक
                उपचारांची माहिती मला डॉक्टरांनी माझ्या समजण्यास योग्य
                भाषेत दिली आहे. रुग्णालयात पुढील उपचार घेणे / निरीक्षणाखाली
                राहणे आवश्यक असल्याचे डॉक्टरांनी मला स्पष्टपणे सांगितले आहे.
                रुग्णालयातून वैद्यकीय सल्ल्याविरुद्ध घरी जाण्यामुळे रुग्णाच्या
                प्रकृतीत बिघाड होऊ शकतो, आजार वाढू शकतो किंवा गंभीर गुंतागुंत,
                कायमस्वरूपी अपंगत्व अथवा मृत्यू होण्याची शक्यता असू शकते,
                याची मला माहिती देण्यात आली आहे.
              </Text>

              <View style={{ height: 6 }} />

              {/* Paragraph 2 */}

              <Text style={textStyle}>
                  डॉक्टरांनी रुग्णालयात राहण्याचा व उपचार सुरू ठेवण्याचा सल्ला
                दिलेला असूनही, माझ्या स्वतःच्या इच्छेने / रुग्णाच्या इच्छेने
                रुग्णालयातून डिस्चार्ज घेण्याचा निर्णय घेत आहे / आहोत.
                डॉक्टरांनी माझ्या प्रश्नांची उत्तरे दिली असून मला आवश्यक
                माहिती समजावून सांगितली आहे.
              </Text>

              <View style={{ height: 6 }} />

              {/* Paragraph 3 */}

              <Text style={textStyle}>
                रुग्णालयातून बाहेर पडल्यानंतर रुग्णाच्या प्रकृतीत होणाऱ्या
                बदलांची जबाबदारी माझी / आमची राहील, तसेच आवश्यकतेनुसार
                पुढील वैद्यकीय उपचार घेणे ही माझी / आमची जबाबदारी आहे.
                वरील सर्व माहिती मला समजली असून, कोणत्याही दबावाशिवाय
                मी / आम्ही DAMA घेण्यास स्वेच्छेने संमती देत आहे / आहोत.
              </Text>
            </View>
          </View>

          {/* ================= PATIENT / RELATIVE DETAILS ================= */}

          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>
                रुग्ण व नातेवाईकांची माहिती
              </Text>
            </View>

            <View
              style={{
                padding: 9,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {/* LEFT COLUMN */}

              <View
                style={{
                  width: "48%",
                  paddingRight: 6,
                }}
              >
                {/* Patient Name */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <Text style={labelStyle}>
                    पेशंटचे नाव :
                  </Text>

                  <View style={lineStyle}>
                    <Text
                      style={{
                        fontFamily: "NotoSansDevanagari",
                        fontSize: 9.2,
                      }}
                    >
                      {patient?.name || ""}
                    </Text>
                  </View>
                </View>

                {/* Age */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <Text style={labelStyle}>
                    वय :
                  </Text>

                  <View style={lineStyle} >
                    <Text
                      style={{
                        fontFamily: "NotoSansDevanagari",
                        fontSize: 9.2,
                      }}
                    >
                      {patient?.age || ""}
                    </Text>
                  </View>
                </View>

                {/* Signature */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <Text style={labelStyle}>
                    सही :
                  </Text>

                  <View style={lineStyle} />
                </View>

                {/* Thumb */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={labelStyle}>
                    अंगठा :
                  </Text>

                  <View style={lineStyle} />
                </View>
              </View>

              {/* RIGHT COLUMN */}

              <View
                style={{
                  width: "48%",
                  paddingLeft: 6,
                }}
              >
                {/* Relative Name */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <Text style={labelStyle}>
                    नातेवाईकांचे नाव :
                  </Text>

                  <View style={lineStyle} />
                </View>

                {/* Relationship */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <Text style={labelStyle}>
                    नाते :
                  </Text>

                  <View style={lineStyle} />
                </View>

                {/* Age */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <Text style={labelStyle}>
                    वय :
                  </Text>

                  <View style={lineStyle} />
                </View>

                {/* Signature */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <Text style={labelStyle}>
                    सही :
                  </Text>

                  <View style={lineStyle} />
                </View>

                {/* Thumb */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={labelStyle}>
                    अंगठा :
                  </Text>

                  <View style={lineStyle} />
                </View>
              </View>
            </View>
          </View>

          {/* ================= FINAL ACKNOWLEDGEMENT ================= */}

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
              {/* Patient / Relative acknowledgement */}

              <View
                style={{
                  width: "45%",
                }}
              >
                <Text style={labelStyle}>
                  रुग्ण / नातेवाईकाची स्वाक्षरी
                </Text>

                <View
                  style={{
                    height: 30,
                    borderBottomWidth: 0.6,
                    borderBottomColor: "#555555",
                    marginTop: 5,
                  }}
                />
              </View>

              {/* Date */}

              <View
                style={{
                  width: "25%",
                }}
              >
                <Text style={labelStyle}>
                  दिनांक :
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
            </View>
          </View>
        </View>

        {/* ================= FOOTER ================= */}

        <Footer />
      </Page>
    </Document>
  );
}