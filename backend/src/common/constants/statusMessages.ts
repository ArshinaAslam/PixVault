export const MESSAGES = {
  AUTH: {
    REQUIRED_FIELDS: 'Name, email and password are required',
    EMAIL_EXISTS: 'An account with this email already exists',
    SIGNUP_SUCCESS: 'Account created successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Authentication required',
    INVALID_TOKEN: 'Invalid or expired token',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    TOKEN_MISSING: 'Refresh token is required.',
    USER_FETCHED: 'User fetched successfully',
    USER_NOT_FOUND: 'User not found',
    INVALID_CURRENT_PASSWORD: 'Current password is incorrect',
    SAME_PASSWORD: 'New password must be different from current password',
    PASSWORD_CHANGED: 'Password changed successfully',
  },
  IMAGE: {
    NO_FILES: 'No files were uploaded',
    TITLE_MISMATCH: 'Number of titles must match number of images',
    NOT_FOUND: 'Image not found',
    UPLOAD_SUCCESS: 'Images uploaded successfully',
    FETCH_SUCCESS: 'Images fetched successfully',
    UPDATE_SUCCESS: 'Image updated successfully',
    DELETE_SUCCESS: 'Image deleted successfully',
    REORDER_SUCCESS: "Images reordered successfully",
    
  },

  COMMON: {
    INTERNAL_SERVER_ERROR: 'Something went wrong',
  },
};
