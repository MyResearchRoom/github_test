// HospitalBody.jsx
import { View, Text, Image } from "@react-pdf/renderer";
import styles from "./newbillStyle";
import { myImg } from "../assets/Images";
import { numberToWords } from "../utils/numberToWords";

export const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


const formatCurrency = (amount) =>
  `${Number(amount || 0).toLocaleString("en-IN")}`;

export default function DualInvoiceBody({printData,copy,logo}) {
  const data=printData
  // console.log("body");
  
  return (
    <View style={styles.bodyContainer}>
      {/* Watermark */}
      <Image src={logo} style={styles.watermark} />

      {/* PATIENT DETAILS */}
      <View style={styles.card}>
        <View style={styles.cardTitleBadge}>
          <Text style={styles.cardTitleText}>PATIENT DETAILS</Text>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.col50}>
            <Text style={styles.label}>Patient ID</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.patientId}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.name}</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.col50}>
            <Text style={styles.label}>Age / Gender</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.age} / {data.gender}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Mobile</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.mobileNumber}</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.col100}>
            <Text style={styles.labelLong}>Address</Text>
            <Text style={styles.colonLong}>:</Text>
            <Text style={styles.valueLong}>{data.address}</Text>
          </View>
        </View>

        {/* <View style={styles.gridRowLast}>
          <View style={styles.col50}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>20-05-2024</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>11:30 AM</Text>
          </View>
        </View> */}
      </View>

      {/* CONSULTATION DETAILS */}
      <View style={styles.card}>
        <View style={styles.cardTitleBadge}>
          <Text style={styles.cardTitleText}>CONSULTATION DETAILS</Text>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.col50}>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.doctorDepartment}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Doctor</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.doctorName}</Text>
          </View>
        </View>

        <View style={styles.gridRowLast}>
          <View style={styles.col50}>
            <Text style={styles.label}>Consultation Type</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>IPD</Text>
          </View>
          {/* <View style={styles.col50}>
            <Text style={styles.label}>Fees</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.valueBold}>Rs. 500.00 /-</Text>
          </View> */}
        </View>
      </View>

      {/* PAYMENT DETAILS */}
      <View style={styles.card}>
        <View style={styles.cardTitleBadge}>
          <Text style={styles.cardTitleText}>PAYMENT DETAILS</Text>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.col50}>
            <Text style={styles.label}>Payment Mode</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.paymentMode}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Receipt No.</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.paymentNumber}</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.col50}>
            <Text style={styles.label}>Amount Paid</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.valueBold}>Rs.{formatCurrency(data.amount)}-/-</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>
              {formatDateTime(data.paymentDate)}
            </Text>
          </View>
        </View>

        <View style={styles.gridRowLast}>
          <View style={styles.col100}>
            <Text style={styles.labelLong}>In Words</Text>
            <Text style={styles.colonLong}>:</Text>
            <Text style={styles.valueLong}>{numberToWords(data.amount)}</Text>
          </View>
        </View>
      </View>

      {/* NOTES + SIGNATURE */}
      <View style={styles.notesRow}>
        <View style={styles.notesBlock}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesLine}>•  Please keep this receipt for {copy} records.</Text>
          <Text style={styles.notesLine}>•  This is not valid for income tax purpose.</Text>
        </View>

        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Authorised Signatory</Text>
        </View>
      </View>
    </View>
  );
}