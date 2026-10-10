// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { X, ChevronDown, Loader2, Plus } from "lucide-react";
// import Button from "../../commonComponent/Button";
// import { ipdService } from "../../services/ipdService";
// import { toast } from "react-toastify";

// const initialForm = {
//   admissionId: "",
// };

// const CHARGE_OPTIONS = [
//   "IPD Registration",
//   "Consulting Fees",
//   "Hospital Stay Charges",
//   "Nursing Charges",
//   "Surgeon Charges",
//   "Assistant Surgeon Charges",
//   "Anaesthesia Charges",
//   "OT Charges",
//   "Daily Doctor Visit Charges",
//   "Visiting Doctor",
//   "IPD Procedure",
//   "ICU Charges",
//   "Miscellaneous Charges",
//   "A - Scan Charges",
//   "Endoscopy Charges",
//   "ECG",
//   "Implant LENS/Mesh",
//   "Other Charges",
// ];

// const GenerateInvoiceModal = ({ isOpen, onClose,accountId  }) => {

//   const [form, setForm] = useState(initialForm);
//   const [admissions, setAdmissions] = useState([]);
//   const [admissionsLoading, setAdmissionsLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const [charges, setCharges] = useState([]);
//   const [chargeLabel, setChargeLabel] = useState("");
//   const [chargeOtherLabel, setChargeOtherLabel] = useState("");
//   const [chargePrice, setChargePrice] = useState("");

//   const [discountInput, setDiscountInput] = useState("");  
//   const [appliedDiscount, setAppliedDiscount] = useState(0); 

//   useEffect(() => {
//     if (!isOpen) return;

//     const loadAdmissions = async () => {
//       setAdmissionsLoading(true);
//       setError("");

//       try {
//         const res = await ipdService.getPatientsWithAccount();

//         setAdmissions(res?.data);
//       } catch (err) {
//         setAdmissions([]);
//         setError(
//           err?.response?.data?.message ||
//             err?.response?.data?.error ||
//             "Failed to load admitted patients."
//         );
//       } finally {
//         setAdmissionsLoading(false);
//       }
//     };

//     loadAdmissions();
//   }, [isOpen]);

//   useEffect(() => {
//     if (isOpen && accountId) {
//       setForm((prev) => ({ ...prev, admissionId:accountId, }));
//     }
//   }, [isOpen, accountId]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleChargeLabelChange = (e) => {
//     const value = e.target.value;
//     setChargeLabel(value);
//     if (value !== "Other Charges") {
//       setChargeOtherLabel("");
//     }
//   };

//   const handleAddCharge = () => {
//     const isOther = chargeLabel === "Other Charges";
//     const finalLabel = isOther ? chargeOtherLabel.trim() : chargeLabel;

//     if (!chargeLabel || (isOther && !finalLabel) || chargePrice === "" || Number(chargePrice) < 0) return;

//     setCharges((prev) => [
//       ...prev,
//       { chargeName: finalLabel, unitPrice: Number(chargePrice) },
//     ]);
//     setChargeLabel("");
//     setChargeOtherLabel("");
//     setChargePrice("");
//   };

//   const handleRemoveCharge = (index) => {
//     setCharges((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleApplyDiscount = () => {
//     const value = Number(discountInput);
//     if (discountInput === "" || isNaN(value) || value < 0) return;
//     setAppliedDiscount(value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (
//       (!form.admissionId)
//     ) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       if (
//         discountInput.trim() !== "" &&
//         Number(discountInput) !== appliedDiscount
//       ) {
//         setError("Please click 'Apply' to apply the discount before saving.");
//         setSubmitting(false);
//         return;
//       }

