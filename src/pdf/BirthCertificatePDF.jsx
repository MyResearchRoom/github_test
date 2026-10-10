import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import "./fonts";
import styles from "./billStyle";
import ConsentFormHeader from "./ConsentFormHeader";
import Footer from "./billFooter";
import { capitalizeWords } from "../utils/capitalizeWords";

// Thin decorative border around the page. Set to false if it collides with
// the header/footer graphics.
const SHOW_PAGE_BORDER = true;

const DARK = "#1F2937";
const GRAY = "#4B5563";
const GREEN = "#4a7a3a";
const DOT = "#555555";

// "2026-09-28" -> "28/09/2026" (anything else is shown as-is)
const formatDate = (value) => {
  if (!value) return "";
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(value);
};

const dottedBottom = {
  borderBottomWidth: 0.8,
  borderBottomStyle: "dotted",
  borderBottomColor: DOT,
};

// "Label: ..........." — the dotted line fills the space after the label
const Field = ({ label, value, flex = 1, marginLeft = 0 }) => (
  <View
    style={{
      flex,
      flexDirection: "row",
      alignItems: "flex-end",
      marginLeft,
    }}
  >
    <Text style={{ fontSize: 9.5, color: DARK }}>{label}</Text>

    <View
      style={{
        flex: 1,
        minHeight: 15,
        marginLeft: 3,
        paddingLeft: 3,
        justifyContent: "flex-end",
        ...dottedBottom,
      }}
    >
      <Text style={{ fontSize: 10, color: DARK }}>{value || ""}</Text>
    </View>
  </View>
);

const Row = ({ children, marginBottom = 20 }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom,
    }}
  >
    {children}
  </View>
);

// Label + first dotted line (holds the value) + one extra empty dotted line
const AddressBlock = ({ label, value }) => (
  <View style={{ marginBottom: 30 }}>
    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
      <Text style={{ fontSize: 9.5, color: DARK }}>{label}</Text>

      <View
        style={{
          flex: 1,
          minHeight: 16,
          marginLeft: 3,
          paddingLeft: 3,
          justifyContent: "flex-end",
          ...dottedBottom,
        }}
      >
        <Text style={{ fontSize: 10, color: DARK }}>{value || ""}</Text>
      </View>
    </View>

    <View style={{ height: 28, ...dottedBottom }} />
  </View>
);

export default function BirthCertificatePDF({ patient, certificate, logo }) {
  const c = certificate || {};

  const dateTimeOfBirth = [c.dateOfBirth, c.timeOfBirth]
    .filter(Boolean)
    .join(", ");

  const presentAddress =
    c.parentsAddress || "";

  const permanentAddress = c.permanentAddress;

  return (
    <Document>
      <Page
        size="A4"
        style={[
          styles.page,
          {
            paddingTop: 112,
            paddingBottom: 40,
          },
        ]}
      >

        {SHOW_PAGE_BORDER && (
          <View
            fixed
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
            //   borderWidth: 1.2,
            //   borderColor: "#9DBF90",
            }}
          />
        )}


        {logo && <Image src={logo} style={styles.watermark} fixed />}

        <ConsentFormHeader
          logo={logo}
          mobileNumber={c.mobileNumber || "9091905353"}
        />

        {/* ================= BODY ================= */}
        <View style={{ marginHorizontal: 44, marginTop: 6,}}>
          {/* TITLE (rounded box) */}
          <View style={{ alignItems: "center", marginBottom: 26 }}>
            <View
              style={{
                borderWidth: 0.8,
                borderColor: GREEN,
                borderRadius: 16,
                paddingVertical: 5,
                paddingHorizontal: 36,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1F3D1A",
                }}
              >
                Birth Certificate
              </Text>
            </View>
          </View>

          {/* Newborn ID / Blood Group / SL No */}
          <Row >
            <Field label="Newborn ID No.:" value={c.newbornId} flex={1.1} />
            <Field
              label="Bl. Group:"
              value={c.bloodGroup}
              flex={1.1}
              marginLeft={14}
            />
            <Field
              label="Certificate. No.:"
              value={c.certificateNO}
              flex={1.1}
              marginLeft={14}
            />
          </Row>

          {/* Name / Sex */}
          <Row>
            <Field
              label="Name:"
              value={capitalizeWords(c.childName || "")}
              flex={2.2}
            />
            <Field label="Sex:" value={c.sex} flex={1} marginLeft={14} />
          </Row>

          {/* Date & Time of Birth / Mother's ID */}
          <Row>
            <Field
              label="Date & Time of Birth:"
              value={dateTimeOfBirth}
              flex={1.6}
            />
            <Field
              label="Mother's ID No.:"
              value={c.motherIdNo}
              flex={1.2}
              marginLeft={14}
            />
          </Row>

          {/* Mother */}
          <Row>
            <Field
              label="Mother's Name:"
              value={capitalizeWords(c.motherName)}
            />
          </Row>

          <Row>
            <Field label="Nationality:" value={capitalizeWords(c.motherNationality)} />
            <Field
              label="Religion:"
              value={capitalizeWords(c.motherReligion)}
              marginLeft={14}
            />
          </Row>

          {/* Father */}
          <Row>
            <Field
              label="Father's Name:"
              value={capitalizeWords(c.fatherName || "")}
            />
          </Row>

          <Row>
            <Field label="Nationality:" value={capitalizeWords(c.fatherNationality)} />
            <Field
              label="Religion:"
              value={capitalizeWords(c.fatherReligion)}
              marginLeft={14}
            />
          </Row>

          {/* Addresses */}
          <AddressBlock label="Present Address:" value={presentAddress} />
          <AddressBlock label="Permanent Address:" value={permanentAddress} />

          {/* ================= ISSUED BY + SIGNATURE ================= */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 40,
            }}
          >
            {/* Certificate Issued By */}
            <View style={{ width: "38%", alignItems: "center" }}>
              <View
                style={{
                  height: 48,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                
              </View>

              <View
                style={{
                  width: "100%",
                  borderTopWidth: 0.8,
                  borderTopStyle: "dotted",
                  borderTopColor: DOT,
                  paddingTop: 3,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 8.8, color: GRAY }}>
                  Certificate Issued By
                </Text>
              </View>
            </View>

            {/* Signature of the Authority */}
            <View style={{ width: "38%", alignItems: "center" }}>
              <View
                style={{
                  height: 48,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                
              </View>

              <View
                style={{
                  width: "100%",
                  borderTopWidth: 0.8,
                  borderTopStyle: "dotted",
                  borderTopColor: DOT,
                  paddingTop: 3,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 8.8, color: GRAY }}>
                  Signature of the Authority
                </Text>
              </View>
            </View>
          </View>

          {/* Date of Issue */}
          <View style={{ width: "50%", marginTop: 60 }}>
            <Field
              label="Date of Issue:"
              value={formatDate(c.certificateIssueDate)}
            />
          </View>
        </View>

        {/* FOOTER */}
        <Footer text="Issued by Krishna ICU & Multi-speciality Hospital" showDateTime={false}/>
      </Page>
    </Document>
  );
}