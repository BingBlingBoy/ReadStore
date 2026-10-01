import { Toast } from "@/components/Toast";
import React, { ReactNode, useCallback, useContext, useRef, useState } from "react";

interface ToastContextProps {
    showToast: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
}

const ToastContext = React.createContext<ToastContextProps | null>(null);

interface ToastProviderProps {
    children: ReactNode;
    duration?: number;
}

export function ToastProvider({children, duration = 1000}: ToastProviderProps) {
    const [toast, setToast] = useState<ToastMessage[]>([]);
    const nextIdRef = useRef(0)
    
    const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' | 'info') => {
        const id = ++nextIdRef.current;
        setToast(prev => [...prev, {id, message, type}]);
    }, [])
    const removeToast = (id: number) => {
        setToast(prev => prev.filter(toast => toast.id !== id))
    }
    
    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
            {toast && toast.map((item, i) =>
                <Toast
                    message={item.message}
                    type={item.type}
                    onClose={() => removeToast(item.id)}
                    duration={duration}
                    index={i}
                    key={item.id}
                />
            )}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}