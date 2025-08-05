// components/toasts/ToastContext.tsx
"use client";
import React, { createContext, useContext } from "react";
import { useToast, ToastOptions } from "./useToast";
import ToastContainer from "./ToastContainer";

type ToastContextType = {
	showToast: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { toasts, showToast, removeToast } = useToast();

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<ToastContainer toasts={toasts} removeToast={removeToast} />
		</ToastContext.Provider>
	);
};

export const useToastContext = (): ToastContextType => {
	const ctx = useContext(ToastContext);
	if (!ctx)
		throw new Error("useToastContext must be used within ToastProvider");
	return ctx;
};
