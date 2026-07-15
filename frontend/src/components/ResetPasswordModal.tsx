import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { changePassword } from "../features/auth/authApi";
import { validatePasswordChange, type ValidationErrors } from "../utils/validation";

interface ResetPasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ResetPasswordModal = ({ onClose, onSuccess }: ResetPasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      onSuccess();
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to change password");
      } else {
        setError("Network error — please try again");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        {error && <p className="error-banner">{error}</p>}

        <div className="form-field">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={fieldErrors.currentPassword ? "input-error" : ""}
          />
          {fieldErrors.currentPassword && (
            <span className="field-error">{fieldErrors.currentPassword}</span>
          )}
        </div>

        <div className="form-field">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={fieldErrors.newPassword ? "input-error" : ""}
          />
          {fieldErrors.newPassword && (
            <span className="field-error">{fieldErrors.newPassword}</span>
          )}
        </div>

        <div className="form-field">
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={fieldErrors.confirmPassword ? "input-error" : ""}
          />
          {fieldErrors.confirmPassword && (
            <span className="field-error">{fieldErrors.confirmPassword}</span>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordModal;