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

const FileWrapper = styled.div`
	margin-bottom: 12px;
`;

const FileLabel = styled.div`
	font-weight: 600;
	margin-bottom: 8px;
	color: #232323;
`;

const FileInput = styled.input`
	display: none;
`;

const FileButton = styled.button`
	background: #ffd100;
	border: none;
	border-radius: 8px;
	padding: 12px 24px;
	font-size: 14px;
	font-weight: 600;
	color: #232323;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	gap: 8px;
	
	&:hover {
		background: #ffc800;
	}
	
	&:disabled {
		background: #e5e5e5;
		color: #666;
		cursor: not-allowed;
	}
`;

const FileButtonText = styled.span`
	font-size: 14px;
	font-weight: 600;
`;

const FileButtonIcon = styled.div`
	width: 16px;
	height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
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

	const [contractFile, setContractFile] = useState<File | null>(null);
	const [contractError, setContractError] = useState<string | null>(null);

	// reset po zamknięciu
	useEffect(() => {
		if (!open) {
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
			setContractError(null);
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
				setContractError("Dozwolony jest tylko plik PDF");
				setContractFile(null);
			} else if (file.size > 5 * 1024 * 1024) {
				setContractError("Maksymalny rozmiar pliku to 5 MB");
				setContractFile(null);
			} else {
				setContractError(null);
				setContractFile(file);
			}
		}
	};

	const validate = (): boolean => {
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

		let fileErr: string | null = null;
		if (!contractFile) fileErr = "Musisz dodać umowę PDF";
		setContractError(fileErr);

		return Object.keys(errs).length === 0 && !fileErr;
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

		if (!validate()) {
			setLoading(false);
			return;
		}

		// FormData (multipart)
		const formData = new FormData();
		formData.append("name", form.name.trim());
		formData.append("bankAccountNumber", form.bankAccountNumber.trim());
		formData.append("rentDueDate", form.rentDueDate.trim());
		formData.append("numberOfFlats", String(form.numberOfFlats));
		formData.append("organisation", selectedOrganisationId!);
		formData.append("contract", contractFile!);

		// POPRAWKA: adres jako jeden obiekt
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
			showToast({ message: "Osiedle dodane!", type: "success" });
		} catch (err: any) {
			setError(err.message || "Wystąpił błąd");
		} finally {
			setLoading(false);
		}
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
						<Title>Dodaj nowe osiedle</Title>
					</TitleRow>
					<StepText>1/2</StepText>
				</HeaderRow>

				<Subtitle>
					Wprowadź podstawowe dane osiedla, aby dodać je do panelu. <br />
					Później będziesz mógł/mogła dodać mieszkańców i ich dane do obliczania
					zaliczek.
				</Subtitle>

				<form onSubmit={handleSubmit} autoComplete='off'>
					{/* INPUT FILE PDF + TEKST */}
					<FileWrapper>
						<FileLabel>
							W celu pełnej weryfikacji osiedla musisz dodać umowę osiedla w
							formacie pdf
						</FileLabel>
						<FileInput
							ref={fileInputRef}
							type='file'
							accept='application/pdf'
							onChange={handleFileChange}
						/>
						<FileButton
							type="button"
							onClick={() => fileInputRef.current?.click()}
						>
							<FileButtonIcon>
								<FiHome size={16} />
							</FileButtonIcon>
							<FileButtonText>Dodaj Umowę Osiedla</FileButtonText>
						</FileButton>
						{contractError && <ErrorMsg>{contractError}</ErrorMsg>}
					</FileWrapper>

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
						<ConfirmButton type='submit' disabled={loading}>
							{loading ? "Dodaję osiedle..." : "Dodaj osiedle i zweryfikuj"}
						</ConfirmButton>
					</Actions>
				</form>
			</Modal>
		</Overlay>
	);
}

// "use client";

// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import { useMain } from "@/context/EstateContext";
// import { useToastContext } from "@/components/toast/ToastContext";
// import {
// 	FiHome,
// 	FiMapPin,
// 	FiCreditCard,
// 	FiUsers,
// 	FiCalendar,
// 	FiHash,
// } from "react-icons/fi";

// // ——— STYLES ——————————————————————————————————————————————————————
// const Overlay = styled.div`
// 	position: fixed;
// 	inset: 0;
// 	background: rgba(0, 0, 0, 0.13);
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	z-index: 2000;
// `;

// const Modal = styled.div`
// 	width: 820px;
// 	max-width: 99vw;
// 	border-radius: 22px;
// 	background: #fafafa;
// 	box-shadow: 0 0 40px rgba(0, 0, 0, 0.17);
// 	padding: 38px 48px 32px 48px;
// 	display: flex;
// 	flex-direction: column;
// 	gap: 18px;
// 	position: relative;
// `;

// const HeaderRow = styled.div`
// 	display: flex;
// 	align-items: flex-start;
// 	justify-content: space-between;
// `;

// const TitleRow = styled.div`
// 	display: flex;
// 	align-items: center;
// 	gap: 14px;
// `;

// const Title = styled.div`
// 	font-size: 23px;
// 	font-weight: 700;
// 	color: #232323;
// 	display: flex;
// 	align-items: center;
// `;

// const IconBox = styled.div`
// 	background: #ffd100;
// 	width: 44px;
// 	height: 44px;
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	border-radius: 14px;
// 	margin-right: 2px;
// `;

// const StepText = styled.div`
// 	font-size: 19px;
// 	color: #bdbdbd;
// 	font-weight: 600;
// 	margin-left: 14px;
// `;

// const Subtitle = styled.div`
// 	font-size: 15px;
// 	color: #8c8c8c;
// 	font-weight: 400;
// 	margin: 10px 0 18px 0;
// `;

// const FieldsGrid = styled.div`
// 	display: grid;
// 	grid-template-columns: 1fr 1fr;
// 	gap: 18px 36px;
// 	margin-bottom: 6px;
// `;

// const FieldBox = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	gap: 7px;
// `;

// const InputRow = styled.div<{ invalid?: boolean }>`
// 	display: flex;
// 	align-items: center;
// 	background: #fff;
// 	border-radius: 11px;
// 	border: 1px solid ${({ invalid }) => (invalid ? "#c81b1b" : "#e3e3e3")};
// 	padding: 0 12px 0 10px;
// 	height: 47px;
// 	transition: border 0.15s;
// 	&:focus-within {
// 		border-color: #ffd100;
// 	}
// `;

// const IconInput = styled.div`
// 	color: #bdbdbd;
// 	font-size: 20px;
// 	margin-right: 10px;
// 	display: flex;
// 	align-items: center;
// `;

// const Input = styled.input`
// 	flex: 1;
// 	border: none;
// 	background: none;
// 	font-size: 15px;
// 	font-family: inherit;
// 	color: #212121;
// 	outline: none;
// 	&::placeholder {
// 		color: #bdbdbd;
// 		font-weight: 400;
// 		font-size: 15px;
// 	}
// `;

// const Actions = styled.div`
// 	display: flex;
// 	justify-content: flex-end;
// 	gap: 20px;
// 	margin-top: 30px;
// `;

// const CancelButton = styled.button`
// 	background: #ededed;
// 	border: none;
// 	border-radius: 10px;
// 	padding: 13px 60px;
// 	font-size: 17px;
// 	font-weight: 500;
// 	color: #535353;
// 	cursor: pointer;
// 	transition: background 0.18s;
// 	&:hover {
// 		background: #e0e0e0;
// 	}
// `;

// const ConfirmButton = styled.button`
// 	background: #ffd100;
// 	border: none;
// 	border-radius: 10px;
// 	padding: 13px 60px;
// 	font-size: 17px;
// 	font-weight: 700;
// 	color: #232323;
// 	cursor: pointer;
// 	box-shadow: 0 0 18px rgba(255, 209, 0, 0.13);
// 	transition: background 0.18s;
// 	&:hover {
// 		background: #ffc800;
// 	}
// `;

// const ErrorMsg = styled.div`
// 	margin: 10px 0 0 0;
// 	font-size: 15px;
// 	color: #c81b1b;
// 	text-align: center;
// `;

// // ——— LOGIKA & WALIDACJA ——————————————————————————————————————
// interface AddEstateModalProps {
// 	open: boolean;
// 	onClose: () => void;
// 	onSuccess: () => void;
// }

// export default function AddEstateModal({
// 	open,
// 	onClose,
// 	onSuccess,
// }: AddEstateModalProps) {
// 	const { selectedOrganisationId, createEstate } = useMain();
// 	const { showToast } = useToastContext();

// 	const [form, setForm] = useState({
// 		name: "",
// 		street: "",
// 		city: "",
// 		zipCode: "",
// 		buildingNumber: "",
// 		bankAccountNumber: "",
// 		rentDueDate: "",
// 		numberOfFlats: "",
// 	});
// 	const [fieldErrors, setFieldErrors] = useState<
// 		Partial<Record<keyof typeof form, string>>
// 	>({});
// 	const [loading, setLoading] = useState(false);

