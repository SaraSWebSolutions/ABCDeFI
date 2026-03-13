export const validateEmailOrPhone = (value: string) => {
  if (!value) return "Email or phone is required";

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phoneRegex =
    /^[0-9]{10,15}$/;

  if (!emailRegex.test(value) && !phoneRegex.test(value)) {
    return "Invalid email or phone number";
  }

  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "Password required";

  if (password.length < 6)
    return "Password must be at least 6 characters";

  return "";
};