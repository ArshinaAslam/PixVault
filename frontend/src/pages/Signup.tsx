import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { signupAsync } from "../features/auth/authThunks";
import { validateSignup, type ValidationErrors } from "../utils/validation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validateSignup(email, phone, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await dispatch(signupAsync({ email, phone, password }));
    if (signupAsync.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <span className="auth-brand">PixVault</span>
        <h1>Create your account</h1>
        {error && <p className="error-banner">{error}</p>}

        <div className="form-field">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldErrors.email ? "input-error" : ""}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-field">
          <input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldErrors.phone ? "input-error" : ""}
          />
          {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
        </div>

        <div className="form-field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldErrors.password ? "input-error" : ""}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;