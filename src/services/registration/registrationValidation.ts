

/**
 * Registration validation utilities.
 *
 * Purpose:
 * - Centralize all validation rules for email and password.
 * - Keep business rules out of UI components.
 * - Provide user-facing messages for success and error states.
 */

/**
 * Shared status used by registration field validations.
 */
export type FieldValidationStatus = "idle" | "valid" | "invalid";

/**
 * Standard validation payload returned by field validators.
 */
export type FieldValidationResult = {
    status: FieldValidationStatus;
    isValid: boolean;
    message: string;
};

/**
 * Password validation payload with the list of missing requirements.
 */
export type PasswordValidationResult = FieldValidationResult & {
    missingRequirements: string[];
};

/**
 * Minimal email syntax check.
 * - We avoid overly strict RFC rules and aim for a practical UI validation.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Basic fiscal code format check (Italy):
 * - 16 alphanumeric uppercase chars.
 * - Actual algorithmic validation will be added later.
 */
const FISCAL_CODE_REGEX = /^[A-Z0-9]{16}$/;

/**
 * Password rules used by the registration flow.
 * - Each rule includes a test function and a short message fragment.
 */
const PASSWORD_RULES: Array<{ id: string; test: (value: string) => boolean; message: string }> = [
    {
        id: "minLength",
        test: (value) => value.length >= 8,
        message: "almeno 8 caratteri",
    },
    {
        id: "upper",
        test: (value) => /[A-Z]/.test(value),
        message: "una lettera maiuscola",
    },
    {
        id: "lower",
        test: (value) => /[a-z]/.test(value),
        message: "una lettera minuscola",
    },
    {
        id: "number",
        test: (value) => /\d/.test(value),
        message: "un numero",
    },
    {
        id: "special",
        test: (value) => /[^A-Za-z0-9]/.test(value),
        message: "un carattere speciale",
    },
];

/**
 * Normalizes an email for case-insensitive comparison.
 */
const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Placeholder for future Codice Fiscale validation logic.
 * Still executed so we don't forget to wire it into the UI flow.
 */
const checkFiscalCode = (_fiscalCode: string): boolean => {
    return true;
};

/**
 * Checks whether the email format is syntactically valid.
 */
export const isEmailSyntaxValid = (email: string): boolean => {
    return EMAIL_REGEX.test(email.trim());
};

/**
 * Checks whether the email already exists in the mock dataset.
 */
export const isEmailAlreadyRegistered = (email: string, emailList: string[]): boolean => {
    const normalized = normalizeEmail(email);
    return emailList.some((stored) => normalizeEmail(stored) === normalized);
};

/**
 * Validates the registration email with syntax and mock existence rules.
 */
export const validateRegistrationEmail = (email: string, emailList: string[]): FieldValidationResult => {
    const trimmed = email.trim();

    if (!trimmed) {
        return { status: "idle", isValid: false, message: "" };
    }

    if (!isEmailSyntaxValid(trimmed)) {
        return {
            status: "invalid",
            isValid: false,
            message: "Formato email non valido.",
        };
    }

    if (isEmailAlreadyRegistered(trimmed, emailList)) {
        return {
            status: "invalid",
            isValid: false,
            message: "Email già registrata.",
        };
    }

    return {
        status: "valid",
        isValid: true,
        message: "Email valida.",
    };
};

/**
 * Builds a user-friendly message for missing password requirements.
 */
const buildPasswordMessage = (missing: string[]): string => {
    if (missing.length === 0) {
        return "Password valida.";
    }

    return `La password deve includere: ${missing.join(", ")}.`;
};

/**
 * Validates the registration password against all required rules.
 */
export const validateRegistrationPassword = (password: string): PasswordValidationResult => {
    if (!password) {
        return {
            status: "idle",
            isValid: false,
            message: "",
            missingRequirements: [],
        };
    }

    const missingRequirements = PASSWORD_RULES.filter((rule) => !rule.test(password)).map(
        (rule) => rule.message,
    );

    if (missingRequirements.length > 0) {
        return {
            status: "invalid",
            isValid: false,
            message: buildPasswordMessage(missingRequirements),
            missingRequirements,
        };
    }

    return {
        status: "valid",
        isValid: true,
        message: buildPasswordMessage(missingRequirements),
        missingRequirements,
    };
};

/**
 * Validates the fiscal code with a minimal format check and a placeholder hook.
 */
export const validateFiscalCode = (fiscalCode: string): FieldValidationResult => {
    const normalized = fiscalCode.trim().toUpperCase();

    if (!normalized) {
        return { status: "idle", isValid: false, message: "" };
    }

    if (!FISCAL_CODE_REGEX.test(normalized)) {
        return { status: "invalid", isValid: false, message: "Codice fiscale non valido" };
    }

    if (!checkFiscalCode(normalized)) {
        return { status: "invalid", isValid: false, message: "Codice fiscale non valido" };
    }

    return { status: "valid", isValid: true, message: "" };
};
