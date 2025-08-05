// src/components/modal/ModalNewOrganisation.tsx
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { FiHome, FiMapPin, FiMail, FiPhone, FiHash } from "react-icons/fi";
import { useMain } from "@/context/EstateContext";

// === STYLES ===
const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.13);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
`;

const ModalBox = styled.div`
	width: 680px;
	max-width: 98vw;
	border-radius: 22px;
	background: #fafafa;
	box-shadow: 0 0 40px rgba(0, 0, 0, 0.17);
	padding: 38px 48px 32px;
	display: flex;
	flex-direction: column;
	gap: 18px;
`;

const HeaderRow = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
`;
const IconBox = styled.div`
	background: #ffd100;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 14px;
`;
const Title = styled.div`
	font-size: 23px;
	font-weight: 700;
	color: #232323;
`;
const Subtitle = styled.div`
	font-size: 15px;
	color: #8c8c8c;
	margin: 10px 0 18px;
`;

const FieldsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 18px 32px;
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
	background: #fff;
	border-radius: 11px;
	padding: 0 12px;
	height: 47px;
	border: 1px solid ${({ invalid }) => (invalid ? "#c81b1b" : "#e3e3e3")};
	transition: border 0.15s;
	&:focus-within {
		border-color: #ffd100;
	}
`;
const IconInput = styled.div`
	color: #bdbdbd;
	font-size: 20px;
	margin-right: 10px;
	display: flex;
	align-items: center;
`;
const Input = styled.input`
	flex: 1;
	border: none;
	background: none;
	font-size: 15px;
	color: #212121;
	outline: none;
	&::placeholder {
		color: #bdbdbd;
	}
`;
const ErrorMsg = styled.div`
	margin: 5px 0 0;
	font-size: 14px;
	color: #c81b1b;
	text-align: left;
`;

const Actions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 20px;
	margin-top: 30px;
`;
const CancelBtn = styled.button`
	background: #ededed;
	border: none;
	border-radius: 10px;
	padding: 13px 60px;
	font-size: 17px;
	font-weight: 500;
	color: #535353;
	cursor: pointer;
	&:hover {
		background: #e0e0e0;
	}
`;
const ConfirmBtn = styled.button`
	background: #ffd100;
	border: none;
	border-radius: 10px;
	padding: 13px 60px;
	font-size: 17px;
	font-weight: 700;
	color: #232323;
	cursor: pointer;
	box-shadow: 0 0 18px rgba(255, 209, 0, 0.13);
	&:hover {
		background: #ffc800;
	}
`;

const LoaderWrap = styled.div`
	width: 100%;
	height: 320px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: #ffd100;
	border-radius: 16px;
`;
const Spinner = styled.div`
	margin-bottom: 24px;
	width: 48px;
	height: 48px;
	border: 6px solid #fff;
	border-top: 6px solid #232323;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
`;
const LoaderText = styled.div`
	font-size: 24px;
	font-weight: 700;
	color: #232323;
`;

// === TYPES & WALIDACJA ===
export type NewOrgPayload = {
	companyName: string;
	email: string;
	phone: string;
	accountStatus: "unconfirmed" | "confirmed";
	manager: string;
	city: string;
	zipCode: string;
	street: string;
	buildingNumber: string;
};

interface ModalNewOrganisationProps {
	open: boolean;
	onClose: () => void;
	createOrganisation: (data: NewOrgPayload) => Promise<void>;
}

type FormState = Pick<
	NewOrgPayload,
	| "companyName"
	| "email"
	| "phone"
	| "city"
	| "zipCode"
	| "street"
	| "buildingNumber"
>;

const initialForm: FormState = {
	companyName: "",
	email: "",
	phone: "",
	city: "",
	zipCode: "",
	street: "",
	buildingNumber: "",
};

type Field = {
	name: keyof FormState;
	icon: React.ReactNode;
	placeholder: string;
	type?: string;
};

const fields: Field[] = [
	{ name: "companyName", icon: <FiHash />, placeholder: "Wpisz nazwę firmy" },
	{
		name: "email",
		icon: <FiMail />,
		placeholder: "np. adres@przykład.pl",
		type: "email",
	},
	{ name: "phone", icon: <FiPhone />, placeholder: "np. +48 000 000 000" },
	{ name: "city", icon: <FiMapPin />, placeholder: "Wpisz miasto" },
	{ name: "zipCode", icon: <FiMapPin />, placeholder: "np. 44-200" },
	{ name: "street", icon: <FiMapPin />, placeholder: "Wpisz ulicę" },
	{ name: "buildingNumber", icon: <FiHome />, placeholder: "Nr budynku" },
];

