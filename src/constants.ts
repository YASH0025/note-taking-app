export const CONSTANTS = {
    USERNAME_EXISTS: 'This Username is already taken. Please try another.',
    ENTER_USER_NAME: 'Please enter your Username.',
    USERNAME_SPECIAL_CHARACTERS: 'Special characters not allowed in user name',
    USERNAME_WHITE_SPACE_MESSAGE: 'User Name should not contain white spaces',
    USERNAME_NOT_FOUND: 'User name not found',
    FIRSTNAME_SPECIAL_CHARACTERS: 'Special characters not allowed in first name',
    FIRSTNAME_WHITE_SPACE_MESSAGE: 'First Name should not contain white spaces',
    LASTNAME_SPECIAL_CHARACTERS: 'Special characters not allowed in last name',
    LASTNAME_WHITE_SPACE_MESSAGE: 'Last Name should not contain white spaces',
    FULLNAME_SPECIAL_CHARACTERS: 'Special characters not allowed in full name',
    FULLNAME_INVALID_MESSAGE: 'Invalid full name',
    PASSWORD_WHITE_SPACE_MESSAGE: 'Password should not contain white spaces',
    STRONG_PASSWORD: 'Password must have minimum 8 characters, with at least 1 upper case letter, 1 lower case letter, 1 numeric and 1 special character.',
    EMAIL_NOT_EMPTY: 'Please enter an Email Id.',
    EMAIL_VALID: 'Please enter a valid Email Id.',
    EMAIL_EXISTS: 'This Email Id is already registered. Please try another.',
    ENTER_FULLNAME: 'Please enter your full name.',
    ENTER_FIRSTNAME: 'Please enter your first name.',
    EMAIL_NOT_FOUND: 'Email not found',
    ENTER_LASTNAME: 'Please enter your Last Name.',
    FULL_NAME_LENGTH: 'Full name max 50 characters',
    FORGOT_PASSWORD_SUBJECT: 'Reset Password request for',
    SUCCESSFULL_VERIFICATION: 'Congratulations, you are now registered with',
    TERMS_AGREE: 'Please agree to the Terms and Policies before you submit registration.',
    EMAIL_CHECK: 'Please provide email for login.',
    REGISTRATION_SUCCESSFULL: 'User registered successfully',
    USER_VERIFICATION_EMAIL: 'Account verification email send successfully',
    USER_REGISTRATION_EMAIL_SUBJECT: 'Welcome to',
    USER_ALREADY_EXISTS: 'User already exist',
    SIGNEDIN_SUCCESS: 'Signedin successfully',
    INVALID_EMAIL_PASSWORD: 'Invalid Email or Password. Please try again',
    INVALID_USERNAMNE_PASSWORD: 'Invalid Username or Password. Please try again',
    OTP_ON_MOBILE_NO: 'An message has been sent with an OTP to your registered mobile number.',
    INVALID_NUMBER: 'Invalid mobile number',
    // OTP_ON_EMAIL: 'Your Password has been sent to the registered Email Id.',
    OTP_ON_EMAIL: 'Password reset link has been sent to the registered Email Id.',
    PASSWORD_UPDATED_SUCCESSFULLY: 'The password has been updated.',
    PASSWORD_IDENTICAL_ERROR_MESSAGE: 'Password and Confirm Password fields must be identical. Please try again.',
    USER_DELETE_SUCCESS: 'The user has been deleted.',
    USER_DELETE_ERROR: 'The user could not be deleted. Please try again or contact the Administration.',
    UNAUTHORISED_ACCESS: 'Unauthorized Access: You do not have the required permissions to perform this action. Please log in or contact the administrator for assistance.',
    TASK_DELETE_SUCCESS: 'The task has been deleted.',
    TASK_DELETE_ERROR: 'The task could not be deleted. Please try again or contact the Administration.',
    NOT_A_VALID_REQUEST: 'Not a valid request',
    UNKNOWN_ERROR_DURING_SIGNUP: 'An error occurred during signing-up user',
    UNKNOWN_ERROR_DURING_SIGNIN: 'An error occurred during signin-in user',
    UNKNOWN_ERROR: 'Sorry, we are currently unable to service your request. Please try after some time.',

}

export const taskConstants = {
    categoryTypes: ['IMAGE', 'AUDIO', 'VIDEO', 'TEXT'],
    formatsAllowed: {
        IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'],
        AUDIO: ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma'],
        VIDEO: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', '3gp', 'mpeg']
    }
}

export const errorFormatter = (err: any) => {
    if (err?.extensions?.originalError && err?.extensions?.originalError['message'].length > 0) {
        return ({ message: err.extensions.originalError['message'], statusCode: err.extensions.originalError['statusCode'] })
    } else {
        const customError = {
            message: [err?.message],
            statusCode: 400
        }
        return customError
    }
} 