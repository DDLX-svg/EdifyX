import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Icon } from '../components/shared/Icon.tsx';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 5000); // Auto-dismiss after 5 seconds
  }, []);

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const toastConfig = {
    success: { icon: 'check-circle', color: 'bg-green-500', iconColor: 'text-green-500' },
    error: { icon: 'x-circle', color: 'bg-red-500', iconColor: 'text-red-500' },
    info: { icon: 'information-circle', color: 'bg-blue-500', iconColor: 'text-blue-500' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] w-full max-w-sm space-y-3">
        {toasts.map(toast => {
          const config = toastConfig[toast.type];
          return (
            <div
              key={toast.id}
              className="bg-white rounded-lg shadow-2xl p-4 flex items-start gap-4 animate-slide-in-right"
              role="alert"
            >
              <Icon name={config.icon} className={`w-6 h-6 flex-shrink-0 ${config.iconColor}`} />
              <div className="flex-grow">
                <p className="font-semibold text-gray-800 capitalize">{toast.type}</p>
                <p className="text-sm text-gray-600">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
