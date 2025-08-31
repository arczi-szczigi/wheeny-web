"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useToastContext } from "@/components/toast/ToastContext";

// ——— STYLES ——————————————————————————————————————————————————————
const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.13);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
`;

const Modal = styled.div`
	width: 700px;
	max-width: 99vw;
	border-radius: 22px;
	background: #fafafa;
	box-shadow: 0 0 40px rgba(0, 0, 0, 0.17);
	padding: 38px 48px 32px 48px;
	display: flex;
	flex-direction: column;
	gap: 18px;
	position: relative;
`;

const HeaderRow = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
`;

const TitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
`;

const Title = styled.div`
	font-size: 23px;
	font-weight: 700;
	color: #232323;
	display: flex;
	align-items: center;
`;

const IconBox = styled.div`
	background: #ffd100;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 14px;
	margin-right: 2px;
`;

const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	border-radius: 8px;
	color: #666;
	&:hover {
		background: #f0f0f0;
	}
`;

const Subtitle = styled.div`
	font-size: 15px;
	color: #8c8c8c;
	font-weight: 400;
	margin: 10px 0 18px 0;
`;

const FieldsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 18px 36px;
	margin-bottom: 6px;
`;

const FieldBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 7px;
`;

const SingleFieldBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 7px;
	grid-column: 1 / -1;
`;

const Label = styled.label`
	color: #555;
	font-size: 13px;
	font-weight: 500;
	font-family: Roboto, sans-serif;
`;

const InputRow = styled.div<{ invalid?: boolean }>`
	background: ${({ invalid }) => (invalid ? "#ffebee" : "#ffffff")};
	border: 1px solid ${({ invalid }) => (invalid ? "#e57373" : "#e0e0e0")};
	border-radius: 12px;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	gap: 10px;
	transition: border 0.2s;
	&:focus-within {
		border-color: ${({ invalid }) => (invalid ? "#e57373" : "#ffd100")};
	}
`;

const Input = styled.input`
	border: none;
	outline: none;
	flex: 1;
	font-size: 14px;
	color: #333;
	background: transparent;
	font-family: Roboto, sans-serif;
	&::placeholder {
		color: #aaa;
	}
`;

const Select = styled.select`
	border: none;
	outline: none;
	flex: 1;
	font-size: 14px;
	color: #333;
	background: transparent;
	font-family: Roboto, sans-serif;
`;

const ErrorText = styled.div`
	color: #e57373;
	font-size: 12px;
	margin-top: 4px;
`;

const ButtonRow = styled.div`
	display: flex;
	gap: 16px;
	margin-top: 20px;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
	flex: 1;
	padding: 14px 20px;
	border: none;
	border-radius: 12px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s;
	font-family: Roboto, sans-serif;

	${({ variant }) =>
		variant === "primary"
			? `
		background: #ffd100;
		color: #202020;
		&:hover {
			background: #e6c200;
		}
	`
			: `
		background: #e0e0e0;
		color: #666;
		&:hover {
			background: #d0d0d0;
		}
	`}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

// ——— INTERFACE ——————————————————————————————————————————————————————
interface AddCoworkerModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: (coworker: any) => void;
}

export default function AddCoworkerModal({
	open,
	onClose,
	onSuccess,
}: AddCoworkerModalProps) {
	const { showToast } = useToastContext();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		position: "employee",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: "" }));
		}
	};

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "Imię jest wymagane";
		}
		if (!formData.lastName.trim()) {
			newErrors.lastName = "Nazwisko jest wymagane";
		}
		if (!formData.email.trim()) {
			newErrors.email = "Email jest wymagany";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Nieprawidłowy format email";
		}
		if (!formData.phone.trim()) {
			newErrors.phone = "Telefon jest wymagany";
		}
		if (!formData.password.trim()) {
			newErrors.password = "Hasło jest wymagane";
		} else if (formData.password.length < 6) {
			newErrors.password = "Hasło musi mieć minimum 6 znaków";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validate()) return;

		setIsSubmitting(true);
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coworkers`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Błąd tworzenia konta współpracownika");
			}

			const newCoworker = await response.json();
			
			showToast({
				type: "success",
				message: "Konto współpracownika zostało utworzone"
			});

			onSuccess(newCoworker);
			
			// Reset form
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				password: "",
				position: "employee",
			});
			setErrors({});
			
		} catch (error: any) {
			console.error("Błąd tworzenia współpracownika:", error);
			showToast({
				type: "error",
				message: error.message || "Błąd podczas tworzenia konta współpracownika"
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setFormData({
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			password: "",
			position: "employee",
		});
		setErrors({});
		onClose();
	};

	if (!open) return null;

	return (
		<Overlay onClick={handleClose}>
			<Modal onClick={e => e.stopPropagation()}>
				<HeaderRow>
					<TitleRow>
						<IconBox>
							<span style={{ fontSize: "20px" }}>👥</span>
						</IconBox>
						<Title>Dodaj współpracownika</Title>
					</TitleRow>
					<CloseButton onClick={handleClose}>✕</CloseButton>
				</HeaderRow>

				<Subtitle>
					Możesz dodać współpracowników do zarządzania kontem firmowym. Możesz ich usunąć bądź edytować w dowolnym momencie.
				</Subtitle>

				<form onSubmit={handleSubmit}>
					<FieldsGrid>
						<FieldBox>
							<Label>Imię</Label>
							<InputRow invalid={!!errors.firstName}>
								<Input
									type="text"
									name="firstName"
									placeholder="Wpisz imię"
									value={formData.firstName}
									onChange={handleChange}
								/>
							</InputRow>
							{errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Nazwisko</Label>
							<InputRow invalid={!!errors.lastName}>
								<Input
									type="text"
									name="lastName"
									placeholder="Wpisz nazwisko"
									value={formData.lastName}
									onChange={handleChange}
								/>
							</InputRow>
							{errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Adres email</Label>
							<InputRow invalid={!!errors.email}>
								<Input
									type="email"
									name="email"
									placeholder="jan@gmail.com"
									value={formData.email}
									onChange={handleChange}
								/>
							</InputRow>
							{errors.email && <ErrorText>{errors.email}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Numer telefonu</Label>
							<InputRow invalid={!!errors.phone}>
								<Input
									type="tel"
									name="phone"
									placeholder="123-345-678"
									value={formData.phone}
									onChange={handleChange}
								/>
							</InputRow>
							{errors.phone && <ErrorText>{errors.phone}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Stanowisko</Label>
							<InputRow>
								<Select
									name="position"
									value={formData.position}
									onChange={handleChange}
								>
									<option value="employee">Pracownik</option>
									<option value="manager">Manager</option>
									<option value="admin">Administrator</option>
								</Select>
							</InputRow>
						</FieldBox>

						<FieldBox>
							<Label>Hasło</Label>
							<InputRow invalid={!!errors.password}>
								<Input
									type="password"
									name="password"
									placeholder="**********"
									value={formData.password}
									onChange={handleChange}
								/>
							</InputRow>
							{errors.password && <ErrorText>{errors.password}</ErrorText>}
						</FieldBox>
					</FieldsGrid>

					<ButtonRow>
						<Button type="button" variant="secondary" onClick={handleClose}>
							Anuluj
						</Button>
						<Button type="submit" variant="primary" disabled={isSubmitting}>
							{isSubmitting ? "Dodawanie..." : "Zatwierdź"}
						</Button>
					</ButtonRow>
				</form>
			</Modal>
		</Overlay>
	);
}