const validateEmail = (v: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const validateZip = (v: string) => /^\d{2}-\d{3}$/.test(v.trim());
const validatePhone = (v: string) =>
	/^\+48\s?\d{3}\s?\d{3}\s?\d{3}$/.test(v.trim());

export default function ModalNewOrganisation({
	open,
	onClose,
	createOrganisation,
}: ModalNewOrganisationProps) {
	const { manager } = useMain();

	const [form, setForm] = useState<FormState>(initialForm);
	const [errors, setErrors] = useState<
		Partial<Record<keyof FormState, string>>
	>({});
	const [loading, setLoading] = useState(false);

	const reset = () => {
		setForm(initialForm);
		setErrors({});
		setLoading(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement & {
			name: keyof FormState;
		};
		setForm(f => ({ ...f, [name]: value }));
		setErrors(err => ({ ...err, [name]: "" }));
	};

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof FormState, string>> = {};

		if (!form.companyName.trim()) newErrors.companyName = "Podaj nazwę firmy";
		if (!form.email.trim()) newErrors.email = "Podaj adres e-mail";
		else if (!validateEmail(form.email))
			newErrors.email = "Niepoprawny adres e-mail";
		if (!form.phone.trim()) newErrors.phone = "Podaj telefon";
		else if (!validatePhone(form.phone))
			newErrors.phone = "Format: +48 123 456 789";
		if (!form.city.trim()) newErrors.city = "Podaj miasto";
		if (!form.zipCode.trim()) newErrors.zipCode = "Podaj kod pocztowy";
		else if (!validateZip(form.zipCode)) newErrors.zipCode = "Format: 44-200";
		if (!form.street.trim()) newErrors.street = "Podaj ulicę";
		if (!form.buildingNumber.trim())
			newErrors.buildingNumber = "Podaj numer budynku";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);
		try {
			await createOrganisation({
				companyName: form.companyName,
				email: form.email,
				phone: form.phone,
				accountStatus: "unconfirmed",
				manager: manager!._id,
				city: form.city,
				zipCode: form.zipCode,
				street: form.street,
				buildingNumber: form.buildingNumber,
			});
			reset();
			onClose(); // zamykamy modal po sukcesie
		} catch (err) {
			setLoading(false);
			// ewentualnie możesz pokazać error toast z poziomu strony!
		}
	};

	// Gdy zamykamy modal, czyść formularz
	React.useEffect(() => {
		if (!open) reset();
	}, [open]);

	if (!open) return null;

	return (
		<Overlay>
			<ModalBox>
				<HeaderRow>
					<IconBox>
						<FiHome size={27} />
					</IconBox>
					<Title>Dodaj nową organizację</Title>
				</HeaderRow>

				{loading ? (
					<LoaderWrap>
						<Spinner />
						<LoaderText>Dodawanie organizacji...</LoaderText>
					</LoaderWrap>
				) : (
					<>
						<Subtitle>Wprowadź dane firmy, aby dodać ją do panelu.</Subtitle>
						<form onSubmit={handleSubmit} autoComplete='off'>
							<FieldsGrid>
								{fields.map(f => (
									<FieldBox key={f.name}>
										<InputRow invalid={!!errors[f.name]}>
											<IconInput>{f.icon}</IconInput>
											<Input
												name={f.name}
												type={f.type ?? "text"}
												placeholder={f.placeholder}
												value={form[f.name]}
												onChange={handleChange}
												autoComplete='off'
												required
											/>
										</InputRow>
										{errors[f.name] && <ErrorMsg>{errors[f.name]}</ErrorMsg>}
									</FieldBox>
								))}
							</FieldsGrid>
							<Actions>
								<CancelBtn type='button' onClick={onClose}>
									Anuluj
								</CancelBtn>
								<ConfirmBtn type='submit'>Dodaj organizację</ConfirmBtn>
							</Actions>
						</form>
					</>
				)}
			</ModalBox>
		</Overlay>
	);
}
