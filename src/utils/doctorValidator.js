import {
  validateEmail,
  validateMobile,
  validatePassword,
  validatePincode,
} from "./validators";

export const doctorValidator = (data) => {
  const errors = {};

  const {
    email,
    mobileNumber,
    alternateMobileNumber,
    pinCode,
    password,
    confirmPassword,
    isEdit,
  } = data;

  const requiredFields = [
    { key: "name", label: "Doctor name" },
    { key: "specialization", label: "Specialization" },
    { key: "qualification", label: "Qualification" },
    { key: "experience", label: "Experience" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "pinCode", label: "Pin-code" },
    { key: "dateOfBirth", label: "Date of birth" },
    { key: "gender", label: "Gender" },
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

  if (alternateMobileNumber) {
    const mobileError = validateMobile(alternateMobileNumber);
    if (mobileError) {
      errors.alternateMobileNumber = mobileError;
    }
  }

  const pincodeError = validatePincode(pinCode);
  if (pincodeError) {
    errors.pinCode = pincodeError;
  }

  if (!isEdit) {
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
  }

  return errors;
};
