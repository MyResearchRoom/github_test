import { validateEmail, validateMobile, validatePassword } from "./validators";

export const adminDoctorValidator = (data) => {
  const errors = {};

  const { email, mobileNumber, password, confirmPassword } = data;

  const requiredFields = [
    { key: "name", label: "Doctor name" },
    { key: "address", label: "Address" },
    { key: "dateOfBirth", label: "Date of birth" },
    { key: "gender", label: "Gender" },
    { key: "clinicName", label: "Clinic name" },
    { key: "medicalLicenceNumber", label: "Medical licence number" },
    { key: "medicalDegree", label: "Qualification" },
    { key: "clinicAddress", label: "Clinic address" },
    { key: "experience", label: "Experience" },
    { key: "department", label: "Department" },


  ];

  // Loop through required fields
  requiredFields.forEach(({ key, label }) => {
    const value = data[key];
    if (!value || String(value).trim() === "") {
      errors[key] = `${label} is required.`;
    }
  });

  // Email validation
  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  // mobile validation
  const mobileError = validateMobile(mobileNumber);
  if (mobileError) {
    errors.mobileNumber = mobileError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }
  const confirmPasswordError = validatePassword(confirmPassword);
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Password do not match";
  }

  return errors;
};
