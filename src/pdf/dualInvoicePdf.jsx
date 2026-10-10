// DualInvoicePDF.jsx
import { Document, Page, View, Text } from "@react-pdf/renderer";
import "./fonts";
import styles from "./newbillStyle";
import DualInvoiceHeader from "./dualInvoiceHeader";
import DualInvoiceFooter from "./dualInvoiceFooter";
import DualInvoiceBody from "./dualInvoiceBody";
import { Svg, Circle, Path } from "@react-pdf/renderer";

function ScissorIcon({ size = 8, color = "#666666" }) {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Circle
        cx="6"
        cy="6"
        r="3"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Circle
        cx="6"
        cy="18"
        r="3"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M8.5 8.5 L20 19.5"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      <Path
        d="M8.5 15.5 L20 4.5"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
    </Svg>
  );
}

export default function DualInvoicePDF({data,logo}) {
  // console.log("data", data);
  
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page} wrap={false}>
        <View style={styles.outerBorder}>
          <View style={styles.row}>
            {/* LEFT HALF - Hospital Copy */}
            <View style={styles.halfColumn}>
              <DualInvoiceHeader copyLabel="HOSPITAL COPY" logo={logo} />
              <DualInvoiceBody printData={data} copy="hospital" logo={logo}/>
              <DualInvoiceFooter />
            </View>

            {/* CUT GUTTER */}
            <View style={styles.gutter}>
              <View style={styles.dashedLine} />
              <View style={[styles.scissorMark, styles.scissorTop]}>
                <ScissorIcon size={9} color="#666666" />
              </View>
              <View style={[styles.scissorMark, styles.scissorBottom]}>
                <ScissorIcon size={9} color="#666666" />
              </View>
            </View>

            {/* RIGHT HALF - Customer Copy */}
            <View style={styles.halfColumn}>
              <DualInvoiceHeader copyLabel="CUSTOMER COPY" logo={logo}/>
              <DualInvoiceBody printData={data} copy="customer" logo={logo}/>
              <DualInvoiceFooter />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}


