// src/components/modal/AddEstateModal.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import { useToastContext } from "@/components/toast/ToastContext";
import {
	FiHome,
	FiMapPin,
	FiCreditCard,
	FiUsers,
	FiCalendar,
	FiHash,
	FiX,
} from "react-icons/fi";

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
	width: 820px;
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

const StepText = styled.div`
	font-size: 19px;
	color: #bdbdbd;
	font-weight: 600;
	margin-left: 14px;
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
	background: #fff;
	border-radius: 11px;
	border: 1px solid ${({ invalid }) => (invalid ? "#c81b1b" : "#e3e3e3")};
	padding: 0 12px 0 10px;
	height: 47px;
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
	font-family: inherit;
	color: #212121;
	outline: none;
	&::placeholder {
		color: #bdbdbd;
		font-weight: 400;
		font-size: 15px;
	}
`;

const Actions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 20px;
	margin-top: 30px;
`;

const CancelButton = styled.button`
	background: #ededed;
	border: none;
	border-radius: 10px;
	padding: 13px 60px;
	font-size: 17px;
	font-weight: 500;
	color: #535353;
	cursor: pointer;
	transition: background 0.18s;
	&:hover {
		background: #e0e0e0;
	}
`;

const ConfirmButton = styled.button`
	background: #ffd100;
	border: none;
	border-radius: 10px;
	padding: 13px 60px;
	font-size: 17px;
	font-weight: 700;
	color: #232323;
	cursor: pointer;
	box-shadow: 0 0 18px rgba(255, 209, 0, 0.13);
	transition: background 0.18s;
	&:hover {
		background: #ffc800;
	}
`;

const ErrorMsg = styled.div`
	margin: 10px 0 0 0;
	font-size: 15px;
	color: #c81b1b;
	text-align: center;
`;

// ——— STYLES DLA KROKU 2 ——————————————————————————————————————————

const FileSection = styled.div`
	background: #fff;
	border-radius: 16px;
	padding: 24px;
	margin: 20px 0;
	border: 1px solid #e3e3e3;
`;

const FileTitle = styled.h3`
	font-size: 18px;
	font-weight: 600;
	color: #232323;
	margin-bottom: 12px;
	display: flex;
	align-items: center;
	gap: 10px;
`;

const FileDescription = styled.p`
	font-size: 15px;
	color: #6b6b6b;
	margin-bottom: 20px;
	line-height: 1.5;
`;

const FileInput = styled.input`
	display: none;
`;

const FileButton = styled.button`
	background: #ffd100;
	border: none;
	border-radius: 12px;
	padding: 14px 28px;
	font-size: 16px;
	font-weight: 600;
	color: #232323;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 16px;
	
	&:hover {
		background: #ffc800;
	}
	
	&:disabled {
		background: #e5e5e5;
		color: #666;
		cursor: not-allowed;
	}
`;

const SelectedFile = styled.div`
	background: #f8f9fa;
	border: 1px solid #e9ecef;
	border-radius: 8px;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
`;

const FileName = styled.span`
	font-size: 14px;
	color: #495057;
	font-weight: 500;
`;

const RemoveButton = styled.button`
	background: none;
	border: none;
	color: #dc3545;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	
	&:hover {
		color: #c82333;
	}
`;

const CheckboxSection = styled.div`
	background: #fff;
	border-radius: 16px;
	padding: 24px;
	margin: 20px 0;
	border: 1px solid #e3e3e3;
`;

const CheckboxTitle = styled.h3`
	font-size: 18px;
	font-weight: 600;
	color: #232323;
	margin-bottom: 20px;
`;

const CheckboxItem = styled.div<{ invalid?: boolean }>`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	margin-bottom: 16px;
	padding: 16px;
	border-radius: 12px;
	border: 1px solid ${({ invalid }) => (invalid ? "#c81b1b" : "#e3e3e3")};
	background: ${({ invalid }) => (invalid ? "#fef2f2" : "#fafafa")};
	transition: all 0.2s;
