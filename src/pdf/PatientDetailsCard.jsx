import { View, Text, Svg, Path, Circle, Rect, Line } from "@react-pdf/renderer";

const GREEN = "#5c9a3b";
const GREEN_DARK = "#1e4d2b";
const LINE_GREY = "#999999";

// ---- small inline icons (line-style, matching the reference) ----
function PersonIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Circle cx="12" cy="8" r="4" stroke={GREEN} strokeWidth={2} fill="none" />
      <Path d="M4,21 C4,16 8,14 12,14 C16,14 20,16 20,21" stroke={GREEN} strokeWidth={2} fill="none" />
    </Svg>
  );
}
function CalendarIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Rect x="3" y="5" width="18" height="16" rx="2" stroke={GREEN} strokeWidth={2} fill="none" />
      <Line x1="3" y1="10" x2="21" y2="10" stroke={GREEN} strokeWidth={2} />
      <Line x1="7" y1="2" x2="7" y2="6" stroke={GREEN} strokeWidth={2} />
      <Line x1="17" y1="2" x2="17" y2="6" stroke={GREEN} strokeWidth={2} />
    </Svg>
  );
}
function PinIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 8 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8Z" stroke={GREEN} strokeWidth={1.6} fill="none" />
      <Circle cx="12" cy="10" r="2.4" stroke={GREEN} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}
function PhoneIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1.1.5 1.1 1.1v3.5c0 .6-.5 1.1-1.1 1.1C10.6 21.3 2.7 13.4 2.7 4.3c0-.6.5-1.1 1.1-1.1H7.3c.6 0 1.1.5 1.1 1.1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8Z"
        stroke={GREEN}
        strokeWidth={1.2}
        fill="none"
      />
    </Svg>
  );
}
function ClockIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Circle cx="12" cy="12" r="9" stroke={GREEN} strokeWidth={2} fill="none" />
      <Path d="M12 7v5l3 3" stroke={GREEN} strokeWidth={2} fill="none" />
    </Svg>
  );
}
function HeartIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Path
        d="M12 20 C6 15.5 3 12.4 3 8.8 C3 6.1 5.1 4 7.7 4 C9.4 4 10.9 4.9 12 6.3 C13.1 4.9 14.6 4 16.3 4 C18.9 4 21 6.1 21 8.8 C21 12.4 18 15.5 12 20 Z"
        stroke={GREEN}
        strokeWidth={1.6}
        fill="none"
      />
    </Svg>
  );
}
function WeightIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Rect x="3" y="8" width="18" height="12" rx="2" stroke={GREEN} strokeWidth={2} fill="none" />
      <Path d="M9 8 C9 5.8 10.3 4 12 4 C13.7 4 15 5.8 15 8" stroke={GREEN} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function BloodGroupIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Path
        d="M12 3 C12 3 7 9 7 13.5 C7 16.5 9.2 19 12 19 C14.8 19 17 16.5 17 13.5 C17 9 12 3 12 3 Z"
        stroke={GREEN}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M12 10 V15 M9.5 12.5 H14.5"
        stroke={GREEN}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function SugarIcon() {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: 9, height: 9, marginRight: 4 }}>
      <Path
        d="M12 3 C12 3 7 9 7 13.5 C7 16.5 9.2 19 12 19 C14.8 19 17 16.5 17 13.5 C17 9 12 3 12 3 Z"
        stroke={GREEN}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M10 13 L12 15 L14 11"
        stroke={GREEN}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ---- one "icon + label + fillable line" row ----
function Field({ icon, label, value, width }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", width, marginBottom:2 }}>
      {icon}
      <Text style={{ fontFamily: "NotoSansDevanagari", fontSize: 6, color: GREEN_DARK, marginRight: 3 }}>
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          borderBottomWidth: 0.7,
          borderBottomColor: LINE_GREY,
          borderBottomStyle: "dotted",
          paddingBottom: 0.5,
        }}
      >
        <Text style={{ fontSize: 6, color: "#333" }}>{value || ""}</Text>
      </View>
    </View>
  );
}

export default function PatientDetailsCard({ patient,parameters }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "stretch",
        borderWidth: 1,
        borderColor: GREEN,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 12,
        marginTop: 2,
      }}
    >
      {/* left block: name/age/address/contact */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 8, gap:10 }}>
          <Field icon={<PersonIcon />} label="रुग्णाचे नाव" value={patient?.name} width="50%" />
          <Field icon={<CalendarIcon />} label="वय" value={patient?.age} width="40%" />
        </View>
        <View style={{ flexDirection: "row", gap:10,marginBottom: 8, }}>
          <Field icon={<PinIcon />} label="पत्ता" value={patient?.address} width="50%" />
          <Field icon={<PhoneIcon />} label="संपर्क" value={patient?.mobileNumber} width="40%" />
        </View>
        <View style={{ flexDirection: "row", gap:10 }}>
          <Field icon={<PersonIcon />} label="संदर्भ देणारे"  value={patient?.referredBy ? patient.referredBy : "-"} width="50%" />
          <Field icon={<CalendarIcon />} label="जन्मतारीख" value={patient?.dateOfBirth ? patient.dateOfBirth : "-"} width="40%" />
        </View>
      </View>

      {/* vertical divider */}
      <View style={{ width: 1, backgroundColor: GREEN, marginHorizontal: 14 }} />

      {/* right block: LMP / EDO / BP / Weight */}
      <View style={{ width: 140, justifyContent: "space-between" }}>
        <Field icon={<CalendarIcon />} label="Temperature" value={parameters?.temprature} />
        <Field icon={<ClockIcon />} label="Height" value={parameters?.height} />
        <Field icon={<HeartIcon />} label="BP" value={parameters?.bloodPressure} />
        <Field icon={<WeightIcon />} label="Weight" value={parameters?.weight} />
        <Field
          icon={<SugarIcon />}
          label="Sugar"
          value={parameters?.sugar || "-"}
        />

        {patient?.bloodGroup && (
          <Field
            icon={<BloodGroupIcon />}
            label="Blood Group"
            value={patient.bloodGroup}
          />
        )}
      </View>
    </View>
  );
}