import {
    translateArray,
    translateText
} from "./translator";

export const translatePrescription = async ({
    patient,
    appointment,
    prescriptiondata,
    language
}) => {

    // English
    if (!language || language === "en") {
        return {
            patient,
            appointment,
            prescriptiondata
        };
    }

    const targetLanguage = {
        hi: "hin_Deva",
        mr: "mar_Deva"
    }[language];

    // Unsupported language
    if (!targetLanguage) {
        return {
            patient,
            appointment,
            prescriptiondata
        };
    }

    // ----------------------------------
    // PATIENT
    // ----------------------------------

    // const translatedPatient = {
    //     ...patient,

    //     name: await translateText(
    //         patient?.name || "",
    //         targetLanguage
    //     ),


    //     address: await translateText(
    //         patient?.address || "",
    //         targetLanguage
    //     ),

    //     referredBy: await translateText(
    //         patient?.referredBy || "",
    //         targetLanguage
    //     )
    // };

     const [
        patientName,
        patientAddress,
        patientReferredBy
    ] = await Promise.all([
        translateText(patient?.name || "", targetLanguage),
        translateText(patient?.address || "", targetLanguage),
        // translateText(patient?.referredBy || "", targetLanguage)
    ]);

    const translatedPatient = {
        ...patient,
        name: patientName,
        address: patientAddress,
        // referredBy: patientReferredBy
    };


    // ----------------------------------
    // APPOINTMENT
    // ----------------------------------

    // const translatedAppointment = {
    //     ...appointment,

    //     chiefComplaints: await translateArray(
    //         appointment?.chiefComplaints || [],
    //         targetLanguage
    //     ),

    //     investigation: await translateArray(
    //         appointment?.investigation || [],
    //         targetLanguage
    //     ),

    //     diagnosis: await translateArray(
    //         appointment?.diagnosis || [],
    //         targetLanguage
    //     ),

    //     reason: await translateText(
    //         appointment?.reason || "",
    //         targetLanguage
    //     ),

    //     note: await translateText(
    //         appointment?.note || "",
    //         targetLanguage
    //     )
    // };

    const [
        chiefComplaints,
        investigation,
        diagnosis,
        reason,
        note
    ] = await Promise.all([
        translateArray(
            appointment?.chiefComplaints || [],
            targetLanguage
        ),

        translateArray(
            appointment?.investigation || [],
            targetLanguage
        ),

        translateArray(
            appointment?.diagnosis || [],
            targetLanguage
        ),

        translateText(
            appointment?.reason || "",
            targetLanguage
        ),

        translateText(
            appointment?.note || "",
            targetLanguage
        )
    ]);

    const translatedAppointment = {
        ...appointment,
        chiefComplaints,
        investigation,
        diagnosis,
        reason,
        note
    };

    // ----------------------------------
    // PRESCRIPTION / MEDICINES
    // ----------------------------------

    // const translatedPrescriptiondata = await Promise.all(
    //     (prescriptiondata || []).map(async (item) => {

    //         return {
    //             ...item,

    //             // medicine: await translateText(
    //             //     item?.medicine || "",
    //             //     targetLanguage
    //             // ),

    //             dosage: await translateText(
    //                 item?.dosage || "",
    //                 targetLanguage
    //             ),

    //             // duration: await translateText(
    //             //     item?.duration || "",
    //             //     targetLanguage
    //             // ),

    //             // totalQuantity: await translateText(
    //             //     item?.totalQuantity || "",
    //             //     targetLanguage
    //             // ),

    //             // medicineType: await translateText(
    //             //     item?.medicineType || "",
    //             //     targetLanguage
    //             // )
    //         };

    //     })
    // );

     const translatedPrescriptiondata = await Promise.all(
        (prescriptiondata || []).map(async (item) => {

            const dosage = await translateText(
                item?.dosage || "",
                targetLanguage
            );

            return {
                ...item,
                dosage
            };
        })
    );


    return {
        patient: translatedPatient,
        appointment: translatedAppointment,
        prescriptiondata: translatedPrescriptiondata
    };
};

