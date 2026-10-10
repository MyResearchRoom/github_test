// HospitalFooter.jsx
import { View, Text } from "@react-pdf/renderer";
import { BottomRightSwoosh } from "./newSwooshCurve";
import styles from "./newbillStyle";
import { getFormattedDateTime } from "../utils/getFormattedDateTime";

export default function DualInvoiceFooter() {
  // console.log("footer");
  return (
    <View style={styles.footerWrapper}>
      <View style={styles.footerTextBlock}>
        <Text style={styles.footerThankYou}>Thank You!</Text>
        <Text style={styles.footerWish}>We wish you a speedy recovery.</Text>
      
      </View>

      <BottomRightSwoosh />
      <Text style={styles.footerWish2}>This is a system generated bill - {getFormattedDateTime()}</Text>
    </View>
  );
}