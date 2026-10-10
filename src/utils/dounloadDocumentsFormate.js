import { toast } from "react-toastify";
import DAMAFormPDF from "../pdf/damaForm";
import { pdf } from "@react-pdf/renderer";
import ConsentFormPDF from "../pdf/consentForm";
import ICUConsentFormPDF from "../pdf/ICUConsentFormPDF";
import TransferFormPDF from "../pdf/TransferFormPDF";
import DeathFormPDF from "../pdf/DeathFormPDF";
import LamaFormPDF from "../pdf/LamaTransferFormPDF";
import BirthCertificatePDF from "../pdf/BirthCertificatePDF";
import { patientService } from "../services/patientService";

const downloadDAMAForm = async (admission) => {
    try {
        const blob = await pdf(
            <DAMAFormPDF
                patient={admission.patient}
                logo={admission.logo}
                mobileNumber="9091905353"
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `DAMA-Form-${admission?.admissionNumber || admission?.id}-${admission.patient?.name}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success("DAMA form downloaded successfully.");
    } catch (error) {
        console.error("DAMA form download error:", error);

        toast.error(
            error?.message || "Failed to download DAMA form."
        );
    }
};

const handleDownloadConsent = async (admission) => {
    try {
        const consentData = {
            consentNumber: `CONS-${admission.admissionNumber || admission.patientId || "001"}`,

            date: new Date().toISOString().slice(0, 10),

            consentType: "Procedure",

            diagnosis:
                admission?.diagnosis ||
                "Medical condition",

            consentGivenBy: "",
            relationship: "",
            consentBy: "",

            ipdNumber:
                admission?.admissionNumber ||
                "",

            wardBed: `${admission?.ward || ""} / ${admission?.room || ""}/ ${admission.currentBed}`
                || ""
        };

        const blob = await pdf(
            <ConsentFormPDF
                patient={admission.patient}
                consent={consentData}
                logo={admission.logo}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `Consent_Form_${admission?.patient?.name || ""}_${admission?.patient?.patientId || ""}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success("Consent form downloaded successfully.");
    } catch (error) {
        console.error(
            "Consent form download error:",
            error
        );

        toast.error(
            error?.message || "Failed to download consent form."
        );
    }
};

const handleDownloadICUConsent = async (admission) => {
    try {
        const consentData = {

            diagnosis:
                admission?.diagnosis ||
                "Medical condition",

            wardBed: `${admission?.ward || ""} / ${admission?.room || ""}/ ${admission.currentBed}`
                || "",

            ipdNumber:
                admission?.admissionNumber ||
                "",


        };

        const blob = await pdf(
            <ICUConsentFormPDF
                patient={admission.patient}
                consent={consentData}
                logo={admission.logo}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `ICU_Consent_Form_${admission?.patient?.name || ""}_${admission?.patient?.patientId || ""}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success("Consent form downloaded successfully.");
    } catch (error) {
        console.error(
            "Consent form download error:",
            error
        );

        toast.error(
            error?.message || "Failed to download consent form."
        );
    }
};

const downloadTransferForm = async (admission) => {
    try {
        const blob = await pdf(
            <TransferFormPDF
                patient={admission.patient}
                logo={admission.logo}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `Transfer_Form_${admission?.patient?.name || ""}_${admission?.patient?.patientId || ""}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success("Transfer form downloaded successfully.");
    } catch (error) {
        console.error(
            "Transfer form download error:",
            error
        );

        toast.error(
            error?.message || "Failed to download transfer form."
        );
    }
};

const downloadDeathForm = async (admission) => {
    try {
        const blob = await pdf(
            <DeathFormPDF
                patient={admission.patient}
                admissionDate={`${admission.admissionDate} ${admission.admissionTime}`}
                logo={admission.logo}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `Death_Form_${admission?.patient?.name || ""}_${admission?.patient?.patientId || ""}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success("Death form downloaded successfully.");
    } catch (error) {
        console.error(
            "death form download error:",
            error
        );

        toast.error(
            error?.message || "Failed to download death form."
        );
    }
};

const downloadLAMAForm = async (admission) => {
    try {
        const blob = await pdf(
            <LamaFormPDF
                patient={admission.patient}
                logo={admission.logo}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `LAMA_Form_${admission?.patient?.name || ""}_${admission?.patient?.patientId || ""}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success("LAMA form downloaded successfully.");
    } catch (error) {
        console.error(
            "LAMA form download error:",
            error
        );

        toast.error(
            error?.message || "Failed to download LAMA form."
        );
    }
};

const downloadSurgeryConsent = async (admission) => {

}

export const viewBirthCertificate = async (admission) => {
    let newWindow = null;
    let url = null;

    try {
        newWindow = window.open("", "_blank");

        if (!newWindow) {
            toast.error("Please allow pop-ups to view the birth certificate.");
            return;
        }

        newWindow.document.write(`
            <html>
                <head>
                    <title>Birth Certificate</title>
                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            font-family: Arial, sans-serif;
                            background: #f5f5f5;
                        }

                        .loading {
                            color: #521785;
                            font-size: 16px;
                            font-weight: 600;
                        }
                    </style>
                </head>

                <body>
                    <div class="loading">
                        Generating Birth Certificate...
                    </div>
                </body>
            </html>
        `);

        const res = await patientService.getBirthCertificate(
            admission.patientId
        );

        const certificate = res?.data;

        if (!certificate) {
            throw new Error("Birth certificate data not found.");
        }

        const certificateData = {
            certificateIssueDate: new Date().toLocaleDateString("en-IN"),

            newbornId: certificate.newbornId || "",

            bloodGroup: certificate.babyBloodGroup || "",
            certificateNO: certificate.certificateNumber || "",

            motherIdNo: certificate.motherPatientUniqueId || "",

            childName: certificate.babyName || "",
            sex: certificate.babySex || "",
            dateOfBirth: certificate.babyDateOfBirth || "",
            timeOfBirth: certificate.babyTimeOfBirth || "",

            placeOfBirth: "Krishna ICU & Multi-Speciality Hospital",

            fatherName: certificate.fatherName || "",
            motherName: certificate.motherName || "",

            motherNationality: certificate.motherNationality || "",
            fatherNationality: certificate.fatherNationality || "",

            motherReligion: certificate.motherReligion || "",
            fatherReligion: certificate.fatherReligion || "",

            parentsAddress: certificate.presentAddress || "",
            permanentAddress: certificate.permanentAddress || "",
        };


        const blob = await pdf(
            <BirthCertificatePDF
                patient={admission.patient}
                certificate={certificateData}
                logo={admission.logo}
            />
        ).toBlob();


        url = URL.createObjectURL(blob);

        newWindow.location.href = url;

        const fileName =
            `Birth-Certificate-${certificate.certificateNumber || certificate.newbornId}.pdf`;

        const downloadLink = document.createElement("a");

        downloadLink.href = url;
        downloadLink.download = fileName;

        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 60000);

    } catch (error) {
        console.error("Birth certificate view error:", error);

        if (newWindow && !newWindow.closed) {
            newWindow.close();
        }

        if (url) {
            URL.revokeObjectURL(url);
        }

        toast.error(
            error?.response?.data?.message ||
            error?.message ||
            "Failed to open birth certificate."
        );
    }
};

export const handleGeneratedDocument = async (item, admission) => {
    switch (item.generator) {
        //pdf available
        case "DAMA_FORM":
            await downloadDAMAForm(admission);
            break;

        case "LAMA_FORM":
            await downloadLAMAForm(admission);
            break;

        case "TRANSFER_FORM":
            await downloadTransferForm(admission);
            break;

        case "DEATH_FORM":
            await downloadDeathForm(admission);
            break;


        case "CONSENT_FORM":
            await handleDownloadConsent(admission);
            break;

        case "ICU_CONSENT_FORM":
            await handleDownloadICUConsent(admission);
            break;

        case "SURGERY_CONSENT":
            await downloadSurgeryConsent();
            break;

        case "BIRTH_CERTIFICATE_FORM":
            await viewBirthCertificate(admission);
            break;

        default:
            toast.error("Document format not available");
    }
};