// components/toasts/useToast.ts
import { useCallback, useState } from "react";

export type ToastType = "success" | "error" | "confirm";

export interface ToastOptions {
	id?: string;
	type: ToastType;
	message: string;
	onConfirm?: () => void;
	onCancel?: () => void;
}

export const useToast = () => {
	const [toasts, setToasts] = useState<ToastOptions[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts(ts => ts.filter(t => t.id !== id));
	}, []);

	const showToast = useCallback(
		(opts: ToastOptions) => {
			const id = opts.id ?? Date.now().toString();
			setToasts(ts => [...ts, { ...opts, id }]);

			// jeśli to nie jest toast potwierdzający, usuńmy go po 4 sekundach
			if (opts.type !== "confirm") {
				setTimeout(() => removeToast(id), 4000);
			}
		},
		[removeToast]
	);

	return { toasts, showToast, removeToast };
};
