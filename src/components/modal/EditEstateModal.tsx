"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import { useToastContext } from "@/components/toast/ToastContext";
import { FiHome, FiMapPin, FiX } from "react-icons/fi";

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
	width: 600px;
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

const InputRow = styled.div<{ invalid?: boolean }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 0 16px;
	height: 48px;
	background: white;
	border: 1px solid ${({ invalid }) => (invalid ? "#ff4444" : "#e5e5e5")};
	border-radius: 12px;
	transition: all 0.2s;
	&:focus-within {
		border-color: #ffd100;
		box-shadow: 0 0 0 3px rgba(255, 209, 0, 0.1);
	}
`;

const Input = styled.input`
	flex: 1;
	border: none;
	outline: none;
	font-size: 14px;
	color: #232323;
	&::placeholder {
		color: #9d9d9d;
	}
`;

const Label = styled.label`
	font-size: 12px;
	font-weight: 600;
	color: #666;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const ErrorText = styled.div`
	color: #ff4444;
	font-size: 12px;
	margin-top: 4px;
`;

const ButtonRow = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	margin-top: 24px;
`;

const Button = styled.button<{ $primary?: boolean }>`
	padding: 12px 24px;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	border: none;
	transition: all 0.2s;
	
	${({ $primary }) =>
		$primary
			? `
		background: #ffd100;
		color: #232323;
		&:hover {
			background: #ffc800;
		}
	`
			: `
		background: #f5f5f5;
		color: #666;
		&:hover {
			background: #e5e5e5;
		}
	`}
`;

interface EditEstateModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	estateId?: string;
}

export default function EditEstateModal({
	open,
	onClose,
	onSuccess,
	estateId,
}: EditEstateModalProps) {
	const { updateEstate, organisations, selectedOrganisationId } = useMain();
	const { showToast } = useToastContext();

	const selectedOrg = organisations.find(org => org._id === selectedOrganisationId);
	const estates = selectedOrg?.estates || [];
	const estate = estates.find(e => e._id === estateId);

	const [formData, setFormData] = useState({
		name: "",
		city: "",
		street: "",
		buildingNumber: "",
		zipCode: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Load estate data when modal opens
	useEffect(() => {
		if (open && estate) {
			setFormData({
				name: estate.name || "",
				city: estate.address?.city || "",
				street: estate.address?.street || "",
				buildingNumber: estate.address?.buildingNumber || "",
				zipCode: estate.address?.zipCode || "",
			});
			setErrors({});
		}
	}, [open, estate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: "" }));
		}
	};

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Nazwa osiedla jest wymagana";
		}
		if (!formData.city.trim()) {
			newErrors.city = "Miasto jest wymagane";
		}
		if (!formData.street.trim()) {
			newErrors.street = "Ulica jest wymagana";
		}
		if (!formData.buildingNumber.trim()) {
			newErrors.buildingNumber = "Numer budynku jest wymagany";
		}
		if (!formData.zipCode.trim()) {
			newErrors.zipCode = "Kod pocztowy jest wymagany";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validate() || !estateId) return;

		setIsSubmitting(true);
		try {
			await updateEstate(estateId, {
				name: formData.name.trim(),
				address: {
					city: formData.city.trim(),
					street: formData.street.trim(),
					buildingNumber: formData.buildingNumber.trim(),
					zipCode: formData.zipCode.trim(),
				},
			});

			showToast("Osiedle zostało zaktualizowane", "success");
			onSuccess();
		} catch (error) {
			console.error("Błąd aktualizacji osiedla:", error);
			showToast("Błąd podczas aktualizacji osiedla", "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!open) return null;

	return (
		<Overlay onClick={onClose}>
			<Modal onClick={e => e.stopPropagation()}>
				<HeaderRow>
					<TitleRow>
						<IconBox>
							<FiHome size={24} />
						</IconBox>
						<Title>Edytuj osiedle</Title>
					</TitleRow>
					<CloseButton onClick={onClose}>
						<FiX size={20} />
					</CloseButton>
				</HeaderRow>

				<Subtitle>
					Zaktualizuj dane osiedla "{estate?.name}"
				</Subtitle>

				<form onSubmit={handleSubmit}>
					<FieldsGrid>
						<FieldBox>
							<Label>Nazwa osiedla</Label>
							<InputRow invalid={!!errors.name}>
								<FiHome size={16} color="#9d9d9d" />
								<Input
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Nazwa osiedla"
								/>
							</InputRow>
							{errors.name && <ErrorText>{errors.name}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Miasto</Label>
							<InputRow invalid={!!errors.city}>
								<FiMapPin size={16} color="#9d9d9d" />
								<Input
									name="city"
									value={formData.city}
									onChange={handleChange}
									placeholder="Miasto"
								/>
							</InputRow>
							{errors.city && <ErrorText>{errors.city}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Ulica</Label>
							<InputRow invalid={!!errors.street}>
								<FiMapPin size={16} color="#9d9d9d" />
								<Input
									name="street"
									value={formData.street}
									onChange={handleChange}
									placeholder="Ulica"
								/>
							</InputRow>
							{errors.street && <ErrorText>{errors.street}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Numer budynku</Label>
							<InputRow invalid={!!errors.buildingNumber}>
								<FiMapPin size={16} color="#9d9d9d" />
								<Input
									name="buildingNumber"
									value={formData.buildingNumber}
									onChange={handleChange}
									placeholder="Numer budynku"
								/>
							</InputRow>
							{errors.buildingNumber && <ErrorText>{errors.buildingNumber}</ErrorText>}
						</FieldBox>

						<FieldBox>
							<Label>Kod pocztowy</Label>
							<InputRow invalid={!!errors.zipCode}>
								<FiMapPin size={16} color="#9d9d9d" />
								<Input
									name="zipCode"
									value={formData.zipCode}
									onChange={handleChange}
									placeholder="Kod pocztowy"
								/>
							</InputRow>
							{errors.zipCode && <ErrorText>{errors.zipCode}</ErrorText>}
						</FieldBox>
					</FieldsGrid>

					<ButtonRow>
						<Button type="button" onClick={onClose}>
							Anuluj
						</Button>
						<Button type="submit" $primary disabled={isSubmitting}>
							{isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
						</Button>
					</ButtonRow>
				</form>
			</Modal>
		</Overlay>
	);
} 