//       const payload = {
//         charges,
//         discount: appliedDiscount, 
//       };
//       console.log("Generate Invoice payload:", payload);
//       const res = await ipdService.addPatientAccountCharges(payload,form.admissionId);
//       toast.success(res?.message || "Charges added successfullyy...")
//       setForm(initialForm);
//       setChargeLabel("");
//       setChargeOtherLabel("");
//       setChargePrice("");
//       setCharges([]);
//       onClose();
//     } catch (err) {
//       setError(err?.response?.data?.message || `Failed to Add charges. Please try again.`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     setForm(initialForm);
//     setCharges([]);
//     setChargeLabel("");
//     setChargeOtherLabel("");
//     setChargePrice("");
//     setDiscountInput(""); // NEW
//     setAppliedDiscount(0); // NEW
//     setError("");
//     onClose();
//   };

//   return createPortal(
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
//       <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
//           <h2 className="text-lg font-semibold text-[#343C6A]">
//             Add Charges
//           </h2>
//           <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
//             <X size={18} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
//           {error && (
//             <div className="bg-[#FEE2E2] text-[#B91C1C] text-[13px] rounded-md px-3 py-2">
//               {error}
//             </div>
//           )}

//           <div className="flex flex-col gap-1">
//             <label className="text-[13px] font-medium text-[#343C6A]">Patient</label>

//             <>
//                 <div className="relative">
//                   <select
//                     name="admissionId"
//                     value={form.admissionId}
//                     onChange={handleChange}
//                     className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none disabled:bg-gray-50"
//                     required
//                     disabled={admissionsLoading || accountId}
//                   >
//                     <option value="" disabled>
//                       {admissionsLoading ? "Loading patients..." : "Select patient"}
//                     </option>
//                     {admissions.map((a) => (
//                       <option key={a.patientId} value={a.accountId}>
//                         {a.patientName} ({a.patientUniqueId}) ({a.accountNumber})
//                       </option>
//                     ))}
//                   </select>
//                   {admissionsLoading ? (
//                     <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
//                   ) : (
//                     <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                   )}
//                 </div>
//                 {!admissionsLoading && admissions.length === 0 && (
//                   <p className="text-[12px] text-[#8BA3CB]">No currently admitted patients found.</p>
//                 )}
//             </>
//           </div>


//           <div className="flex flex-col gap-1.5">
//             <label className="text-[13px] font-medium text-[#343C6A]">Charges</label>
//             <div className="flex gap-2 items-stretch">
//               <div className="relative flex-1">
//                 <select
//                   value={chargeLabel}
//                   onChange={handleChargeLabelChange}
//                   className="appearance-none w-full outline-none text-[14px] border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 bg-white text-[#343C6A]"
//                 >
//                   <option value="" disabled>
//                     Select particular
//                   </option>
//                   {CHARGE_OPTIONS.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//               </div>

//               <input
//                 type="number"
//                 min="0"
//                 value={chargePrice}
//                 onChange={(e) => setChargePrice(e.target.value)}
//                 placeholder="Price"
//                 className="w-28 outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddCharge}
//                 className="flex items-center gap-1 px-3 py-2 rounded-md bg-[#521785] text-white text-[13px] font-medium whitespace-nowrap"
//               >
//                 <Plus size={14} />
//                 Add
//               </button>
//             </div>

//             {chargeLabel === "Other Charges" && (
//               <input
//                 type="text"
//                 value={chargeOtherLabel}
//                 onChange={(e) => setChargeOtherLabel(e.target.value)}
//                 placeholder="Enter charge name"
//                 className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
//               />
//             )}

