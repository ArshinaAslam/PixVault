export interface ValidationErrors {
  [key: string]: string;
}

export const validateSignup = (
  email: string,
  phone: string,
  password: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(phone.trim())) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Password must contain both letters and numbers';
  }

  return errors;
};

export const validateLogin = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};


export const validatePasswordChange = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required";
  } else if (newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  } else if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    errors.newPassword = "Password must contain both letters and numbers";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your new password";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
