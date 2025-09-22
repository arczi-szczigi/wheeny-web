import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiX, FiUser, FiMail, FiPhone, FiLock, FiBriefcase } from "react-icons/fi";
import { useToastContext } from "@/components/toast/ToastContext";

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
	max-width: 500px;
	max-height: 90vh;
	overflow-y: auto;
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
	background: #f3f3f3;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #666;
`;

const Title = styled.h2`
	margin: 0;
	font-size: 20px;
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

const Subtitle = styled.p`
	margin: 8px 0 0 0;
	padding: 0 24px;
	color: #666;
	font-size: 14px;
	font-family: Roboto, sans-serif;
`;

const FieldsGrid = styled.div`
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const FieldBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Label = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #333;
	font-family: Roboto, sans-serif;
`;

const InputRow = styled.div<{ invalid?: boolean }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	border: 1px solid ${props => props.invalid ? "#ef4444" : "#e1e1e1"};
	border-radius: 8px;
	background: white;
	transition: border-color 0.2s;

	&:focus-within {
		border-color: ${props => props.invalid ? "#ef4444" : "#3b82f6"};
	}
`;

const Input = styled.input`
	flex: 1;
	border: none;
	outline: none;
	font-size: 14px;
	color: #333;
	font-family: Roboto, sans-serif;

	&::placeholder {
		color: #9d9d9d;
	}
`;

const Select = styled.select`
	flex: 1;
	border: none;
	outline: none;
	font-size: 14px;
	color: #333;
	font-family: Roboto, sans-serif;
	background: transparent;
	cursor: pointer;
`;

const ErrorText = styled.span`
	font-size: 12px;
	color: #ef4444;
	font-family: Roboto, sans-serif;
`;

const ButtonsRow = styled.div`
	display: flex;
	gap: 12px;
	padding: 0 24px 24px 24px;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
	flex: 1;
	padding: 12px 20px;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	font-family: Roboto, sans-serif;
	cursor: pointer;
	transition: all 0.2s;
	border: none;

	${props => props.variant === "primary" ? `
		background: #3b82f6;
		color: white;
		&:hover:not(:disabled) {
			background: #2563eb;
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

const PasswordNote = styled.p`
	font-size: 12px;
	color: #666;
	margin: 0;
	font-family: Roboto, sans-serif;
	font-style: italic;
`;

// ============ COMPONENT ============

interface EditCoworkerModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: (updatedCoworker: any) => void;
	coworker: any;
}

export default function EditCoworkerModal({
	open,
	onClose,
	onSuccess,
	coworker,
}: EditCoworkerModalProps) {
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

	// Load coworker data when modal opens
	useEffect(() => {
		if (open && coworker) {
			setFormData({
				firstName: coworker.firstName || "",
				lastName: coworker.lastName || "",
				email: coworker.email || "",
				phone: coworker.phone || "",
				password: "", // Always empty for security
				position: coworker.position || "employee",
			});
			setErrors({});
		}
	}, [open, coworker]);

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
			newErrors.email = "Niepoprawny format email";
		}
		if (!formData.phone.trim()) {
			newErrors.phone = "Telefon jest wymagany";
		}
		// Password is optional for updates
		if (formData.password && formData.password.length < 6) {
			newErrors.password = "Hasło musi mieć co najmniej 6 znaków";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validate() || !coworker?._id) return;

		setIsSubmitting(true);
		try {
			const token = localStorage.getItem("token");
			
			// Prepare data - don't send password if empty
			const updateData: any = {
				firstName: formData.firstName.trim(),
				lastName: formData.lastName.trim(),
				email: formData.email.trim(),
				phone: formData.phone.trim(),
				position: formData.position,
			};

			if (formData.password) {
				updateData.password = formData.password;
			}

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coworkers/${coworker._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updateData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				
				// Handle specific email conflict error
				if (response.status === 409 || errorData.message?.includes('Email already exists')) {
					throw new Error("Ten email jest już wykorzystywany. Wprowadź inny email.");
				}
				
				throw new Error(errorData.message || "Błąd aktualizacji danych współpracownika");
			}

			const updatedCoworker = await response.json();
			
			showToast({
				type: "success",
				message: "Dane współpracownika zostały zaktualizowane"
			});

			onSuccess(updatedCoworker);
			
		} catch (error: any) {
			console.error("Błąd aktualizacji współpracownika:", error);
			showToast({
				type: "error",
				message: error.message || "Błąd podczas aktualizacji danych współpracownika"
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
							<FiUser size={20} />
						</IconBox>
						<Title>Edytuj współpracownika</Title>
					</TitleRow>
					<CloseButton onClick={handleClose}>
						<FiX size={18} />
					</CloseButton>
				</HeaderRow>

				<Subtitle>
					Zaktualizuj dane współpracownika "{coworker?.firstName} {coworker?.lastName}"
				</Subtitle>

				<form onSubmit={handleSubmit}>
					<FieldsGrid>
						<FieldBox>
							<Label>Imię</Label>
							<InputRow invalid={!!errors.firstName}>
								<FiUser size={16} color="#9d9d9d" />
								<Input
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									placeholder="Imię"
								/>
							</InputRow>
							{errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Nazwisko</Label>
							<InputRow invalid={!!errors.lastName}>
								<FiUser size={16} color="#9d9d9d" />
								<Input
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									placeholder="Nazwisko"
								/>
							</InputRow>
							{errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Email</Label>
							<InputRow invalid={!!errors.email}>
								<FiMail size={16} color="#9d9d9d" />
								<Input
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="email@example.com"
								/>
							</InputRow>
							{errors.email && <ErrorText>{errors.email}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Telefon</Label>
							<InputRow invalid={!!errors.phone}>
								<FiPhone size={16} color="#9d9d9d" />
								<Input
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="+48 123 456 789"
								/>
							</InputRow>
							{errors.phone && <ErrorText>{errors.phone}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Stanowisko</Label>
							<InputRow>
								<FiBriefcase size={16} color="#9d9d9d" />
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
							<Label>Nowe hasło (opcjonalnie)</Label>
							<InputRow invalid={!!errors.password}>
								<FiLock size={16} color="#9d9d9d" />
								<Input
									name="password"
									type="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Pozostaw puste, aby nie zmieniać"
								/>
							</InputRow>
							{errors.password && <ErrorText>{errors.password}</ErrorText>}
							<PasswordNote>
								Pozostaw puste, jeśli nie chcesz zmieniać hasła
							</PasswordNote>
						</FieldBox>
					</FieldsGrid>

					<ButtonsRow>
						<Button type="button" onClick={handleClose}>
							Anuluj
						</Button>
						<Button type="submit" variant="primary" disabled={isSubmitting}>
							{isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
						</Button>
					</ButtonsRow>
				</form>
			</Modal>
		</Overlay>
	);
}
