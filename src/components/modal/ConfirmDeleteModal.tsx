import React from "react";
import styled from "styled-components";
import { FiAlertTriangle, FiX } from "react-icons/fi";

// ============ STYLED COMPONENTS ============

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

const Modal = styled.div`
	background: white;
	border-radius: 16px;
	width: 90%;
	max-width: 400px;
	position: relative;
`;

const HeaderRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24px 24px 0 24px;
`;

const TitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const IconBox = styled.div`
	width: 40px;
	height: 40px;
	background: #fee2e2;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #dc2626;
`;

const Title = styled.h2`
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: #202020;
	font-family: Roboto, sans-serif;
`;

const CloseButton = styled.button`
	width: 32px;
	height: 32px;
	border: none;
	background: #f5f5f5;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #666;
	transition: all 0.2s;

	&:hover {
		background: #e5e5e5;
		color: #333;
	}
`;

const Content = styled.div`
	padding: 16px 24px 24px 24px;
`;

const Message = styled.p`
	margin: 0 0 20px 0;
	color: #555;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	line-height: 1.5;
`;

const HighlightText = styled.span`
	font-weight: 600;
	color: #202020;
`;

const ButtonsRow = styled.div`
	display: flex;
	gap: 12px;
`;

const Button = styled.button<{ variant?: "danger" | "secondary" }>`
	flex: 1;
	padding: 12px 20px;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	font-family: Roboto, sans-serif;
	cursor: pointer;
	transition: all 0.2s;
	border: none;

	${props => props.variant === "danger" ? `
		background: #dc2626;
		color: white;
		&:hover:not(:disabled) {
			background: #b91c1c;
		}
		&:disabled {
			background: #9ca3af;
			cursor: not-allowed;
		}
	` : `
		background: #f5f5f5;
		color: #666;
		&:hover {
			background: #e5e5e5;
		}
	`}
`;

// ============ COMPONENT ============

interface ConfirmDeleteModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	isLoading?: boolean;
}

export default function ConfirmDeleteModal({
	open,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Usuń",
	isLoading = false,
}: ConfirmDeleteModalProps) {
	if (!open) return null;

	return (
		<Overlay onClick={onClose}>
			<Modal onClick={e => e.stopPropagation()}>
				<HeaderRow>
					<TitleRow>
						<IconBox>
							<FiAlertTriangle size={20} />
						</IconBox>
						<Title>{title}</Title>
					</TitleRow>
					<CloseButton onClick={onClose}>
						<FiX size={18} />
					</CloseButton>
				</HeaderRow>

				<Content>
					<Message dangerouslySetInnerHTML={{ __html: message }} />

					<ButtonsRow>
						<Button type="button" onClick={onClose} disabled={isLoading}>
							Anuluj
						</Button>
						<Button 
							type="button" 
							variant="danger" 
							onClick={onConfirm}
							disabled={isLoading}
						>
							{isLoading ? "Usuwanie..." : confirmText}
						</Button>
					</ButtonsRow>
				</Content>
			</Modal>
		</Overlay>
	);
}
