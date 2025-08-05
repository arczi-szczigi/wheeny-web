// components/toast/ToastContainer.tsx
import React from "react";
import styled from "styled-components";
import { ToastOptions } from "./useToast";
import Toast from "./Toast";

const BottomRightContainer = styled.div`
	position: fixed;
	bottom: 1rem;
	right: 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	z-index: 5000;
`;

const CenterOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(40, 40, 40, 0.19); /* lekki cień na całość */
	z-index: 9999;
`;

interface ToastContainerProps {
	toasts: ToastOptions[];
	removeToast: (id: string) => void;
}

export default function ToastContainer({
	toasts,
	removeToast,
}: ToastContainerProps) {
	return (
		<>
			{/* Zwykłe toasty */}
			<BottomRightContainer>
				{toasts
					.filter((t: ToastOptions) => t.type !== "confirm")
					.map((t: ToastOptions) => (
						<Toast key={t.id} {...t} onClose={() => removeToast(t.id!)} />
					))}
			</BottomRightContainer>
			{/* Potwierdzenie jako modal na środku */}
			{toasts
				.filter((t: ToastOptions) => t.type === "confirm")
				.map((t: ToastOptions) => (
					<CenterOverlay key={t.id}>
						<Toast {...t} onClose={() => removeToast(t.id!)} />
					</CenterOverlay>
				))}
		</>
	);
}