// 	// reset po zamknięciu
// 	useEffect(() => {
// 		if (!open) {
// 			setForm({
// 				name: "",
// 				street: "",
// 				city: "",
// 				zipCode: "",
// 				buildingNumber: "",
// 				bankAccountNumber: "",
// 				rentDueDate: "",
// 				numberOfFlats: "",
// 			});
// 			setFieldErrors({});
// 			setLoading(false);
// 		}
// 	}, [open]);

// 	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		setForm({ ...form, [e.target.name]: e.target.value });
// 		setFieldErrors(fe => ({ ...fe, [e.target.name]: "" }));
// 	};

// 	const validate = (): boolean => {
// 		const errs: Partial<Record<keyof typeof form, string>> = {};
// 		if (!form.name.trim()) errs.name = "Podaj nazwę osiedla";
// 		if (!form.street.trim()) errs.street = "Podaj adres osiedla";
// 		if (!form.city.trim()) errs.city = "Podaj miasto";
// 		if (!/^\d{2}-\d{3}$/.test(form.zipCode)) errs.zipCode = "Format: 00-000";
// 		if (!form.buildingNumber.trim())
// 			errs.buildingNumber = "Podaj numer budynku";
// 		if (!/^\d{4}-\d{4}-\d{4}-\d{4}-\d{4}-\d{4}$/.test(form.bankAccountNumber))
// 			errs.bankAccountNumber = "Format: 0000-0000-0000-0000-0000-0000";
// 		if (!form.numberOfFlats || Number(form.numberOfFlats) <= 0)
// 			errs.numberOfFlats = "Podaj liczbę mieszkań (>0)";
// 		if (!/^[1-9]\d?$/.test(form.rentDueDate))
// 			errs.rentDueDate = "Podaj dzień (1–31)";
// 		setFieldErrors(errs);
// 		return Object.keys(errs).length === 0;
// 	};

// 	// src/components/modal/AddEstateModal.tsx
// 	// ...
// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setError(null);
// 		setLoading(true);

// 		if (!selectedOrganisationId) {
// 			setError("Nie wybrano organizacji dla osiedla!");
// 			setLoading(false);
// 			return;
// 		}

// 		const dto = {
// 			name: form.name.trim(),
// 			address: {
// 				city: form.city.trim(),
// 				zipCode: form.zipCode.trim(),
// 				street: form.street.trim(),
// 				buildingNumber: form.buildingNumber.trim(),
// 			},
// 			bankAccountNumber: form.bankAccountNumber.trim(),
// 			rentDueDate: form.rentDueDate.trim(),
// 			numberOfFlats: Number(form.numberOfFlats),
// 			organisation: selectedOrganisationId,
// 		};

// 		try {
// 			await createEstate(dto);
// 			onSuccess();
// 		} catch (err: any) {
// 			setError(err.message || "Wystąpił błąd");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	if (!open) return null;

// 	return (
// 		<Overlay>
// 			<Modal>
// 				<HeaderRow>
// 					<TitleRow>
// 						<IconBox>
// 							<img
// 								src='/assets/panelEstate/building.png'
// 								alt='icon'
// 								width={27}
// 								height={27}
// 							/>
// 						</IconBox>
// 						<Title>Dodaj nowe osiedle</Title>
// 					</TitleRow>
// 					<StepText>1/2</StepText>
// 				</HeaderRow>

// 				<Subtitle>
// 					Wprowadź podstawowe dane osiedla, aby dodać je do panelu. <br />
// 					Później będziesz mógł/mogła dodać mieszkańców i ich dane do obliczania
// 					zaliczek.
// 				</Subtitle>

// 				<form onSubmit={handleSubmit} autoComplete='off'>
// 					<FieldsGrid>
// 						{/* 1. Nazwa */}
// 						<FieldBox>
// 							<label>
// 								Nazwa osiedla
// 								<InputRow invalid={!!fieldErrors.name}>
// 									<IconInput>
// 										<FiHash />
// 									</IconInput>
// 									<Input
// 										name='name'
// 										value={form.name}
// 										onChange={handleChange}
// 										placeholder='np. Osiedle Słoneczne'
// 									/>
// 								</InputRow>
// 								{fieldErrors.name && <ErrorMsg>{fieldErrors.name}</ErrorMsg>}
// 							</label>
// 						</FieldBox>

// 						{/* 2. Adres */}
// 						<FieldBox>
// 							<label>
// 								Adres osiedla
// 								<InputRow invalid={!!fieldErrors.street}>
// 									<IconInput>
// 										<FiMapPin />
// 									</IconInput>
// 									<Input
// 										name='street'
// 										value={form.street}
// 										onChange={handleChange}
// 										placeholder='np. ul. Skorupki 10'
// 									/>
// 								</InputRow>
// 								{fieldErrors.street && (
// 									<ErrorMsg>{fieldErrors.street}</ErrorMsg>
// 								)}
// 							</label>
// 						</FieldBox>

