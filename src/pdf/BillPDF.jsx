import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import "./fonts";
import React from "react";
import styles from "./billStyle";
import { capitalizeWords } from "../utils/capitalizeWords";
import Header from "./billHeader";
import Footer from "./billFooter";
import { numberToWords } from "../utils/numberToWords";

export default function BillPDF({ doctor, patient, appointment }) {
  const totalAmount =
    Number(appointment.fees || 0) + Number(appointment.extraFees || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {doctor?.logo && (
          <Image src={doctor.logo} style={styles.watermark} fixed />
        )}

        <Header doctor={doctor} />

        <View style={{ paddingHorizontal: 40, marginTop: 25, fontSize: 14 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 20,
            }}
          >
            <Text>Date :</Text>
            <Text
              style={{
                width: 75,
                marginLeft: 4,
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                borderBottomStyle: "solid",
                paddingBottom: 1,
              }}
            >
              {appointment?.date?.slice(0, 10) || ""}
            </Text>
          </View>

          <View>
            <Text
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Invoice / Bill
          </Text>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 10 }}>
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

          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <Text>ID :</Text>
            <Text
              style={{
                flex: 0.7,
                marginLeft: 4,
                marginRight: 14,
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
                flex: 0.6,
                marginLeft: 4,
                marginRight: 14,
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
                flex: 0.8,
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

          <View style={{ flexDirection: "row", marginBottom: 10 }}>
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

          <View style={{ flexDirection: "row" }}>
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

        <View
          style={{
            marginTop: 30,
            marginHorizontal: 40,
            borderWidth: 1,
            borderColor: "#4a7a3a",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "#1e4d2b",
            }}
          >
            <Text
              style={{
                width: "10%",
                textAlign: "center",
                padding: 6,
                color: "#000",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              No
            </Text>
            <Text
              style={{
                width: "60%",
                textAlign: "center",
                padding: 6,
                color: "#000",
                fontWeight: 700,
                fontSize: 14,
                borderLeftWidth: 0.5,
                borderLeftColor: "#4a7a3a",
                borderRightWidth: 0.5,
                borderRightColor: "#4a7a3a",
              }}
            >
              Particular
            </Text>
            <Text
              style={{
                width: "30%",
                textAlign: "center",
                padding: 6,
                color: "#000",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Amount
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderTopWidth: 0.5,
              borderTopColor: "#4a7a3a",
            }}
          >
            <Text
              style={{
                width: "10%",
                textAlign: "center",
                padding: 6,
                fontSize: 14,
              }}
            >
              1
            </Text>
            <Text
              style={{
                width: "60%",
                textAlign: "center",
                padding: 6,
                fontSize: 14,
                borderLeftWidth: 0.5,
                borderLeftColor: "#4a7a3a",
                borderRightWidth: 0.5,
                borderRightColor: "#4a7a3a",
              }}
            >
              {appointment?.reason || "Followup"}
            </Text>
            <Text
              style={{
                width: "30%",
                textAlign: "center",
                padding: 6,
                fontSize: 14,
              }}
            >
              Rs.{appointment?.fees || 0}
            </Text>
          </View>

          {appointment?.extraFees > 0 && (
            <View
              style={{
                flexDirection: "row",
                borderTopWidth: 0.5,
                borderTopColor: "#4a7a3a",
              }}
            >
              <Text
                style={{
                  width: "10%",
                  textAlign: "center",
                  padding: 6,
                  fontSize: 14,
                }}
              >
                2
              </Text>
              <Text
                style={{
                  width: "60%",
                  textAlign: "center",
                  padding: 6,
                  fontSize: 14,
                  borderLeftWidth: 0.5,
                  borderLeftColor: "#4a7a3a",
                  borderRightWidth: 0.5,
                  borderRightColor: "#4a7a3a",
                }}
              >
                Extra Charges
              </Text>
              <Text
                style={{
                  width: "30%",
                  textAlign: "center",
                  padding: 6,
                  fontSize: 14,
                }}
              >
                Rs.{appointment?.extraFees}
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              borderTopWidth: 1,
              borderTopColor: "#4a7a3a",
              backgroundColor: "#e8f0dc",
              padding: 6,
            }}
          >
            <Text style={{ fontWeight: 700, fontSize: 14 }}>
              Total Amount: Rs.{totalAmount}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            marginHorizontal: 40,
            fontSize: 14,
          }}
        >
          <View style={{ flex: 0.75 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 14}}>Rupees in words </Text>
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
                {numberToWords(totalAmount)}
              </Text>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                borderBottomStyle: "solid",
                marginTop: 8,
                paddingBottom: 1,
              }}
            >
              <Text> </Text>
            </View>
          </View>

         
        </View>


        <View
          style={{
            flex: 0.25,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginHorizontal: 40,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 700 }}>Sign.</Text>
        </View>

        <Footer text="This is a system generated certificate"/>
      </Page>
    </Document>
  );
}