//             {charges.length > 0 && (
//               <div className="border border-[#d3cccc] rounded-md overflow-hidden mt-1">
//                 <table className="w-full text-[13px]">
//                   <thead>
//                     <tr className="bg-[#F8F9FC] text-[#343C6A]">
//                       <th className="text-left px-3 py-1.5 font-medium">Charge</th>
//                       <th className="text-left px-3 py-1.5 font-medium">Price (&#8377;)</th>
//                       <th className="px-3 py-1.5 w-8"></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {charges.map((c, idx) => (
//                       <tr key={idx} className="border-t border-[#e5e5e5]">
//                         <td className="px-3 py-1.5 text-[#343C6A]">{c.chargeName}</td>
//                         <td className="px-3 py-1.5 text-[#343C6A]">{Number(c.unitPrice).toLocaleString("en-IN")}</td>
//                         <td className="px-3 py-1.5 text-center">
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveCharge(idx)}
//                             className="text-gray-400 hover:text-red-500"
//                           >
//                             <X size={14} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-[13px] font-medium text-[#343C6A]">
//               Discount (&#8377;) <span className="text-[#8BA3CB] font-normal">(optional)</span>
//             </label>
//             <div className="flex gap-2 items-stretch">
//               <input
//                 type="number"
//                 min="0"
//                 value={discountInput}
//                 onChange={(e) => setDiscountInput(e.target.value)}
//                 placeholder="e.g. 200"
//                 className="flex-1 outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
//               />
//               <button
//                 type="button"
//                 onClick={handleApplyDiscount}
//                 className="px-4 py-2 rounded-md border border-[#521785] text-[#521785] text-[13px] font-medium whitespace-nowrap hover:bg-[#F3E8FF]"
//               >
//                 Apply
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 pt-2">
//             <Button type="button" onClick={handleClose} className="border border-[#d3cccc] bg-white text-[#343C6A] w-auto px-4 py-2" disabled={submitting}>
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-[#521785] text-white w-auto px-4 py-2 flex items-center justify-center gap-1.5" disabled={submitting}>
//               {submitting && <Loader2 size={14} className="animate-spin" />}
//               {submitting ? "Adding..." : "Add"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default GenerateInvoiceModal;










import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Loader2, Plus } from "lucide-react";
import Button from "../../commonComponent/Button";
import { ipdService } from "../../services/ipdService";
import { toast } from "react-toastify";

const initialForm = {
  admissionId: "",
};

const CHARGE_OPTIONS = [
  "IPD Registration",
  "Consulting Fees",
  "Hospital Stay Charges",
  "Nursing Charges",
  "Surgeon Charges",
  "Assistant Surgeon Charges",
  "Anaesthesia Charges",
  "OT Charges",
  "Daily Doctor Visit Charges",
  "Visiting Doctor",
  "IPD Procedure",
  "ICU Charges",
  "Miscellaneous Charges",
  "A - Scan Charges",
  "Endoscopy Charges",
  "ECG",
  "Implant LENS/Mesh",
  "Other Charges",
];

