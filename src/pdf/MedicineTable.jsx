import { View, Text } from "@react-pdf/renderer";
import { capitalizeWords } from "../utils/capitalizeWords";

export default function MedicineTable({ prescriptiondata }) {

    return (

        <View>

           <View
                style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: "#000",
                    borderBottomStyle: "solid",
                    fontWeight: "bold",
                    padding: 5
                }}
            >
                <Text style={{ width: "5%", textAlign: "center", fontSize: "10px" }}>
                    No
                </Text>

                <Text style={{ width: "30%", textAlign: "center", fontSize: "10px" }}>
                    Medicine
                </Text>

                <Text style={{ width: "35%", textAlign: "center", fontSize: "10px" }}>
                    Dosage
                </Text>

                <Text style={{ width: "30%", textAlign: "center", fontSize: "10px" }}>
                    Duration
                </Text>
            </View>

            {prescriptiondata?.length > 0 ? (
               prescriptiondata.map((item, index) => (
                    <View
                    key={index}
                    wrap={false}
                    style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: '#000',
                        borderBottomStyle: 'dashed',
                        paddingVertical: 4,
                    }}
                    >
                    <Text style={{ width: '5%', textAlign: 'center',fontSize:"9px" }}>
                        {item.no}
                    </Text>

                    <Text style={{ width: '30%',textAlign:"center",fontSize:"9px" }}>
                        {capitalizeWords(item.medicine)} ({capitalizeWords(item.medicineType)})
                    </Text>

                    <Text style={{ width: '35%', textAlign: 'center',fontSize:"9px" }}>
                        {item.dosage}
                    </Text>

                    <Text
                    style={{
                        width: "30%",
                        textAlign: "center",
                        fontSize: 9,
                    }}
                    >
                        {item.duration}{item.totalQuantity}
                        
                    </Text>
                    </View>
                ))
                ) : (
                <View
                    style={{
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                >
                    <Text
                    style={{
                        fontSize: 10,
                        color: '#666',
                    }}
                    >
                    No medicine added
                    </Text>
                </View>
                )
            }

        </View>

    )

}