import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";

import "./fonts";
import styles from "./billStyle";
import ConsentFormHeader from "./ConsentFormHeader";
import Footer from "./billFooter";

export default function ICUConsentFormPDF({
  patient,
  consent,
  logo,
  mobileNumber = "9091905353",
}) {
  const labelStyle = {
    fontFamily: "NotoSansDevanagari",
    fontSize: 9,
    fontWeight: 700,
    color: "#333333",
  };

  const valueStyle = {
    fontFamily: "NotoSansDevanagari",
    fontSize: 9.2,
    color: "#222222",
  };

  const sectionStyle = {
    borderWidth: 0.8,
    borderColor: "#4a7a3a",
    marginBottom: 9,
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
    fontSize: 9.8,
    fontWeight: 700,
    color: "#2f5425",
  };

  const fieldRowStyle = {
    flexDirection: "row",
    alignItems: "flex-end",
    minHeight: 22,
  };

  const valueCellStyle = {
    flex: 1,
    minHeight: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#777777",
    justifyContent: "flex-end",
    paddingBottom: 2,
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
          mobileNumber={mobileNumber}
        />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 38,
            marginTop: 7,
            paddingBottom: 5,
          }}
        >
          {/* Title */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 9,
            }}
          >
            <Text
              style={{
                fontFamily: "NotoSansDevanagari",
                fontSize: 15,
                fontWeight: 700,
                color: "#222222",
              }}
            >
              अतिदक्षता विभाग संमतीपत्र
            </Text>

            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                marginTop: -15,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSansDevanagari",
                  fontSize: 8.5,
                }}
              >
                दिनांक : {new Date().toLocaleDateString("en-IN")}
              </Text>
            </View>
          </View>

          {/* Patient Details */}
          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>
                रुग्णाची माहिती
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 9,
                paddingVertical: 7,
              }}
            >
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
                  <View style={fieldRowStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 42,
                      }}
                    >
                      नाव :
                    </Text>

                    <View style={valueCellStyle}>
                      <Text style={valueStyle}>
                        {patient?.name || ""}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: "42%",
                  }}
                >
                  <View style={fieldRowStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 78,
                      }}
                    >
                      रुग्ण क्रमांक :
                    </Text>

                    <View style={valueCellStyle}>
                      <Text style={valueStyle}>
                        {patient?.patientId || ""}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: "25%",
                    paddingRight: 9,
                  }}
                >
                  <View style={fieldRowStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 38,
                      }}
                    >
                      वय :
                    </Text>

                    <View style={valueCellStyle}>
                      <Text style={valueStyle}>
                        {patient?.age || ""}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: "25%",
                    paddingRight: 9,
                  }}
                >
                  <View style={fieldRowStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 42,
                      }}
                    >
                      लिंग :
                    </Text>

                    <View style={valueCellStyle}>
                      <Text style={valueStyle}>
                        {patient?.gender || ""}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: "25%",
                    paddingRight: 9,
                  }}
                >
                  <View style={fieldRowStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 59,
                      }}
                    >
                      रक्तगट :
                    </Text>

                    <View style={valueCellStyle}>
                      <Text style={valueStyle}>
                        {patient?.bloodGroup || ""}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: "25%",
                  }}
                >
                  <View style={fieldRowStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 50,
                      }}
                    >
                      IPD क्र. :
                    </Text>

                    <View style={valueCellStyle}>
                      <Text style={valueStyle}>
                        {consent?.ipdNumber || ""}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={fieldRowStyle}>
                <Text
                  style={{
                    ...labelStyle,
                    width: 78,
                  }}
                >
                  ICU बेड :
                </Text>

                <View style={valueCellStyle}>
                  <Text style={valueStyle}>
                    {consent?.wardBed || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ICU Details */}
          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>
                अतिदक्षता विभाग उपचाराचा तपशील
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 9,
                paddingVertical: 7,
              }}
            >
              <View
                style={{
                  ...fieldRowStyle,
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    ...labelStyle,
                    width: 125,
                  }}
                >
                  आजार / वैद्यकीय स्थिती :
                </Text>

                <View style={valueCellStyle}>
                  <Text style={valueStyle}>
                    {consent?.diagnosis || ""}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  ...fieldRowStyle,
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    ...labelStyle,
                    width: 125,
                  }}
                >
                  ICU मध्ये दाखल करण्याचे कारण :
                </Text>

                <View style={valueCellStyle} />
              </View>

              <View style={fieldRowStyle}>
                <Text
                  style={{
                    ...labelStyle,
                    width: 125,
                  }}
                >
                  प्रस्तावित उपचार / काळजी :
                </Text>

                <View style={valueCellStyle} />
              </View>
            </View>
          </View>

          {/* Declaration */}
          <View style={{ marginBottom: 9 }}>
            <Text
              style={{
                ...sectionTitleStyle,
                marginBottom: 5,
              }}
            >
              संमती घोषणा
            </Text>

            <View
              style={{
                borderWidth: 0.7,
                borderColor: "#c8c8c8",
                paddingHorizontal: 9,
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSansDevanagari",
                  fontSize: 9,
                  lineHeight: 1.5,
                  color: "#333333",
                  textAlign: "justify",
                }}
              >
                रुग्णाच्या आजाराची व सध्याच्या वैद्यकीय स्थितीची माहिती,
                अतिदक्षता विभागात उपचार व निरीक्षणाची आवश्यकता,
                प्रस्तावित उपचार, संभाव्य धोके व उपलब्ध पर्याय याबाबत
                डॉक्टरांनी मला माझ्या समजण्यास योग्य भाषेत माहिती दिली
                आहे. मला आवश्यक प्रश्न विचारण्याची संधी मिळाली असून
                माझ्या प्रश्नांची समाधानकारक उत्तरे मिळाली आहेत.
                रुग्णाच्या उपचारासाठी आवश्यक वैद्यकीय उपाययोजना
                करण्यास मी स्वेच्छेने संमती देत आहे.
              </Text>
            </View>
          </View>

          {/* Consent Given By */}
          <View style={sectionStyle}>
            <View style={sectionHeaderStyle}>
              <Text style={sectionTitleStyle}>
                संमती देणारी व्यक्ती
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 9,
                paddingVertical: 7,
              }}
            >
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
                  <View style={fieldRowStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 42,
                      }}
                    >
                      नाव :
                    </Text>

                    <View style={valueCellStyle} />
                  </View>
                </View>

                <View
                  style={{
                    width: "45%",
                  }}
                >
                  <View style={fieldRowStyle}>
                    <Text
                      style={{
                        ...labelStyle,
                        width: 52,
                      }}
                    >
                      नाते :
                    </Text>

                    <View style={valueCellStyle} />
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    ...labelStyle,
                    width: 92,
                  }}
                >
                  संमती देणारे :
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "NotoSansDevanagari",
                      fontSize: 9,
                    }}
                  >
                    ☐ रुग्ण
                  </Text>

                  <Text
                    style={{
                      fontFamily: "NotoSansDevanagari",
                      fontSize: 9,
                    }}
                  >
                    ☐ पालक / संरक्षक
                  </Text>

                  <Text
                    style={{
                      fontFamily: "NotoSansDevanagari",
                      fontSize: 9,
                    }}
                  >
                    ☐ प्रतिनिधी
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Signatures */}
          <View
            style={{
              borderWidth: 0.8,
              borderColor: "#4a7a3a",
              paddingHorizontal: 9,
              paddingVertical: 9,
              minHeight: 95,
            }}
          >
            <Text
              style={{
                ...sectionTitleStyle,
                marginBottom: 9,
              }}
            >
              स्वाक्षरी
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 28,
                    borderBottomWidth: 0.7,
                    borderBottomColor: "#444444",
                    marginBottom: 5,
                  }}
                />

                <Text style={labelStyle}>
                  रुग्ण / प्रतिनिधी
                </Text>

                <Text
                  style={{
                    fontFamily: "NotoSansDevanagari",
                    fontSize: 8,
                    color: "#666666",
                    marginTop: 2,
                  }}
                >
                  स्वाक्षरी
                </Text>
              </View>

              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 28,
                    borderBottomWidth: 0.7,
                    borderBottomColor: "#444444",
                    marginBottom: 5,
                  }}
                />

                <Text style={labelStyle}>
                  डॉक्टर
                </Text>

                <Text
                  style={{
                    fontFamily: "NotoSansDevanagari",
                    fontSize: 8,
                    color: "#666666",
                    marginTop: 2,
                  }}
                >
                  स्वाक्षरी
                </Text>
              </View>

              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 28,
                    borderBottomWidth: 0.7,
                    borderBottomColor: "#444444",
                    marginBottom: 5,
                  }}
                />

                <Text style={labelStyle}>
                  साक्षीदार
                </Text>

                <Text
                  style={{
                    fontFamily: "NotoSansDevanagari",
                    fontSize: 8,
                    color: "#666666",
                    marginTop: 2,
                  }}
                >
                  स्वाक्षरी
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}