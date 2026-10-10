import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import "./fonts";
import styles from "./billStyle";
import { capitalizeWords } from "../utils/capitalizeWords";
import Header from "./billHeader";
import Footer from "./billFooter";
import { numberToWords } from "../utils/numberToWords";
import { myImg } from "../assets/Images";

export default function FinalBill({charges,patient,logo}) {

  const doctor = {
    name: "Dr. John Smith",
    // logo: myImg.logo,
    logo:logo,
    clinicAddress:
      "वसंतराव नाईक पुतळ्या जवळ,\nवसमत रोड, परभणी, महाराष्ट्र. ४३१४०१",
    mobileNumber: "9876543210",
  };

  const totalAmount = charges.reduce(
    (total, charge) => total + Number(charge.totalAmount || 0),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* WATERMARK */}
        {doctor?.logo && (
          <Image src={doctor.logo} style={styles.watermark} fixed />
        )}

        {/* HEADER */}
        <Header doctor={doctor} />

        {/* MAIN CONTENT */}
        <View style={{ flexGrow: 1 }}>
          {/* PATIENT / BILL INFORMATION */}
          <View
            style={{
              paddingHorizontal: 40,
              marginTop: 8,
              fontSize: 11,
            }}
          >
            {/* DATE */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 8,
              }}
            >
              <Text>Date :</Text>

              <Text
                style={{
                  width: 70,
                  marginLeft: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  paddingBottom: 1,
                }}
              >
                {new Date().toLocaleDateString("en-IN")}
              </Text>
            </View>

            {/* TITLE */}
            <Text
              style={{
                fontSize: 15,
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Final Bill
            </Text>

            {/* NAME */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 7,
              }}
            >
              <Text>Name :</Text>

              <Text
                style={{
                  flex: 1,
                  marginLeft: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  paddingBottom: 1,
                }}
              >
                {capitalizeWords(patient?.name || "")}
              </Text>
            </View>

            {/* ID / BLOOD GROUP / DOB */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 7,
                alignItems: "center",
              }}
            >
              <Text>ID :</Text>

              <Text
                style={{
                  flex: 0.8,
                  marginLeft: 4,
                  marginRight: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  paddingBottom: 1,
                }}
              >
                {patient?.patientId || ""}
              </Text>

              <Text>Blood Group :</Text>

              <Text
                style={{
                  flex: 0.55,
                  marginLeft: 4,
                  marginRight: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  paddingBottom: 1,
                }}
              >
                {patient?.bloodGroup || "-"}
              </Text>

              <Text>D.O.B :</Text>

              <Text
                style={{
                  flex: 0.75,
                  marginLeft: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  paddingBottom: 1,
                }}
              >
                {patient?.dateOfBirth || ""}
              </Text>
            </View>

            {/* MOBILE */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 7,
              }}
            >
              <Text>Mobile :</Text>

              <Text
                style={{
                  flex: 1,
                  marginLeft: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  paddingBottom: 1,
                }}
              >
                {patient?.mobileNumber || ""}
              </Text>
            </View>

            {/* ADDRESS */}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text>Address :</Text>

              <Text
                style={{
                  flex: 1,
                  marginLeft: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  paddingBottom: 1,
                }}
              >
                {patient?.address || ""}
              </Text>
            </View>
          </View>

          {/* TABLE */}
          <View
            style={{
              marginTop: 15,
              marginHorizontal: 40,
              borderWidth: 1,
              borderColor: "#4a7a3a",
            }}
          >
            {/* TABLE HEADER */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#e8f0dc",
                minHeight: 24,
                alignItems: "center",
              }}
              wrap={false}
            >
              <Text
                style={{
                  width: "10%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                No
              </Text>

              <Text
                style={{
                  width: "60%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 11,
                  borderLeftWidth: 0.5,
                  borderLeftColor: "#4a7a3a",
                  borderRightWidth: 0.5,
                  borderRightColor: "#4a7a3a",
                }}
              >
                Particular Charges
              </Text>

              <Text
                style={{
                  width: "30%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                Amount
              </Text>
            </View>

            {/* CHARGES */}
            {charges.map((charge, index) => (
              <View
                key={charge.id}
                wrap={false}
                style={{
                  flexDirection: "row",
                  borderTopWidth: 0.5,
                  borderTopColor: "#4a7a3a",
                  minHeight: 21,
                  alignItems: "center",
                }}
              >
                {/* NUMBER */}
                <Text
                  style={{
                    width: "10%",
                    textAlign: "center",
                    paddingVertical: 3,
                    fontSize: 10.5,
                  }}
                >
                  {index + 1}
                </Text>

                {/* PARTICULAR */}
                <Text
                  style={{
                    width: "60%",
                    textAlign: "left",
                    paddingVertical: 3,
                    paddingHorizontal: 6,
                    fontSize: 10.5,
                    borderLeftWidth: 0.5,
                    borderLeftColor: "#4a7a3a",
                    borderRightWidth: 0.5,
                    borderRightColor: "#4a7a3a",
                  }}
                >
                  {charge.chargeName}
                </Text>

                {/* AMOUNT */}
                <Text
                  style={{
                    width: "30%",
                    textAlign: "right",
                    paddingVertical: 3,
                    paddingHorizontal: 7,
                    fontSize: 10.5,
                  }}
                >
                  Rs. {Number(charge.totalAmount || 0).toLocaleString("en-IN")}
                </Text>
              </View>
            ))}

            {/* TOTAL */}
            <View
              wrap={false}
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                borderTopWidth: 1,
                borderTopColor: "#4a7a3a",
                backgroundColor: "#e8f0dc",
                paddingVertical: 5,
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                Total Amount: Rs.{" "}
                {Number(totalAmount).toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        </View>

        {/* BOTTOM SECTION */}
        <View
          style={{
            marginHorizontal: 40,
            marginTop: 12,
            marginBottom: 35,
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {/* RUPEES IN WORDS */}
          <View
            style={{
              flex: 0.8,
              paddingRight: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 10.5,
                }}
              >
                Rupees in words:
              </Text>

              <Text
                style={{
                  flex: 1,
                  marginLeft: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  paddingBottom: 1,
                  fontSize: 10.5,
                }}
              >
                {numberToWords(totalAmount)}
              </Text>
            </View>
          </View>

          {/* SIGNATURE */}
          <View
            style={{
              flex: 0.2,
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Sign.
            </Text>
          </View>
        </View>

        {/* FOOTER */}
        <Footer />
      </Page>
    </Document>
  );
}