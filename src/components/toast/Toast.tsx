import React from "react";
import styled, { keyframes, css } from "styled-components";
import { ToastOptions } from "./useToast";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px);}
  to   { opacity: 1; transform: translateY(0);}
`;

// Zwykłe toasty: ostry prawy dolny róg!
const ToastBox = styled.div<{ type: ToastOptions["type"] }>`
	display: flex;
	align-items: center;
	background: #fff;
	animation: ${fadeIn} 0.22s ease;
	box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.1);
	position: relative;
	${({ type }) =>
		type !== "confirm"
			? css`
					padding: 1rem 1.5rem;
					border-radius: 0.5rem 0.5rem 0.5rem 0; /* tylko prawy dolny ostry! */
					border-bottom: 4px solid
						${type === "success"
							? "#4caf50"
							: type === "error"
							? "#f44336"
							: "#ffeb3b"};
					min-width: 320px;
					max-width: 440px;
			  `
			: css`
					/* Modal confirm */
					flex-direction: column;
					align-items: stretch;
					min-width: 480px;
					max-width: 96vw;
					min-height: 150px;
					border-radius: 1.6rem;
					border-bottom: none;
					padding: 2.6rem 2.3rem 2.1rem 2.3rem;
					justify-content: center;
					font-size: 1.32rem;
					font-weight: 500;
			  `}
`;

const Icon = styled.img<{ isConfirm?: boolean }>`
	width: ${({ isConfirm }) => (isConfirm ? "44px" : "28px")};
	height: ${({ isConfirm }) => (isConfirm ? "44px" : "28px")};
	margin-right: ${({ isConfirm }) => (isConfirm ? "2rem" : "1.2rem")};
	flex-shrink: 0;
	margin-bottom: 0;
	margin-top: 0;
	align-self: center;
`;

const Message = styled.div<{ isConfirm?: boolean }>`
	flex: 1;
	font-size: ${({ isConfirm }) => (isConfirm ? "1.32rem" : "1.03rem")};
	color: #232323;
	display: flex;
	align-items: center;
	word-break: break-word;
	${({ isConfirm }) =>
		isConfirm &&
		css`
			text-align: center;
			justify-content: center;
			margin-bottom: 2.2rem;
		`}
`;

// PRZYCISKI CONFIRM – pod tekstem, szerokie
const ConfirmActions = styled.div`
	display: flex;
	flex-direction: row;
	gap: 1.2rem;
	justify-content: center;
`;

const Button = styled.button<{
	variant: "primary" | "secondary";
	wide?: boolean;
}>`
	padding: 1.1rem 0;
	font-size: 1.19rem;
	border: ${({ variant }) =>
		variant === "primary" ? "none" : "1.7px solid #8a8a8a"};
	background: ${({ variant }) =>
		variant === "primary" ? "#ffd600" : "transparent"};
	color: ${({ variant }) => (variant === "primary" ? "#000" : "#333")};
	border-radius: 2.5rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.15s, border 0.15s;
	width: ${({ wide }) => (wide ? "100%" : "auto")};
	min-width: 150px;
	max-width: 280px;
	&:hover {
		background: ${({ variant }) =>
			variant === "primary" ? "#ffe755" : "#f3f3f3"};
	}
`;

const CloseButton = styled.button`
	position: absolute;
	top: 4px;
	right: 6px;
	padding: 0;
	width: 22px;
	height: 22px;
	border: none;
	background: transparent;
	font-size: 1.2rem;
	line-height: 1;
	color: #666;
	cursor: pointer;
`;

export default function Toast(props: ToastOptions & { onClose: () => void }) {
	const { type, message, onConfirm, onCancel, onClose, id } = props;

	const iconSrc =
		type === "success"
			? "/assets/toastIcon/positive.png"
			: type === "error"
			? "/assets/toastIcon/err.png"
			: undefined;

	// CONFIRM – modal na środku
	if (type === "confirm") {
		return (
			<ToastBox type={type}>
				<Message isConfirm>{message}</Message>
				<ConfirmActions>
					<Button
						wide
						variant='primary'
						onClick={() => {
							onConfirm?.();
							onClose();
						}}>
						Tak
					</Button>
					<Button
						wide
						variant='secondary'
						onClick={() => {
							onCancel?.();
							onClose();
						}}>
						Nie
					</Button>
				</ConfirmActions>
			</ToastBox>
		);
	}

	// Zwykły toast (success/error)
	return (
		<ToastBox type={type}>
			{iconSrc && <Icon src={iconSrc} alt={type} />}
			<Message>{message}</Message>
			<CloseButton onClick={onClose}>×</CloseButton>
		</ToastBox>
	);
}
