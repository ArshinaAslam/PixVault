import { useState, useCallback } from "react";

interface ToastState {
  message: string;
  visible: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  }, []);

  const hideToast = () => setToast({ message: "", visible: false });

  return { toast, showToast, hideToast };
};