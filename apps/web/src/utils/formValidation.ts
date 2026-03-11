/**
 * Validates an email address against a basic RFC-like pattern.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates that a password meets minimum requirements.
 * @param password - The password to validate
 * @param minLength - Minimum password length (default: 6)
 */
export function validatePassword(password: string, minLength: number = 6): boolean {
  return password.length >= minLength;
}

/**
 * Validates that a field is not empty or whitespace-only.
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Login form validation
 */
export function validateLoginForm(email: string, password: string): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!validateRequired(email)) {
    errors.email = 'login.errors.emailRequired';
  } else if (!validateEmail(email)) {
    errors.email = 'login.errors.invalidEmail';
  }

  if (!validateRequired(password)) {
    errors.password = 'login.errors.passwordRequired';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Register form validation
 */
export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  minPasswordLength: number = 6
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!validateRequired(name)) {
    errors.name = 'register.errors.nameRequired';
  }

  if (!validateRequired(email)) {
    errors.email = 'register.errors.emailRequired';
  } else if (!validateEmail(email)) {
    errors.email = 'register.errors.invalidEmail';
  }

  if (!validateRequired(password)) {
    errors.password = 'register.errors.passwordRequired';
  } else if (!validatePassword(password, minPasswordLength)) {
    errors.password = 'register.errors.passwordTooShort';
  }

  if (!validateRequired(confirmPassword)) {
    errors.confirmPassword = 'register.errors.confirmPasswordRequired';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'register.errors.passwordMismatch';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