// import { translateBatch } from "./translator";

// export const translatePrescription = async ({
//     patient = {},
//     appointment = {},
//     prescriptiondata = [],
//     language
// }) => {

//     if (!language || language === "en") {
//         return {
//             patient,
//             appointment,
//             prescriptiondata
//         };
//     }

//     const targetLanguage = {
//         hi: "hin_Deva",
//         mr: "mar_Deva"
//     }[language];

//     if (!targetLanguage) {
//         return {
//             patient,
//             appointment,
//             prescriptiondata
//         };
//     }


//     // =====================================================
//     // COLLECT ALL TEXT
//     // =====================================================

//     const texts = [

//         // Patient
//         patient?.name,
//         patient?.address,
//         patient?.referredBy,

//         // Appointment
//         ...(appointment?.chiefComplaints || []),
//         ...(appointment?.investigation || []),
//         ...(appointment?.diagnosis || []),
//         appointment?.reason,
//         appointment?.note,

//         // Medicines
//         ...(prescriptiondata || []).map(
//             item => item?.dosage
//         )
//     ].filter(Boolean);


//     // =====================================================
//     // REMOVE DUPLICATES
//     // =====================================================

//     const uniqueTexts = [
//         ...new Set(
//             texts.map(text =>
//                 String(text).trim()
//             )
//         )
//     ];


//     console.log(
//         "Texts to translate:",
//         uniqueTexts.length
//     );


//     // =====================================================
//     // ONE TRANSLATION OPERATION
//     // =====================================================

//     const translatedTexts =
//         await translateBatch(
//             uniqueTexts,
//             targetLanguage
//         );


//     // =====================================================
//     // CREATE LOOKUP
//     // =====================================================

//     const translationMap = new Map();

//     uniqueTexts.forEach(
//         (text, index) => {

//             translationMap.set(
//                 text,
//                 translatedTexts[index] || text
//             );

//         }
//     );


//     const translate = value => {

//         if (!value) {
//             return value;
//         }

//         return (
//             translationMap.get(
//                 String(value).trim()
//             ) || value
//         );
//     };


//     const translateArrayLocal = array => {

//         if (!Array.isArray(array)) {
//             return array;
//         }

//         return array.map(item =>
//             translate(item)
//         );
//     };


//     // =====================================================
//     // PATIENT
//     // =====================================================

//     const translatedPatient = {
//         ...patient,

//         name: translate(patient?.name),

//         address: translate(patient?.address),

//         referredBy: translate(
//             patient?.referredBy
//         )
//     };


//     // =====================================================
//     // APPOINTMENT
//     // =====================================================

//     const translatedAppointment = {
//         ...appointment,

//         chiefComplaints:
//             translateArrayLocal(
//                 appointment?.chiefComplaints
//             ),

//         investigation:
//             translateArrayLocal(
//                 appointment?.investigation
//             ),

//         diagnosis:
//             translateArrayLocal(
//                 appointment?.diagnosis
//             ),

//         reason: translate(
//             appointment?.reason
//         ),

//         note: translate(
//             appointment?.note
//         )
//     };


//     // =====================================================
//     // PRESCRIPTION
//     // =====================================================

//     const translatedPrescriptiondata =
//         (prescriptiondata || []).map(item => ({

//             ...item,

//             dosage: translate(
//                 item?.dosage
//             )

//         }));


//     return {
//         patient: translatedPatient,

//         appointment:
//             translatedAppointment,

//         prescriptiondata:
//             translatedPrescriptiondata
//     };
// };

export const translateNote = async ({
    note,
    language,
}) => {

    // English
    if (!language || language === "en") {
        return {
            note,
        };
    }

    const targetLanguage = {
        hi: "hin_Deva",
        mr: "mar_Deva",
    }[language];

    // Unsupported language
    if (!targetLanguage) {
        return {
            note,
        };
    }

    const translatedNote = await translateText(
        note || "",
        targetLanguage
    );

    return {
        note: translatedNote,
    };
};