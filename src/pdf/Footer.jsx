import { View, Text, Svg, Circle, Path, Image } from "@react-pdf/renderer";
import { getFormattedDateTime } from "../utils/getFormattedDateTime";
import "./fonts"
import { capitalizeWords } from "../utils/capitalizeWords";
import { myImg } from "../assets/Images";

const GREEN_DARK = "#1e4d2b";
const GREEN_MID = "#5c9a3b";

function PinIcon() {
  return (
    <Svg
      viewBox="0 0 24 24"
      style={{ width: 14, height: 14, marginRight: 5, marginTop: 1, flexShrink: 0 }}
    >
      <Path
        d="M12 2C7.6 2 4 5.6 4 10c0 5.4 8 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8Z"
        fill="#afd249"
      />
      <Circle cx="12" cy="10" r="2.5" fill="#1e4d2b" />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 14, height: 14, marginRight: 5, marginTop: 1, flexShrink: 0 }}>
      <Path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1.1.5 1.1 1.1v3.5c0 .6-.5 1.1-1.1 1.1C10.6 21.3 2.7 13.4 2.7 4.3c0-.6.5-1.1 1.1-1.1H7.3c.6 0 1.1.5 1.1 1.1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8Z"
        fill="#afd249"
      />
    </Svg>
  );
}

function GlobeIcon() {
  return (
    <Svg 
      viewBox="0 0 24 24" 
      style={{ width: 14, height: 14, marginRight: 5, marginTop: 1, flexShrink: 0 }}
    >
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z"
        fill="#afd249"
      />
    </Svg>
  );
}

const DoctorColumn = ({ doctor, isSubDoctor = false }) => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <Text
      style={{
        fontSize: 9,
        fontWeight: 800,
        color: "#1a1a1a",
        fontFamily: "NotoSansDevanagari",
      }}
    >
      {doctor?.name
        ? `${capitalizeWords(doctor.name)}`
        : "-"}
    </Text>

    <Text
      style={{
        fontSize: 8,
        color: "#555555",
        marginTop: 0.5,
      }}
    >
      {doctor?.qualification||
        doctor?.specialization||
        "-"}
    </Text>

    <Text
      style={{
        fontSize: 8,
        fontWeight: 700,
        color: GREEN_MID,
        fontFamily: "NotoSansDevanagari",
        marginTop: 1,
      }}
    >
      {doctor?.department || "-"}
    </Text>
  </View>
);

export default function PrescriptionFooter({doctor, subDoctors, department}) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: 158, 
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      fixed
    >

      <View style={{ width: "100%",marginBottom:4 }}>

          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
              marginBottom: 6,
              paddingRight: 30,
            }}
          >

            {doctor?.signature && (
              <Image
                src={doctor.signature}
                style={{
                  width: 80,
                  height: 35,
                  objectFit: "contain",
                  marginBottom: 2,
                }}
              />
            )}
            <Text
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#1a1a1a",
                fontFamily: "NotoSansDevanagari",
                textAlign: "right",
              }}
            >
              {doctor?.name ? ` ${capitalizeWords(doctor.name)}` : "-"}
            </Text>

            <Text
              style={{
                fontSize: 8.5,
                color: "#555555",
                marginTop: 1,
                textAlign: "right",
              }}
            >
              {capitalizeWords(doctor?.medicalDegree) || capitalizeWords(doctor?.qualification) || "-"}
            </Text>
          </View>
              
          <View 
                    style={{ 
                      flexDirection: "row", 
                      alignItems: "center", 
                      justifyContent: "center",
                      marginBottom: 3
                    }}>
                    {/* Left Side Horizontal Line */}
                    <View style={{ flex: 1, height: 1, backgroundColor: GREEN_DARK }} />
                    
                    {/* Center Text */}
                    <Text 
                      style={{ 
                        fontSize: 9.5, 
                        fontWeight: 800, 
                        color: GREEN_DARK, 
                        fontFamily: "NotoSansDevanagari", 
                        paddingHorizontal: 10,
                        textAlign: "center"
                      }}
                    >
                      {department}
                    </Text>
                    
                    {/* Right Side Horizontal Line */}
                    <View style={{ flex: 1, height: 1, backgroundColor: GREEN_DARK }} />
          </View>      

          {!subDoctors?.length ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingHorizontal: 30,
                width: "100%",
              }}
            >
              <DoctorColumn doctor={doctor} />
            </View>
          ) : subDoctors.length === 1 ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingHorizontal: 30,
                width: "100%",
              }}
            >
              <DoctorColumn doctor={subDoctors[0]} />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingHorizontal: 30,
                width: "100%",
              }}
            >
              <DoctorColumn doctor={subDoctors[0]} />

              <View
                style={{
                  width: 1,
                  height: 30,
                  backgroundColor: "#afd249",
                  marginHorizontal: 6,
                }}
              />

              <DoctorColumn doctor={subDoctors[1]} />

              {subDoctors.length === 3 && (
                <>
                  <View
                    style={{
                      width: 1,
                      height: 30,
                      backgroundColor: "#afd249",
                      marginHorizontal: 6,
                    }}
                  />

                  <DoctorColumn doctor={subDoctors[2]} />
                </>
              )}
            </View>
          )}
      
      </View>

      <View
        style={{
          width: "100%",
          height: 50,
          borderTopWidth: 4,
          borderTopColor: "#afd249",
          borderTopStyle: "solid",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          backgroundColor:GREEN_DARK
        }}
      >
        {/* <Image
          src={myImg.prescription_footer_background}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        /> */}


        <View
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 25,
            paddingTop:5,
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1.3,
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
            }}
          >
            <PinIcon />

            <Text
              style={{
                fontSize: 8,
                color: "#ffffff",
                fontFamily: "NotoSansDevanagari",
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {"वसंतराव नाईक पुतळ्या जवळ,\nवसमत रोड, परभणी."}
            </Text>
          </View>

          <View
            style={{
              width: 1,
              height: 22,
              backgroundColor: "#3a6b46",
              marginHorizontal: 6,
            }}
          />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            <PhoneIcon />

            <Text
              style={{
                fontSize: 8,
                color: "#ffffff",
                fontFamily: "NotoSansDevanagari",
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {"अपॉइंटमेंटसाठी संपर्क :\n"}
              <Text
                style={{
                  fontWeight: 800,
                  color: "#afd249",
                }}
              >
                9091905353
              </Text>
            </Text>
          </View>

  
          <View
            style={{
              width: 1,
              height: 22,
              backgroundColor: "#3a6b46",
              marginHorizontal: 6,
            }}
          />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <GlobeIcon />

            <Text
              style={{
                fontSize: 8,
                color: "#ffffff",
                fontFamily: "NotoSansDevanagari",
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {"आपले आरोग्य, आमची प्राथमिकता"}
            </Text>
          </View>
        </View>


        <View
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#173b21",
            paddingVertical: 3,
          }}
        >
          <Text
            style={{
              fontSize: 6.5,
              color: "#a4bfa7",
              textAlign: "center",
            }}
          >
            This is a system generated prescription - {getFormattedDateTime()}
          </Text>
        </View>
      </View>

    </View>
  );
}