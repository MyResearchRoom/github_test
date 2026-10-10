// import "./font";
import {
Document,
Page,
View,
Text,
Image
} from "@react-pdf/renderer";
 

import "./fonts";
import styles from "./styles";


import Header from "./Header";
import Footer from "./Footer";
import MedicineTable from "./MedicineTable";
import { capitalizeWords } from "../utils/capitalizeWords";
import PatientDetailsCard from "./PatientDetailsCard";
const parameterLabels = {
    en: {
        height: "Height",
        bp: "B.P",
        temperature: "Temperature",
        weight: "Weight",
        sugar: "Sugar",
        na: "NA",
        adviceGiven: "Advice Given",
        followUp: "Follow Up",
    },

    mr: {
        height: "उंची",
        bp: "रक्तदाब",
        temperature: "तापमान",
        weight: "वजन",
        sugar: "साखर",
        na: "उपलब्ध नाही",
        adviceGiven: "दिलेला सल्ला",
        followUp: "पुढील तपासणी",
    },

    hi: {
        height: "ऊंचाई",
        bp: "रक्तचाप",
        temperature: "तापमान",
        weight: "वजन",
        sugar: "शुगर",
        na: "उपलब्ध नहीं",
        adviceGiven: "दी गई सलाह",
        followUp: "अगली जांच",
    },
};

const GREEN = "#5c9a3b";

function RxMark() {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
      <Text style={{ fontSize: 22, fontWeight: 800, color: GREEN, fontFamily: "Helvetica-Bold" }}>
        R
      </Text>
      <Text style={{ fontSize: 13, fontWeight: 800, color: GREEN, fontFamily: "Helvetica-Bold", marginBottom: -1 }}>
        x
      </Text>
    </View>
  );
}

const PAGE_HEIGHT = 842;
const PAGE_PADDING_TOP = 105;    // must match billStyle.js -> page.paddingTop
const PAGE_PADDING_BOTTOM = 80;  // must match billStyle.js -> page.paddingBottom (footer reserve)
const CONTENT_ABOVE = 130;        // approx height of PatientDetailsCard + its marginTop, tune as needed

const RX_MIN_HEIGHT = PAGE_HEIGHT - PAGE_PADDING_TOP - PAGE_PADDING_BOTTOM - CONTENT_ABOVE;

function RxSection({ children }) {
  return (
    <View style={{ flexDirection: "row", marginTop: 10, minHeight: RX_MIN_HEIGHT }}>
      {/* left column: Rx mark, pinned to top */}
      <View style={{ width: 36, alignItems: "flex-start" }}>
        <RxMark />
      </View>

      <View
        style={{
          flex: 1,
          borderLeftWidth: 1.2,
          borderLeftColor: "#c9c9c9",
          paddingLeft: 16,
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function PrescriptionPDF({
    doctor,
    patient,
    appointment,
    prescriptiondata,  
    subDoctors,
    department,
    language = "en",
}){

    const labels = parameterLabels[language] || parameterLabels.en;
    console.log("subDoctors",subDoctors);

    const useDoctor= appointment?.doctorType === "doctor" ? appointment.doctor : appointment.subDoctor
    
    
return(

<Document>

    <Page
        size="A4"
        style={styles.page}
        wrap
    >
        {doctor?.logo && (
            <Image
                src={doctor.logo}
                style={styles.watermark}
                fixed
            />
        )}

        <Header doctor={doctor}/>

        <Footer doctor={useDoctor} subDoctors={subDoctors} department={department} />

        <View
            style={{
                // flex: 1,
            }}
        >

            <Text style={{textAlign:"right",fontSize:9}}>
                        Date: {appointment?.date?.slice(0, 10)} 
                        {/* {appointment?.createdAt
                        ? new Date(appointment.createdAt).toLocaleTimeString()
                        : ""} */}
            </Text>
        </View>

        <PatientDetailsCard patient={patient} parameters={appointment?.parameters}/>

        <RxSection>

            <View
                style={{
                    flexDirection: "row",
                    gap: 8,
                    marginTop: 1,
                    marginBottom: 4,
                }}
                >
                {/* Chief Complaints */}
                <View
                    style={{
                    width: "50%",
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 4,
                    padding: 6,
                    }}
                >
                    <Text
                    style={{
                        fontSize: 8,
                        fontWeight: 700,
                        color: GREEN,
                        marginBottom: 4,
                        textTransform: "uppercase",
                    }}
                    >
                    Chief Complaints
                    </Text>

                    <View
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: "#E5E7EB",
                        paddingTop: 4,
                    }}
                    >
                        <View>
                        {appointment?.chiefComplaints?.length > 0 ? (
                            appointment.chiefComplaints.map((complaint, idx) => (
                            <Text
                                key={idx}
                                style={{
                                fontSize: 9.5,
                                lineHeight: 1.4,
                                marginBottom: 2,
                                }}
                            >
                                • {complaint}
                            </Text>
                            ))
                        ) : (
                            <Text
                            style={{
                                fontSize: 9.5,
                                lineHeight: 1.4,
                            }}
                            >
                            -
                            </Text>
                        )}
                        </View>
                    </View>
                </View>

                {/* Investigation */}
                <View
                    style={{
                    width: "50%",
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 4,
                    padding: 6,
                    }}
                >
                    <Text
                    style={{
                        fontSize: 8,
                        fontWeight: 700,
                        color: GREEN,
                        marginBottom: 4,
                        textTransform: "uppercase",
                    }}
                    >
                    Investigation
                    </Text>

                    <View
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: "#E5E7EB",
                        paddingTop: 4,
                    }}
                    >
                        <View>
                            {appointment?.investigation?.length > 0 ? (
                                appointment.investigation.map((item, idx) => (
                                <Text
                                    key={idx}
                                    style={{
                                    fontSize: 9.5,
                                    lineHeight: 1.4,
                                    marginBottom: 2,
                                    }}
                                >
                                    • {item}
                                </Text>
                                ))
                            ) : (
                                <Text style={{ fontSize: 9.5 }}>-</Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            <View
                style={{
                    marginTop:6
                }}
            >

                <View
                    style={{
                        marginBottom: 8,
                    }}
                >

                    <Text
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            marginBottom: 3,
                            color: GREEN,
                        }}
                    >
                        Diagnosis:
                    </Text>


                    <View
                        style={{
                            paddingLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                            fontSize: 10,
                            marginBottom: 3,
                            }}
                        >
                            {appointment?.diagnosis?.length > 0
                            ? appointment.diagnosis.join(", ")
                            : "-"}
                        </Text>
                    </View>
                </View>

                <Text style={{fontSize: 10}}>
                    Reason : {appointment?.reason}
                </Text>

                

            </View>

            <View
                style={{
                    marginTop:10
                }}
            >

                <MedicineTable
                    prescriptiondata={prescriptiondata}
                />

            </View>

            <Text style={{marginTop:7}}>
                {labels.adviceGiven} : {appointment?.note}
            </Text>

            <Text style={{marginTop:5}}>
                {labels.followUp} :  {appointment?.followUp ? appointment?.followUp?.slice(0, 10) : "-"}
            </Text> 
        </RxSection>




        

    </Page>

</Document>

)

}