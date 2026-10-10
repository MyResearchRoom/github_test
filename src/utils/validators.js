
const EMAIL_REGEX =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;
const PASSWORD_REGEX =/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


export function validateEmail(email) {
  const value = String(email || "").trim();
  if (!value) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(value)) {
    return "Enter a valid email";
  }
  return ""
}

export function validateMobile(mobile) {
  const value = String(mobile || "").trim();
  if (!value) {
    return "Mobile number is required";
  }
  if (!MOBILE_REGEX.test(value)){
    return "Enter a valid 10-digit mobile number"
  }
  return ""
}


export function validatePincode(pinCode) {
  const value = String(pinCode || "").trim();
  if (!value) {
    return "Pincode is required";
  }
  if (!PINCODE_REGEX.test(value)) {
    return "Enter a valid 6-digit pincode";
  }
  return ""; 
}



export function validatePassword(password) {
  const value = String(password || "").trim();
  if (!value) {
    return "Password is required";
  }
  if (!PASSWORD_REGEX.test(value)) {
    return "Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 digit, and 1 special character";
  }
  return ""; 
}
