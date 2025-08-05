"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiHome, FiMapPin, FiMail, FiPhone, FiHash } from "react-icons/fi";
import { useMain, Organisation } from "@/context/EstateContext";
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

// ——— TYPES & WALIDACJA ——————————————————————————————————————
type FormState = {
	companyName: string;
	email: string;
	phone: string;
	city: string;
	zipCode: string;
	street: string;
	buildingNumber: string;
};

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
	{ name: "companyName", icon: <FiHash />, placeholder: "Nazwa firmy" },
	{
		name: "email",
		icon: <FiMail />,
		placeholder: "adres@przykład.pl",
		type: "email",
	},
	{ name: "phone", icon: <FiPhone />, placeholder: "+48 123 456 789" },
	{ name: "city", icon: <FiMapPin />, placeholder: "Miasto" },
	{ name: "zipCode", icon: <FiMapPin />, placeholder: "44-200" },
	{ name: "street", icon: <FiMapPin />, placeholder: "Ulica" },
	{ name: "buildingNumber", icon: <FiHome />, placeholder: "Nr budynku" },
];

const validateEmail = (v: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const validateZip = (v: string) => /^\d{2}-\d{3}$/.test(v.trim());
const validatePhone = (v: string) =>
	/^\+48\s?\d{3}\s?\d{3}\s?\d{3}$/.test(v.trim());

interface ModalEditOrganisationProps {
	open: boolean;
	onClose: () => void;
	organisation: Organisation;
}

export default function ModalEditOrganisation({
	open,
	onClose,
	organisation,
}: ModalEditOrganisationProps) {
	const { updateOrganisation } = useMain();
	const { showToast } = useToastContext();

	const [form, setForm] = useState<FormState>(initialForm);
	const [errors, setErrors] = useState<
		Partial<Record<keyof FormState, string>>
	>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open) {
			setForm({
				companyName: organisation.companyName,
				email: organisation.email,
				phone: organisation.phone,
				city: organisation.address.city,
				zipCode: organisation.address.zipCode,
				street: organisation.address.street,
				buildingNumber: organisation.address.buildingNumber,
			});
			setErrors({});
		}
	}, [open, organisation]);

	const validate = () => {
		const newErrors: Partial<Record<keyof FormState, string>> = {};
		if (!form.companyName.trim()) newErrors.companyName = "Podaj nazwę firmy";
		if (!validateEmail(form.email)) newErrors.email = "Niepoprawny e-mail";
		if (!validatePhone(form.phone)) newErrors.phone = "Format: +48 123 456 789";
		if (!form.city.trim()) newErrors.city = "Podaj miasto";
		if (!validateZip(form.zipCode)) newErrors.zipCode = "Format: 44-200";
		if (!form.street.trim()) newErrors.street = "Podaj ulicę";
		if (!form.buildingNumber.trim())
			newErrors.buildingNumber = "Podaj nr budynku";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement & {
			name: keyof FormState;
		};
		setForm(f => ({ ...f, [name]: value }));
		setErrors(e => ({ ...e, [name]: "" }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);
		try {
			await updateOrganisation(organisation._id, {
				companyName: form.companyName,
				email: form.email,
				phone: form.phone,
				address: {
					city: form.city,
					zipCode: form.zipCode,
					street: form.street,
					buildingNumber: form.buildingNumber,
				},
			});
			showToast({ type: "success", message: "Dane zaktualizowane." });
			onClose();
		} catch (err: any) {
			showToast({ type: "error", message: err.message || "Błąd." });
			setLoading(false);
		}
	};

	if (!open) return null;

	return (
		<Overlay>
			<ModalBox>
				<HeaderRow>
					<IconBox>
						<FiHome size={27} />
					</IconBox>
					<Title>Edytuj organizację</Title>
				</HeaderRow>
				{loading ? (
					<LoaderWrap>
						<Spinner />
						<LoaderText>Aktualizuję dane...</LoaderText>
					</LoaderWrap>
				) : (
					<>
						<Subtitle>Zmodyfikuj dane firmy i zapisz zmiany.</Subtitle>
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
								<ConfirmBtn type='submit'>Aktualizuj dane</ConfirmBtn>
							</Actions>
						</form>
					</>
				)}
			</ModalBox>
		</Overlay>
	);
}