const GenerateInvoiceModal = ({ isOpen, onClose, accountId }) => {

  const [form, setForm] = useState(initialForm);
  const [admissions, setAdmissions] = useState([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [charges, setCharges] = useState([]);
  const [chargeLabel, setChargeLabel] = useState("");
  const [chargeOtherLabel, setChargeOtherLabel] = useState("");
  const [chargePrice, setChargePrice] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const loadAdmissions = async () => {
      setAdmissionsLoading(true);
      setError("");

      try {
        const res = await ipdService.getPatientsWithAccount();

        setAdmissions(res?.data);
      } catch (err) {
        setAdmissions([]);
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load admitted patients."
        );
      } finally {
        setAdmissionsLoading(false);
      }
    };

    loadAdmissions();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && accountId) {
      setForm((prev) => ({ ...prev, admissionId: accountId, }));
    }
  }, [isOpen, accountId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChargeLabelChange = (e) => {
    const value = e.target.value;
    setChargeLabel(value);
    if (value !== "Other Charges") {
      setChargeOtherLabel("");
    }
  };

  const handleAddCharge = () => {
    const isOther = chargeLabel === "Other Charges";
    const finalLabel = isOther ? chargeOtherLabel.trim() : chargeLabel;

    if (!chargeLabel || (isOther && !finalLabel) || chargePrice === "" || Number(chargePrice) < 0) return;

    setCharges((prev) => [
      ...prev,
      { chargeName: finalLabel, unitPrice: Number(chargePrice) },
    ]);
    setChargeLabel("");
    setChargeOtherLabel("");
    setChargePrice("");
  };

  const handleRemoveCharge = (index) => {
    setCharges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      (!form.admissionId)
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        charges,
      };
      console.log("Generate Invoice payload:", payload);
      const res = await ipdService.addPatientAccountCharges(payload, form.admissionId);
      toast.success(res?.message || "Charges added successfullyy...")
      setForm(initialForm);
      setChargeLabel("");
      setChargeOtherLabel("");
      setChargePrice("");
      setCharges([]);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to Add charges. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setCharges([]);
    setChargeLabel("");
    setChargeOtherLabel("");
    setChargePrice("");
    setError("");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
          <h2 className="text-lg font-semibold text-[#343C6A]">
            Add Charges
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {error && (
            <div className="bg-[#FEE2E2] text-[#B91C1C] text-[13px] rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">Patient</label>

            <>
                <div className="relative">
                  <select
                    name="admissionId"
                    value={form.admissionId}
                    onChange={handleChange}
                    className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none disabled:bg-gray-50"
                    required
                    disabled={admissionsLoading || accountId}
                  >
                    <option value="" disabled>
                      {admissionsLoading ? "Loading patients..." : "Select patient"}
                    </option>
                    {admissions.map((a) => (
                      <option key={a.patientId} value={a.accountId}>
                        {a.patientName} ({a.patientUniqueId}) ({a.accountNumber})
                      </option>
                    ))}
                  </select>
                  {admissionsLoading ? (
                    <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                  ) : (
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  )}
                </div>
                {!admissionsLoading && admissions.length === 0 && (
                  <p className="text-[12px] text-[#8BA3CB]">No currently admitted patients found.</p>
                )}
            </>
          </div>


          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#343C6A]">Charges</label>
            <div className="flex gap-2 items-stretch">
              <div className="relative flex-1">
                <select
                  value={chargeLabel}
                  onChange={handleChargeLabelChange}
                  className="appearance-none w-full outline-none text-[14px] border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 bg-white text-[#343C6A]"
                >
                  <option value="" disabled>
                    Select particular
                  </option>
                  {CHARGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <input
                type="number"
                min="0"
                value={chargePrice}
                onChange={(e) => setChargePrice(e.target.value)}
                placeholder="Price"
                className="w-28 outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              />
              <button
                type="button"
                onClick={handleAddCharge}
                className="flex items-center gap-1 px-3 py-2 rounded-md bg-[#521785] text-white text-[13px] font-medium whitespace-nowrap"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            {chargeLabel === "Other Charges" && (
              <input
                type="text"
                value={chargeOtherLabel}
                onChange={(e) => setChargeOtherLabel(e.target.value)}
                placeholder="Enter charge name"
                className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              />
            )}

            {charges.length > 0 && (
              <div className="border border-[#d3cccc] rounded-md overflow-hidden mt-1">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-[#F8F9FC] text-[#343C6A]">
                      <th className="text-left px-3 py-1.5 font-medium">Charge</th>
                      <th className="text-left px-3 py-1.5 font-medium">Price (&#8377;)</th>
                      <th className="px-3 py-1.5 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {charges.map((c, idx) => (
                      <tr key={idx} className="border-t border-[#e5e5e5]">
                        <td className="px-3 py-1.5 text-[#343C6A]">{c.chargeName}</td>
                        <td className="px-3 py-1.5 text-[#343C6A]">{Number(c.unitPrice).toLocaleString("en-IN")}</td>
                        <td className="px-3 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveCharge(idx)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={handleClose} className="border border-[#d3cccc] bg-white text-[#343C6A] w-auto px-4 py-2" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#521785] text-white w-auto px-4 py-2 flex items-center justify-center gap-1.5"
            disabled={submitting || charges.length === 0}>
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default GenerateInvoiceModal;