// 						{/* 3. Miasto */}
// 						<FieldBox>
// 							<label>
// 								Miasto
// 								<InputRow invalid={!!fieldErrors.city}>
// 									<IconInput>
// 										<FiHome />
// 									</IconInput>
// 									<Input
// 										name='city'
// 										value={form.city}
// 										onChange={handleChange}
// 										placeholder='np. Warszawa'
// 									/>
// 								</InputRow>
// 								{fieldErrors.city && <ErrorMsg>{fieldErrors.city}</ErrorMsg>}
// 							</label>
// 						</FieldBox>

// 						{/* 4. Kod pocztowy */}
// 						<FieldBox>
// 							<label>
// 								Kod pocztowy
// 								<InputRow invalid={!!fieldErrors.zipCode}>
// 									<IconInput>
// 										<FiMapPin />
// 									</IconInput>
// 									<Input
// 										name='zipCode'
// 										value={form.zipCode}
// 										onChange={handleChange}
// 										placeholder='np. 00-000'
// 									/>
// 								</InputRow>
// 								{fieldErrors.zipCode && (
// 									<ErrorMsg>{fieldErrors.zipCode}</ErrorMsg>
// 								)}
// 							</label>
// 						</FieldBox>

// 						{/* 5. Nr budynku */}
// 						<FieldBox>
// 							<label>
// 								Nr budynku
// 								<InputRow invalid={!!fieldErrors.buildingNumber}>
// 									<IconInput>
// 										<FiMapPin />
// 									</IconInput>
// 									<Input
// 										name='buildingNumber'
// 										value={form.buildingNumber}
// 										onChange={handleChange}
// 										placeholder='np. 10'
// 									/>
// 								</InputRow>
// 								{fieldErrors.buildingNumber && (
// 									<ErrorMsg>{fieldErrors.buildingNumber}</ErrorMsg>
// 								)}
// 							</label>
// 						</FieldBox>

// 						{/* 6. Nr konta */}
// 						<FieldBox>
// 							<label>
// 								Nr konta bankowego
// 								<InputRow invalid={!!fieldErrors.bankAccountNumber}>
// 									<IconInput>
// 										<FiCreditCard />
// 									</IconInput>
// 									<Input
// 										name='bankAccountNumber'
// 										value={form.bankAccountNumber}
// 										onChange={handleChange}
// 										placeholder='0000-0000-0000-0000-0000-0000'
// 									/>
// 								</InputRow>
// 								{fieldErrors.bankAccountNumber && (
// 									<ErrorMsg>{fieldErrors.bankAccountNumber}</ErrorMsg>
// 								)}
// 							</label>
// 						</FieldBox>

// 						{/* 7. Ilość mieszkań */}
// 						<FieldBox>
// 							<label>
// 								Ilość mieszkań
// 								<InputRow invalid={!!fieldErrors.numberOfFlats}>
// 									<IconInput>
// 										<FiUsers />
// 									</IconInput>
// 									<Input
// 										name='numberOfFlats'
// 										type='number'
// 										value={form.numberOfFlats}
// 										onChange={handleChange}
// 										placeholder='np. 90'
// 										min={1}
// 									/>
// 								</InputRow>
// 								{fieldErrors.numberOfFlats && (
// 									<ErrorMsg>{fieldErrors.numberOfFlats}</ErrorMsg>
// 								)}
// 							</label>
// 						</FieldBox>

// 						{/* 8. Czynsz płatny do */}
// 						<FieldBox>
// 							<label>
// 								Czynsz płatny do
// 								<InputRow invalid={!!fieldErrors.rentDueDate}>
// 									<IconInput>
// 										<FiCalendar />
// 									</IconInput>
// 									<Input
// 										name='rentDueDate'
// 										value={form.rentDueDate}
// 										onChange={handleChange}
// 										placeholder='np. 10'
// 									/>
// 								</InputRow>
// 								{fieldErrors.rentDueDate && (
// 									<ErrorMsg>{fieldErrors.rentDueDate}</ErrorMsg>
// 								)}
// 							</label>
// 						</FieldBox>

// 						<div />
// 					</FieldsGrid>

// 					<Actions>
// 						<CancelButton type='button' onClick={onClose}>
// 							Anuluj
// 						</CancelButton>
// 						<ConfirmButton type='submit' disabled={loading}>
// 							{loading ? "Dodaję osiedle..." : "Dodaj osiedle i zweryfikuj"}
// 						</ConfirmButton>
// 					</Actions>
// 				</form>
// 			</Modal>
// 		</Overlay>
// 	);
// }
