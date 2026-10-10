import { MLC_DOCUMENTS } from "../constant/mlcDocument";

export const getDocumentRows = (admission = {}, documents = []) => {
        const rows = [];

        if (admission.admissionType === "MLC") {
            MLC_DOCUMENTS.forEach((requiredDocument) => {

                const uploadedDocument = documents.find(
                    (doc) =>
                        doc.documentType === "MLC-DOC" &&
                        doc.documentName === requiredDocument.documentName
                );
                if (requiredDocument.documentName === "Consent Form") {
                    rows.push({
                        documentType: "MLC-DOC",
                        documentName: "Consent Form",
                        required: true,
                        uploaded: !!uploadedDocument,
                        uploadedDocument: uploadedDocument || null,

                        source: "GENERATED",
                        generator: "CONSENT_FORM",
                    });
                } else {
                    rows.push({
                        ...requiredDocument,
                        required: true,
                        uploaded: !!uploadedDocument,
                        uploadedDocument: uploadedDocument || null,
                    });
                }
            });
        }

        if (admission.admissionType !== "MLC") {
            const uploadedDocument = documents.find(
                (doc) =>
                    doc.documentType === "MEDICAL" &&
                    doc.documentName === "Consent Form"
            );
            rows.push({
                documentType: "MEDICAL",
                documentName: "Consent Form",
                required: true,
                uploaded: !!uploadedDocument,
                uploadedDocument: uploadedDocument || null,

                source: "GENERATED",
                generator: "CONSENT_FORM",
            });
        }

        if (admission.admissionType !== "MLC" && admission.admissionStatus === "transfer to ICU") {
            const uploadedDocument = documents.find(
                (doc) =>
                    doc.documentType === "MEDICAL" &&
                    doc.documentName === "ICU Consent Form"
            );
            rows.push({
                documentType: "MEDICAL",
                documentName: "ICU Consent Form",
                required: true,
                uploaded: !!uploadedDocument,
                uploadedDocument: uploadedDocument || null,

                source: "GENERATED",
                generator: "ICU_CONSENT_FORM",
            });
        }

        if (admission.admissionType !== "MLC" && admission.doctorData?.department==="Obstetrics & Gynaecology Department") {
            const uploadedDocument = documents.find(
                (doc) => doc.documentType === "BIRTH_CERTIFICATE" && doc.documentName === "BIRTH CERTIFICATE"
            );
            rows.push({
                documentType: "BIRTH_CERTIFICATE",
                documentName: "BIRTH CERTIFICATE",
                required: true,
                uploaded: !!uploadedDocument,
                uploadedDocument: uploadedDocument || null,
                source: "FILL",
                generator: "BIRTH_CERTIFICATE_FORM",
            });
        }

        if (admission.admissionType !== "MLC" && admission?.discharge?.dischargeType === "LAMA") {
            const uploadedDocument = documents.find(
                (doc) =>
                    doc.documentType === "DISCHARGE" &&
                    doc.documentName === "LAMA"
            );

            rows.push({
                documentType: "DISCHARGE",
                documentName: "LAMA",
                required: true,
                uploaded: !!uploadedDocument,
                uploadedDocument: uploadedDocument || null,

                source: "GENERATED",
                generator: "LAMA_FORM",
            });
        }

        if (admission.admissionType !== "MLC" && admission?.discharge?.dischargeType === "DAMA") {
            const uploadedDocument = documents.find(
                (doc) =>
                    doc.documentType === "DISCHARGE" &&
                    doc.documentName === "DAMA"
            );

            rows.push({
                documentType: "DISCHARGE",
                documentName: "DAMA",
                required: true,
                uploaded: !!uploadedDocument,
                uploadedDocument: uploadedDocument || null,

                source: "GENERATED",
                generator: "DAMA_FORM",
            });
        }

        if (admission.admissionType !== "MLC" && admission?.discharge?.dischargeType === "Transfer") {
            const uploadedDocument = documents.find(
                (doc) =>
                    doc.documentType === "DISCHARGE" &&
                    doc.documentName === "TRANSFER"
            );

            rows.push({
                documentType: "DISCHARGE",
                documentName: "TRANSFER",
                required: true,
                uploaded: !!uploadedDocument,
                uploadedDocument: uploadedDocument || null,

                source: "GENERATED",
                generator: "TRANSFER_FORM",
            });
        }

        if (admission.admissionType !== "MLC" && admission?.discharge?.dischargeType === "Death") {
            const uploadedDocument = documents.find(
                (doc) =>
                    doc.documentType === "DISCHARGE" &&
                    doc.documentName === "DEATH"
            );

            rows.push({
                documentType: "DISCHARGE",
                documentName: "DEATH",
                required: true,
                uploaded: !!uploadedDocument,
                uploadedDocument: uploadedDocument || null,

                source: "GENERATED",
                generator: "DEATH_FORM",
            });
        }

        documents.forEach((doc) => {
            const alreadyShown = rows.some(
                (row) =>
                    row.uploadedDocument?.id === doc.id
            );

            if (!alreadyShown) {
                rows.push({
                    documentType: doc.documentType,
                    documentName: doc.documentName,
                    required: false,
                    uploaded: true,
                    uploadedDocument: doc,
                });
            }
        });

        return rows;
};