`;

const Checkbox = styled.input`
	width: 18px;
	height: 18px;
	margin-top: 2px;
`;

const CheckboxLabel = styled.label`
	font-size: 15px;
	color: #374151;
	line-height: 1.5;
	cursor: pointer;
	flex: 1;
`;

const LinkText = styled.a`
	color: #ffd100;
	text-decoration: none;
	font-weight: 600;
	
	&:hover {
		text-decoration: underline;
	}
`;



// ——— LOGIKA & WALIDACJA ——————————————————————————————————————
interface AddEstateModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export default function AddEstateModal({
	open,
	onClose,
	onSuccess,
}: AddEstateModalProps) {
	const { selectedOrganisationId, createEstateWithFile } = useMain();
	const { showToast } = useToastContext();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Stan kroków
	const [currentStep, setCurrentStep] = useState(1);

	const [form, setForm] = useState({
		name: "",
		street: "",
		city: "",
		zipCode: "",
		buildingNumber: "",
		bankAccountNumber: "",
		rentDueDate: "",
		numberOfFlats: "",
	});
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof typeof form, string>>
	>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Krok 2 - umowa i checkboxy
	const [contractFile, setContractFile] = useState<File | null>(null);
	const [fileError, setFileError] = useState<string | null>(null);
	const [dataConsent, setDataConsent] = useState(false);
	const [documentConsent, setDocumentConsent] = useState(false);
	const [policyAcceptance, setPolicyAcceptance] = useState(false);
	const [consentErrors, setConsentErrors] = useState({
		dataConsent: false,
		documentConsent: false,
		policyAcceptance: false,
	});

	// reset po zamknięciu
	useEffect(() => {
		if (!open) {
			setCurrentStep(1);
			setForm({
				name: "",
				street: "",
				city: "",
				zipCode: "",
				buildingNumber: "",
				bankAccountNumber: "",
				rentDueDate: "",
				numberOfFlats: "",
			});
			setFieldErrors({});
			setLoading(false);
			setError(null);
			setContractFile(null);
			setFileError(null);
			setDataConsent(false);
			setDocumentConsent(false);
			setPolicyAcceptance(false);
			setConsentErrors({
				dataConsent: false,
				documentConsent: false,
				policyAcceptance: false,
			});
		}
	}, [open]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		setFieldErrors(fe => ({ ...fe, [e.target.name]: "" }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (file.type !== "application/pdf") {
				setFileError("Dozwolony jest tylko plik PDF");
				setContractFile(null);
			} else if (file.size > 5 * 1024 * 1024) {
				setFileError("Maksymalny rozmiar pliku to 5 MB");
				setContractFile(null);
			} else {
				setFileError(null);
				setContractFile(file);
			}
		}
	};

	const removeFile = () => {
		setContractFile(null);
		setFileError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};



	const validateStep1 = (): boolean => {
		const errs: Partial<Record<keyof typeof form, string>> = {};
		if (!form.name.trim()) errs.name = "Podaj nazwę osiedla";
		if (!form.street.trim()) errs.street = "Podaj adres osiedla";
		if (!form.city.trim()) errs.city = "Podaj miasto";
		if (!/^\d{2}-\d{3}$/.test(form.zipCode)) errs.zipCode = "Format: 00-000";
		if (!form.buildingNumber.trim())
			errs.buildingNumber = "Podaj numer budynku";
		if (!/^\d{4}-\d{4}-\d{4}-\d{4}-\d{4}-\d{4}$/.test(form.bankAccountNumber))
			errs.bankAccountNumber = "Format: 0000-0000-0000-0000-0000-0000";
		if (!form.numberOfFlats || Number(form.numberOfFlats) <= 0)
			errs.numberOfFlats = "Podaj liczbę mieszkań (>0)";
		if (!/^[1-9]\d?$/.test(form.rentDueDate))
			errs.rentDueDate = "Podaj dzień (1–31)";
		setFieldErrors(errs);

		return Object.keys(errs).length === 0;
	};

	const validateStep2 = (): boolean => {
		let isValid = true;
		
		// Walidacja pliku
		if (!contractFile) {
			setFileError("Musisz dodać umowę PDF");
			isValid = false;
		} else {
			setFileError(null);
		}

		// Walidacja checkboxów
		const newConsentErrors = {
			dataConsent: !dataConsent,
			documentConsent: !documentConsent,
			policyAcceptance: !policyAcceptance,
		};
		
		setConsentErrors(newConsentErrors);
		
		if (!dataConsent || !documentConsent || !policyAcceptance) {
			isValid = false;
		}

		return isValid;
	};

	const handleStep1Next = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!selectedOrganisationId) {
			setError("Nie wybrano organizacji dla osiedla!");
			return;
		}

		if (!validateStep1()) {
			return;
		}

		setCurrentStep(2);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		if (!selectedOrganisationId) {
			setError("Nie wybrano organizacji dla osiedla!");
			setLoading(false);
			return;
		}

		if (!validateStep2()) {
			setLoading(false);
			return;
		}

		// FormData dla osiedla z plikiem
		const formData = new FormData();
		formData.append("name", form.name.trim());
		formData.append("bankAccountNumber", form.bankAccountNumber.trim());
		formData.append("rentDueDate", form.rentDueDate.trim());
		formData.append("numberOfFlats", String(form.numberOfFlats));
		formData.append("organisation", selectedOrganisationId!);
		formData.append("contract", contractFile!);

		const address = {
			city: form.city.trim(),
			zipCode: form.zipCode.trim(),
			street: form.street.trim(),
			buildingNumber: form.buildingNumber.trim(),
		};
		formData.append("address", JSON.stringify(address));

		try {
			await createEstateWithFile(formData);
			onSuccess();
			showToast({ message: "Osiedle zostało dodane!", type: "success" });
		} catch (err: any) {
			setError(err.message || "Wystąpił błąd");
		} finally {
			setLoading(false);
		}
	};

	const goBackToStep1 = () => {
		setCurrentStep(1);
		setError(null);
	};

	if (!open) return null;

	return (
		<Overlay>
			<Modal>
				<HeaderRow>
					<TitleRow>
						<IconBox>
							<img
								src='/assets/panelEstate/building.png'
								alt='icon'
								width={27}
								height={27}
							/>
						</IconBox>
						<Title>
							{currentStep === 1 ? "Dodaj nowe osiedle" : "Dodaj umowę osiedla"}
						</Title>
					</TitleRow>
					<StepText>{currentStep}/2</StepText>
				</HeaderRow>

				<Subtitle>
					{currentStep === 1 
						? "Wprowadź podstawowe dane osiedla, aby dodać je do panelu. W następnym kroku będziesz mógł/mogła dodać umowę weryfikacyjną."
						: "Zweryfikuj osiedle, aby aktywować pełną funkcjonalność. Weryfikacja jest potrzebna, aby potwierdzić Twoje prawo do zarządzania danym osiedlem i zapewnić bezpieczeństwo danych. Możesz przeprowadzić ją teraz lub wrócić do tego później."
					}
				</Subtitle>

				{currentStep === 1 ? (
					<form onSubmit={handleStep1Next} autoComplete='off'>

					<FieldsGrid>
						{/* 1. Nazwa */}
						<FieldBox>
							<label>
								Nazwa osiedla
								<InputRow invalid={!!fieldErrors.name}>
									<IconInput>
										<FiHash />
									</IconInput>
									<Input
										name='name'
										value={form.name}
										onChange={handleChange}
										placeholder='np. Osiedle Słoneczne'
									/>
								</InputRow>
								{fieldErrors.name && <ErrorMsg>{fieldErrors.name}</ErrorMsg>}
							</label>
						</FieldBox>

						{/* 2. Adres */}
						<FieldBox>
							<label>
								Adres osiedla
								<InputRow invalid={!!fieldErrors.street}>
									<IconInput>
										<FiMapPin />
									</IconInput>
									<Input
										name='street'
										value={form.street}
										onChange={handleChange}
										placeholder='np. ul. Skorupki 10'
									/>
								</InputRow>
								{fieldErrors.street && (
									<ErrorMsg>{fieldErrors.street}</ErrorMsg>
								)}
							</label>
						</FieldBox>

						{/* 3. Miasto */}
						<FieldBox>
							<label>
								Miasto
								<InputRow invalid={!!fieldErrors.city}>
									<IconInput>
										<FiHome />
									</IconInput>
									<Input
										name='city'
										value={form.city}
										onChange={handleChange}
										placeholder='np. Warszawa'
									/>
								</InputRow>
								{fieldErrors.city && <ErrorMsg>{fieldErrors.city}</ErrorMsg>}
							</label>
						</FieldBox>

						{/* 4. Kod pocztowy */}
						<FieldBox>
							<label>
								Kod pocztowy
								<InputRow invalid={!!fieldErrors.zipCode}>
									<IconInput>
										<FiMapPin />
									</IconInput>
									<Input
										name='zipCode'
										value={form.zipCode}
										onChange={handleChange}
										placeholder='np. 00-000'
									/>
								</InputRow>
								{fieldErrors.zipCode && (
									<ErrorMsg>{fieldErrors.zipCode}</ErrorMsg>
								)}
							</label>
						</FieldBox>

						{/* 5. Nr budynku */}
						<FieldBox>
							<label>
								Nr budynku
								<InputRow invalid={!!fieldErrors.buildingNumber}>
									<IconInput>
										<FiMapPin />
									</IconInput>
									<Input
										name='buildingNumber'
										value={form.buildingNumber}
										onChange={handleChange}
										placeholder='np. 10'
									/>
								</InputRow>
								{fieldErrors.buildingNumber && (
									<ErrorMsg>{fieldErrors.buildingNumber}</ErrorMsg>
								)}
							</label>
						</FieldBox>

						{/* 6. Nr konta */}
						<FieldBox>
							<label>
								Nr konta bankowego
								<InputRow invalid={!!fieldErrors.bankAccountNumber}>
									<IconInput>
										<FiCreditCard />
									</IconInput>
									<Input
										name='bankAccountNumber'
										value={form.bankAccountNumber}
										onChange={handleChange}
										placeholder='0000-0000-0000-0000-0000-0000'
									/>
								</InputRow>
								{fieldErrors.bankAccountNumber && (
									<ErrorMsg>{fieldErrors.bankAccountNumber}</ErrorMsg>
								)}
							</label>
						</FieldBox>

						{/* 7. Ilość mieszkań */}
						<FieldBox>
							<label>
								Ilość mieszkań
								<InputRow invalid={!!fieldErrors.numberOfFlats}>
									<IconInput>
										<FiUsers />
									</IconInput>
									<Input
										name='numberOfFlats'
										type='number'
										value={form.numberOfFlats}
										onChange={handleChange}
										placeholder='np. 90'
										min={1}
									/>
								</InputRow>
								{fieldErrors.numberOfFlats && (
									<ErrorMsg>{fieldErrors.numberOfFlats}</ErrorMsg>
								)}
							</label>
						</FieldBox>

						{/* 8. Czynsz płatny do */}
						<FieldBox>
							<label>
								Czynsz płatny do
								<InputRow invalid={!!fieldErrors.rentDueDate}>
									<IconInput>
										<FiCalendar />
									</IconInput>
									<Input
										name='rentDueDate'
										value={form.rentDueDate}
										onChange={handleChange}
										placeholder='np. 10'
									/>
								</InputRow>
								{fieldErrors.rentDueDate && (
									<ErrorMsg>{fieldErrors.rentDueDate}</ErrorMsg>
								)}
							</label>
						</FieldBox>

						<div />
					</FieldsGrid>

					{error && <ErrorMsg>{error}</ErrorMsg>}

						<Actions>
							<CancelButton type='button' onClick={onClose}>
								Anuluj
							</CancelButton>
							<ConfirmButton type='submit'>
								Dalej
							</ConfirmButton>
						</Actions>
					</form>
				) : (
					<form onSubmit={handleSubmit} autoComplete='off'>
						{/* Sekcja pliku */}
						<FileSection>
							<FileTitle>
								<FiHome size={20} />
								Dodaj umowę osiedla w celach weryfikacji
							</FileTitle>
							
							<FileDescription>
								Prześlij dokument umowy z osiedlem w formacie PDF. Maksymalny rozmiar pliku to 5 MB.
							</FileDescription>

							<FileInput
								ref={fileInputRef}
								type='file'
								accept='application/pdf'
								onChange={handleFileChange}
							/>
							
							{!contractFile ? (
								<FileButton
									type="button"
									onClick={() => fileInputRef.current?.click()}
								>
									<FiHome size={18} />
									Prześlij dokument
								</FileButton>
							) : (
								<SelectedFile>
									<FileName>{contractFile.name}</FileName>
									<RemoveButton type="button" onClick={removeFile}>
										<FiX size={18} />
									</RemoveButton>
								</SelectedFile>
							)}
							
							{fileError && <ErrorMsg>{fileError}</ErrorMsg>}
						</FileSection>

						{/* Sekcja checkboxów */}
						<CheckboxSection>
							<CheckboxTitle>Potwierdzenia i zgody</CheckboxTitle>
							
							<CheckboxItem invalid={consentErrors.dataConsent}>
								<Checkbox
									type="checkbox"
									id="dataConsent"
									checked={dataConsent}
									onChange={(e) => {
										setDataConsent(e.target.checked);
										setConsentErrors(prev => ({ ...prev, dataConsent: false }));
									}}
								/>
								<CheckboxLabel htmlFor="dataConsent">
									*Oświadczam, że wszystkie dane przesłane podczas rejestracji osiedla są prawdziwe, oraz że posiadam odpowiednie 
									prawa do zarządzania danym osiedlem i zapewnienia bezpieczeństwa danych.
								</CheckboxLabel>
							</CheckboxItem>

							<CheckboxItem invalid={consentErrors.documentConsent}>
								<Checkbox
									type="checkbox"
									id="documentConsent"
									checked={documentConsent}
									onChange={(e) => {
										setDocumentConsent(e.target.checked);
										setConsentErrors(prev => ({ ...prev, documentConsent: false }));
									}}
								/>
								<CheckboxLabel htmlFor="documentConsent">
									*Potwierdzam, że zapoznałem/am się z{" "}
									<LinkText href="/regulamin" target="_blank" rel="noopener noreferrer">
										regulaminem
									</LinkText>{" "}
									oraz akceptuję jego postanowienia.
								</CheckboxLabel>
							</CheckboxItem>

							<CheckboxItem invalid={consentErrors.policyAcceptance}>
								<Checkbox
									type="checkbox"
									id="policyAcceptance"
									checked={policyAcceptance}
									onChange={(e) => {
										setPolicyAcceptance(e.target.checked);
										setConsentErrors(prev => ({ ...prev, policyAcceptance: false }));
									}}
								/>
								<CheckboxLabel htmlFor="policyAcceptance">
									*Potwierdzam, że zapoznałem/am się z{" "}
									<LinkText href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer">
										polityką prywatności
									</LinkText>{" "}
									strony i akceptuję ich postanowienia.
								</CheckboxLabel>
							</CheckboxItem>
						</CheckboxSection>

						{error && <ErrorMsg>{error}</ErrorMsg>}

						<Actions>
							<CancelButton type='button' onClick={goBackToStep1}>
								Wstecz
							</CancelButton>
							<ConfirmButton type='submit' disabled={loading}>
								{loading ? "Weryfikuję..." : "Zweryfikuj"}
							</ConfirmButton>
						</Actions>
					</form>
				)}
			</Modal>
		</Overlay>
	);
}
