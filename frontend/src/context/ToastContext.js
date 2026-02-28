"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const addToast = useCallback((message, type = 'default', duration = 4000) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const confirm = useCallback((message) => {
        return new Promise((resolve) => {
            setConfirmDialog({
                message,
                onConfirm: () => {
                    setConfirmDialog(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmDialog(null);
                    resolve(false);
                }
            });
        });
    }, []);

    const value = {
        toast: {
            success: (msg) => addToast(msg, 'success'),
            error: (msg) => addToast(msg, 'error'),
            info: (msg) => addToast(msg, 'info'),
            loading: (msg) => addToast(msg, 'loading'),
            default: (msg) => addToast(msg, 'default'),
            dismiss: (id) => removeToast(id),
            confirm: confirm,
        }
    };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Regular Toasts */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="pointer-events-auto w-full bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.08)] rounded-lg border border-gray-100 p-4 flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300"
                    >
                        {/* Icon based on type */}
                        <div className="shrink-0">
                            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />}
                            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 fill-red-50" />}
                            {t.type === 'info' && <Info className="w-5 h-5 text-blue-500 fill-blue-50" />}
                            {t.type === 'loading' && <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />}
                        </div>

                        {/* Message */}
                        <div className="flex-1 text-[13px] font-medium text-gray-700 leading-snug">
                            {t.message}
                        </div>

                        {/* Close Button (Optional/Subtle) */}
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-3 mb-6">
                            <AlertCircle className="w-6 h-6 text-amber-500 fill-amber-50 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Confirm Action</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {confirmDialog.message}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={confirmDialog.onCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmDialog.onConfirm}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};
