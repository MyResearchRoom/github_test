import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import "./fonts";
import React from "react";
import styles from "./billStyle";
import { capitalizeWords } from "../utils/capitalizeWords";
import Header from "./billHeader";
import Footer from "./billFooter";
import { numberToWords } from "../utils/numberToWords";
import { myImg } from "../assets/Images";

export default function DischargeBill({charges,patient,payments,notes,discharge,logo}) {
  
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
              marginTop: 2,
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
              Discharge Summary Bill
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

          <View  
            style={{
              paddingHorizontal: 40,
              marginTop: 16,
              fontSize: 11,
            }}
          >
            {/* ================= ADMISSION DETAILS ================= */}
            <View style={{ marginBottom: 10 }}>
              {/* Main Heading */}
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#1e4d2b",
                  marginBottom: 4,
                }}
              >
                Admission Details
              </Text>

              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 9, marginBottom: 2 }}>
                  Admission No: {discharge?.admission?.admissionNumber || "-"}
                </Text>

                <Text style={{ fontSize: 9, marginBottom: 2 }}>
                  Admission Date:{" "}
                  {discharge?.admission?.admissionDate
                    ? new Date(
                        discharge.admission.admissionDate
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </Text>

                <Text style={{ fontSize: 9, marginBottom: 2 }}>
                  Ward: {discharge?.admission?.ward?.name || "-"}
                </Text>

                <Text style={{ fontSize: 9, marginBottom: 2 }}>
                  Room: {discharge?.admission?.room?.number || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Bed: {discharge?.admission?.bed?.code || "-"}
                </Text>
              </View>
            </View>

            {/* ================= DOCTOR DETAILS ================= */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#1e4d2b",}}>
                Doctor Details
              </Text>

              <View style={{ marginLeft: 12 }}>

                <Text style={{ fontSize: 9 }}>
                  Doctor: {discharge?.doctor?.name || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Doctor ID: {discharge?.doctor?.doctorId || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Department: {discharge?.doctor?.department || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Mobile: {discharge?.doctor?.mobileNumber || "-"}
                </Text>
              </View>
            </View>

            {/* ================= BILLING DETAILS ================= */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold" , color: "#1e4d2b",}}>
                Billing Details
              </Text>

              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 9 }}>
                  Total Amount: Rs.{discharge?.billing?.totalAmount || 0}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Discount: Rs.{discharge?.billing?.discount || 0}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Net Amount: Rs.{discharge?.billing?.netAmount || 0}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Paid Amount: Rs.{discharge?.billing?.paidAmount || 0}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Remaining Amount: Rs.{discharge?.billing?.remainingAmount || 0}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Payment Status: {discharge?.billing?.paymentStatus || "-"}
                </Text>
              </View>
            </View>

            {/* ================= DISCHARGE DETAILS ================= */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: "bold" , color: "#1e4d2b",}}>
                Discharge Details
              </Text>

              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 9 }}>
                  Discharge ID: {discharge?.discharge?.dischargeId || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Discharge Date: {discharge?.discharge?.dischargeDate || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Discharge Time: {discharge?.discharge?.dischargeTime || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Discharge Type: {discharge?.discharge?.dischargeType || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Condition: {discharge?.discharge?.dischargeCondition || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Follow-up Date: {discharge?.discharge?.followUpDate || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Follow-up Instructions:{" "}
                  {discharge?.discharge?.followUpInstructions || "-"}
                </Text>

                <Text style={{ fontSize: 9 }}>
                  Discharge Note: {discharge?.discharge?.dischargeNote || "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* TABLE */}

          {/* charges table */}
          <Text
            style={{
              marginTop: 15,
              marginHorizontal: 40,
              marginBottom: 3,
              fontSize: 12,
              fontWeight: 700,
              color: "#1e4d2b",
            }}
          >
            Charges Details
          </Text>

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

            {charges?.length > 0 ? (
            charges.map((charge, index) => (
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
            ))
            ) : (
              <View
                style={{
                  borderTopWidth: 0.5,
                  borderTopColor: "#4a7a3a",
                  paddingVertical: 6,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                  }}
                >
                  No charges found
                </Text>
              </View>
            )}


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

          {/* payments table */}
          <Text
            style={{
              marginTop: 15,
              marginHorizontal: 40,
              marginBottom: 3,
              fontSize: 12,
              fontWeight: 700,
              color: "#1e4d2b",
            }}
          >
            Payment Details
          </Text>
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
              {/* SR NO */}
              <Text
                style={{
                  width: "8%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 10,
                }}
              >
                Sr. No.
              </Text>

              {/* PAYMENT NUMBER */}
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 10,
                  borderLeftWidth: 0.5,
                  borderLeftColor: "#4a7a3a",
                }}
              >
                Payment Number
              </Text>

              {/* AMOUNT */}
              <Text
                style={{
                  width: "15%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 10,
                  borderLeftWidth: 0.5,
                  borderLeftColor: "#4a7a3a",
                }}
              >
                Amount
              </Text>

              {/* PAYMENT MODE */}
              <Text
                style={{
                  width: "17%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 10,
                  borderLeftWidth: 0.5,
                  borderLeftColor: "#4a7a3a",
                }}
              >
                Payment Mode
              </Text>

              {/* PAYMENT DATE */}
              <Text
                style={{
                  width: "17%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 10,
                  borderLeftWidth: 0.5,
                  borderLeftColor: "#4a7a3a",
                }}
              >
                Payment Date
              </Text>

              {/* REMARKS */}
              <Text
                style={{
                  width: "23%",
                  textAlign: "center",
                  paddingVertical: 4,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 10,
                  borderLeftWidth: 0.5,
                  borderLeftColor: "#4a7a3a",
                }}
              >
                Remarks
              </Text>
            </View>

            {/* PAYMENTS */}
            {payments?.length > 0 ? (
              payments.map((payment, index) => (
                <View
                  key={payment.id}
                  wrap={false}
                  style={{
                    flexDirection: "row",
                    borderTopWidth: 0.5,
                    borderTopColor: "#4a7a3a",
                    minHeight: 21,
                    alignItems: "center",
                  }}
                >
                  {/* SR NO */}
                  <Text
                    style={{
                      width: "8%",
                      textAlign: "center",
                      paddingVertical: 3,
                      fontSize: 9.5,
                    }}
                  >
                    {index + 1}
                  </Text>

                  {/* PAYMENT NUMBER */}
                  <Text
                    style={{
                      width: "20%",
                      textAlign: "center",
                      paddingVertical: 3,
                      paddingHorizontal: 4,
                      fontSize: 9.5,
                      borderLeftWidth: 0.5,
                      borderLeftColor: "#4a7a3a",
                    }}
                  >
                    {payment.paymentNumber || "-"}
                  </Text>

                  {/* AMOUNT */}
                  <Text
                    style={{
                      width: "15%",
                      textAlign: "right",
                      paddingVertical: 3,
                      paddingHorizontal: 5,
                      fontSize: 9.5,
                      borderLeftWidth: 0.5,
                      borderLeftColor: "#4a7a3a",
                    }}
                  >
                    Rs. {Number(payment.amount || 0).toLocaleString("en-IN")}
                  </Text>

                  {/* PAYMENT MODE */}
                  <Text
                    style={{
                      width: "17%",
                      textAlign: "center",
                      paddingVertical: 3,
                      paddingHorizontal: 4,
                      fontSize: 9.5,
                      borderLeftWidth: 0.5,
                      borderLeftColor: "#4a7a3a",
                    }}
                  >
                    {payment.paymentMode
                      ? payment.paymentMode
                          .replace("_", " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : "-"}
                  </Text>

                  {/* PAYMENT DATE */}
                  <Text
                    style={{
                      width: "17%",
                      textAlign: "center",
                      paddingVertical: 3,
                      paddingHorizontal: 4,
                      fontSize: 9.5,
                      borderLeftWidth: 0.5,
                      borderLeftColor: "#4a7a3a",
                    }}
                  >
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString("en-IN")
                      : "-"}
                  </Text>

                  {/* REMARKS */}
                  <Text
                    style={{
                      width: "23%",
                      textAlign: "left",
                      paddingVertical: 3,
                      paddingHorizontal: 5,
                      fontSize: 9.5,
                      borderLeftWidth: 0.5,
                      borderLeftColor: "#4a7a3a",
                    }}
                  >
                    {payment.remarks || "-"}
                  </Text>
                </View>
              ))
            ) : (
              <View
                style={{
                  borderTopWidth: 0.5,
                  borderTopColor: "#4a7a3a",
                  paddingVertical: 6,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                  }}
                >
                  No payments found
                </Text>
              </View>
            )}

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
                Total Paid Amount: Rs.{" "}
                {Number(
                  payments?.reduce(
                    (total, payment) => total + Number(payment.amount || 0),
                    0
                  ) || 0
                ).toLocaleString("en-IN")}
              </Text>
            </View>
          </View>

          {/* NOTES TITLE */}
          <Text
            style={{
              marginTop: 15,
              marginHorizontal: 40,
              marginBottom: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#1e4d2b",
            }}
          >
            Notes
          </Text>

          {/* NOTES */}
          <View
            style={{
              marginHorizontal: 40,
            }}
          >
            {notes?.length > 0 ? (
              notes.map((note, index) => (
                <View
                  key={note.id || index}
                  wrap={false}
                  style={{
                    marginBottom: 10,
                    paddingBottom: 8,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#4a7a3a",
                  }}
                >
                  {/* Heading */}
                  <Text
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      marginBottom: 3,
                    }}
                  >
                    {note.heading || "-"}
                  </Text>

                  {/* Description */}
                  <Text
                    style={{
                      fontSize: 9.5,
                      lineHeight: 1.4,
                      marginBottom: 4,
                    }}
                  >
                    {note.description || "-"}
                  </Text>

                  {/* Doctor + Status + Date */}
                  <Text
                    style={{
                      fontSize: 8.5,
                      color: "#555",
                    }}
                  >
                    Doctor: {note.doctorName || "-"}
                    {"  |  "}
                    Status: {note.status || "-"}
                    {"  |  "}
                    Date: {note.timestamp || note.date || "-"}
                  </Text>
                </View>
              ))
            ) : (
              <Text
                style={{
                  fontSize: 9.5,
                  color: "#555",
                }}
              >
                No notes found
              </Text>
            )}
          </View>

        </View>

        {/* BOTTOM SECTION */}
        <View
          style={{
            marginHorizontal: 40,
            marginTop: 10,
            marginBottom: 0,
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              marginLeft: "auto",
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
        {/* <Footer /> */}
       <View
          fixed
          style={{
            position: "absolute",
            bottom: 15,
            left: 40,
            width: 515, // A4 width 595 - 40 left - 40 right
          }}
        >
          <Footer />
        </View>
      </Page>
    </Document>
  );
}