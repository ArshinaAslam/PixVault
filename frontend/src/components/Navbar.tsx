import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { logoutAsync } from "../features/auth/authThunks";
import ResetPasswordModal from "./ResetPasswordModal";
import Toast from "./Toast";
import { useToast } from "../hooks/useToast";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await dispatch(logoutAsync());
    navigate("/login");
  };

  if (!user) return null;

  const initial = user.email.charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      <span className="navbar-brand">PixVault</span>

      <div className="navbar-right">
       

        <div className="user-menu" ref={menuRef}>
          <button className="user-icon-btn" onClick={() => setMenuOpen((prev) => !prev)}>
            {initial}
          </button>

          {menuOpen && (
            <div className="user-dropdown">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowResetPassword(true);
                }}
              >
                Reset Password
              </button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {showResetPassword && (
        <ResetPasswordModal
          onClose={() => setShowResetPassword(false)}
          onSuccess={() => showToast("Password updated successfully")}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </nav>
  );
};

export default Navbar;