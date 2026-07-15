interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

const Toast = ({ message, visible, onClose }: ToastProps) => {
  if (!visible) return null;

  return (
    <div className="toast">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
};

export default Toast;