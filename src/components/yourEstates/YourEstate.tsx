"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useMain } from "@/context/EstateContext";
import type { Estate } from "@/context/EstateContext";
import { useToastContext } from "@/components/toast/ToastContext";
import EstateDocumentsModal from "../modal/EstateDocumentsModal";

// --- Styled Components ---
const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32px;
	padding-bottom: 40px;
`;

const Banner = styled.div`
	width: 100%;
	max-width: 1360px;
	padding: 20px;
	background: #ffd100;
	border-radius: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const BannerContent = styled.div`
	display: flex;
	align-items: center;
	gap: 33px;
`;

const BannerInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const BannerTitle = styled.span`
	color: black;
	font-size: 24px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 1.2px;
`;

const BannerName = styled.span`
	color: #202020;
	font-size: 22px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.1px;
	text-transform: capitalize;
`;

const BannerAddress = styled.span`
	color: #202020;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 0.8px;
`;

const BannerButton = styled.button`
	padding: 9px 20px;
	background: #202020;
	border-radius: 30px;
	color: white;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	cursor: pointer;
	transition: opacity 0.2s;
	&:hover {
		opacity: 0.9;
	}
`;

const BannerIcon = styled.img`
	width: 70px;
	height: 70px;
	object-fit: contain;
`;

const Card = styled.div`
	width: 100%;
	max-width: 1360px;
	padding: 20px;
	background: #fff;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	gap: 30px;
`;

const CardHeaderRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const CardTitle = styled.span`
	color: #202020;
	font-size: 26px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.3px;
`;

const CardEditButton = styled.button`
	padding: 9px 20px;
	background: #ffd100;
	border-radius: 30px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	cursor: pointer;
	transition: opacity 0.2s;
	&:hover {
		opacity: 0.9;
	}
`;

const SaveButton = styled.button`
	padding: 9px 20px;
	background: #32b471;
	border-radius: 30px;
	color: #fff;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	cursor: pointer;
	transition: opacity 0.2s;
	&:hover {
		opacity: 0.9;
	}
	margin-left: 10px;
`;

const CancelButton = styled.button`
	padding: 9px 20px;
	background: #cccccc;
	border-radius: 30px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	cursor: pointer;
	transition: opacity 0.2s;
	&:hover {
		opacity: 0.9;
	}
	margin-left: 10px;
`;

const FormSection = styled.div`
	background: #f3f3f3;
	border-radius: 10px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const FieldsRow = styled.div`
	width: 100%;
	display: flex;
	gap: 35px;
`;

const FieldColumn = styled.div`
	flex: 1 1 0;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

const FieldLabelRow = styled.div`
	height: 30px;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 5px 10px 5px 0;
`;

const FieldIcon = styled.img`
	width: 16px;
	height: 16px;
`;

const FieldLabel = styled.span`
	color: #4d4d4d;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
`;

const FieldValueBox = styled.div<{ bg?: string }>`
	height: 40px;
	padding: 10px;
	background: ${({ bg }) => bg ?? "white"};
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	display: flex;
	align-items: center;
`;

const FieldValue = styled.span`
	color: #4d4d4d;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
`;

const FieldInput = styled.input`
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	outline: none;
	background: transparent;
	width: 100%;
	color: #202020;
`;

const HalfWidthColumn = styled.div`
	flex: 1 1 0;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

const VerifyHeaderRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const VerifyTitle = styled.span`
	color: #202020;
	font-size: 26px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.3px;
`;

const VerifyButton = styled.button`
	padding: 9px 20px;
	background: #ffd100;
	border-radius: 30px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	cursor: pointer;
	transition: opacity 0.2s;
	&:hover {
		opacity: 0.9;
	}
`;

const VerifySection = styled.div`
	background: #f3f3f3;
	border-radius: 10px;
	padding: 20px;
	display: flex;
	gap: 20px;
	width: 100%;
`;

const VerifyCol = styled.div`
	flex: 1 1 0;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

const StatusBox = styled.div<{ bg?: string }>`
	height: 40px;
	padding: 10px;
	background: ${({ bg }) => bg || "#98c580"};
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	display: flex;
	align-items: center;
`;

const StatusValue = styled.span`
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
`;

const MessagePopup = styled.div`
	position: fixed;
	top: 50px;
	right: 50px;
	background: #202020;
	color: #fff;
	padding: 18px 32px;
	border-radius: 16px;
	font-size: 16px;
	z-index: 2000;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
	display: flex;
	align-items: center;
	gap: 12px;
	animation: fadeIn 0.2s;
	@keyframes fadeIn {
		from {
			opacity: 0;
			right: 20px;
		}
		to {
			opacity: 1;
			right: 50px;
		}
	}
`;

const Link = styled.a`
	color: #2269b2;
	text-decoration: underline;
	font-size: 11px;
	cursor: pointer;
`;

// ---------------------- LOGIKA ----------------------

function formatAddress(estate: Estate | null) {
	if (!estate || !estate.address) return "";
	const a = estate.address;
	return [a.street, a.buildingNumber ? a.buildingNumber : "", a.zipCode, a.city]
		.filter(Boolean)
		.join(", ");
}

const statusColors = {
	verified: "#98c580",
	verifying: "#ffe46c",
	unverified: "#e18c7d",
};

const statusLabels: Record<string, string> = {
	verified: "Zweryfikowane",
	verifying: "W trakcie weryfikacji",
	unverified: "NIEZWERYFIKOWANE",
};

export const YourEstate: React.FC = () => {
	const {
		organisations,
		selectedEstateId,
		loading,
		error,
		documents,
		forceReload,
		updateEstate,
	} = useMain();

	const { showToast } = useToastContext();
	const router = useRouter();

	// --- wyciągamy osiedle ---
	const estates = organisations.flatMap(org => org.estates || []);
	const estate =
		(estates.find((e: Estate) => e._id === selectedEstateId) as Estate) ||
		(estates[0] as Estate) ||
		null;

	// --- status ---
	const status = estate?.status || "unverified";
	const statusLabel = statusLabels[status] || "Nieznany";
	const statusColor = statusColors[status] || "#e18c7d";

	// --- dokumenty ---

	// --- obsługa popupu info ---
	const [popupMsg, setPopupMsg] = useState<string | null>(null);

	// --- modal dokumentów ---
	const [showDocumentsModal, setShowDocumentsModal] = useState(false);

	// --- tryb edycji ---
	const [edit, setEdit] = useState(false);
	const [editData, setEditData] = useState({
		name: estate?.name || "",
		bankAccountNumber: estate?.bankAccountNumber || "",
		rentDueDate: estate?.rentDueDate || "",
		numberOfFlats: estate?.numberOfFlats?.toString() || "",
		address: {
			street: estate?.address?.street || "",
			buildingNumber: estate?.address?.buildingNumber || "",
			city: estate?.address?.city || "",
			zipCode: estate?.address?.zipCode || "",
		},
	});

	useEffect(() => {
		if (!estate) return;
		setEditData({
			name: estate.name || "",
			bankAccountNumber: estate.bankAccountNumber || "",
			rentDueDate: estate.rentDueDate || "",
			numberOfFlats: estate.numberOfFlats?.toString() || "",
			address: {
				street: estate.address?.street || "",
				buildingNumber: estate.address?.buildingNumber || "",
				city: estate.address?.city || "",
				zipCode: estate.address?.zipCode || "",
			},
		});
	}, [estate]);

	const handleInput = (field: string, value: string) => {
		if (["street", "buildingNumber", "city", "zipCode"].includes(field)) {
			setEditData(prev => ({
				...prev,
				address: { ...prev.address, [field]: value },
			}));
		} else {
			setEditData(prev => ({
				...prev,
				[field]: value,
			}));
		}
	};

	const handleSave = async () => {
		if (!estate) return;
		try {
			await updateEstate(estate._id, {
				name: editData.name,
				bankAccountNumber: editData.bankAccountNumber,
				rentDueDate: editData.rentDueDate,
				numberOfFlats: Number(editData.numberOfFlats),
				address: editData.address,
			});
			showToast({ type: "success", message: "Osiedle zaktualizowane" });
			setEdit(false);
		} catch (e) {
			showToast({ type: "error", message: "Błąd zapisu danych osiedla" });
		}
	};

	const handleVerify = async () => {
		if (!estate) return;
		setPopupMsg("Prośba o weryfikacje została wysłana");
	};

	useEffect(() => {
		if (popupMsg) {
			const t = setTimeout(() => setPopupMsg(null), 3000);
			return () => clearTimeout(t);
		}
	}, [popupMsg]);

	const handleEstateSwitch = () => {
		router.push("/panelEstate");
	};

	return (
		<Wrapper>
			{popupMsg && <MessagePopup>{popupMsg}</MessagePopup>}

			{loading ? (
				<Card>
					<FieldValue>Ładowanie danych osiedla...</FieldValue>
				</Card>
			) : error ? (
				<Card>
					<FieldValue>Błąd: {error}</FieldValue>
				</Card>
			) : !estate ? (
				<Card>
					<FieldValue>Brak wybranego osiedla.</FieldValue>
				</Card>
			) : (
				<>
					<Banner>
						<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
							<BannerTitle>Wybrane osiedle</BannerTitle>
							<BannerContent>
								<BannerIcon
									src='/assets/yourEstate/building.png'
									alt='ikona budynku'
								/>
								<BannerInfo>
									<BannerName>{estate.name}</BannerName>
									<BannerAddress>{formatAddress(estate)}</BannerAddress>
								</BannerInfo>
							</BannerContent>
						</div>
						<BannerButton onClick={handleEstateSwitch}>
							Przełącz osiedle
						</BannerButton>
					</Banner>

					<Card>
						<CardHeaderRow>
							<CardTitle>Dane Osiedla</CardTitle>
							{edit ? (
								<div>
									<SaveButton onClick={handleSave}>Zapisz</SaveButton>
									<CancelButton onClick={() => setEdit(false)}>
										Anuluj
									</CancelButton>
								</div>
							) : (
								<CardEditButton onClick={() => setEdit(true)}>
									Edytuj dane osiedla
								</CardEditButton>
							)}
						</CardHeaderRow>

						<FormSection>
							<FieldsRow>
								<FieldColumn>
									<FieldLabelRow>
										<FieldIcon
											src='/assets/yourEstate/building2.svg'
											alt='ikona budynku'
										/>
										<FieldLabel>Nazwa osiedla</FieldLabel>
									</FieldLabelRow>
									<FieldValueBox>
										{edit ? (
											<FieldInput
												value={editData.name}
												onChange={e => handleInput("name", e.target.value)}
											/>
										) : (
											<FieldValue>{estate.name || "-"}</FieldValue>
										)}
									</FieldValueBox>
								</FieldColumn>
							</FieldsRow>

							<FieldsRow>
								<FieldColumn>
									<FieldLabelRow>
										<FieldIcon
											src='/assets/yourEstate/building2.svg'
											alt='ikona budynku'
										/>
										<FieldLabel>Ulica</FieldLabel>
									</FieldLabelRow>
									<FieldValueBox>
										{edit ? (
											<>
												<FieldInput
													placeholder='Ulica'
													style={{ width: "70%" }}
													value={editData.address.street}
													onChange={e => handleInput("street", e.target.value)}
												/>
												<FieldInput
													placeholder='Nr'
													style={{ width: "25%" }}
													value={editData.address.buildingNumber}
													onChange={e =>
														handleInput("buildingNumber", e.target.value)
													}
												/>
											</>
										) : (
											<FieldValue>
												{estate.address?.street || "-"}
												{estate.address?.buildingNumber
													? " " + estate.address?.buildingNumber
													: ""}
											</FieldValue>
										)}
									</FieldValueBox>
								</FieldColumn>
								<FieldColumn>
									<FieldLabelRow>
										<FieldIcon
											src='/assets/yourEstate/building2.svg'
											alt='ikona budynku'
										/>
										<FieldLabel>Miasto</FieldLabel>
									</FieldLabelRow>
									<FieldValueBox>
										{edit ? (
											<FieldInput
												value={editData.address.city}
												onChange={e => handleInput("city", e.target.value)}
											/>
										) : (
											<FieldValue>{estate.address?.city || "-"}</FieldValue>
										)}
									</FieldValueBox>
								</FieldColumn>
								<FieldColumn>
									<FieldLabelRow>
										<FieldIcon
											src='/assets/yourEstate/building2.svg'
											alt='ikona budynku'
										/>
										<FieldLabel>Kod pocztowy</FieldLabel>
									</FieldLabelRow>
									<FieldValueBox>
										{edit ? (
											<FieldInput
												value={editData.address.zipCode}
												onChange={e => handleInput("zipCode", e.target.value)}
											/>
										) : (
											<FieldValue>{estate.address?.zipCode || "-"}</FieldValue>
										)}
									</FieldValueBox>
								</FieldColumn>
							</FieldsRow>

							<FieldsRow>
								<FieldColumn>
									<FieldLabelRow>
										<FieldIcon
											src='/assets/yourEstate/catalog.svg'
											alt='ikona katalog'
										/>
										<FieldLabel>Nr głównego konta bankowego</FieldLabel>
									</FieldLabelRow>
									<FieldValueBox>
										{edit ? (
											<FieldInput
												value={editData.bankAccountNumber}
												onChange={e =>
													handleInput("bankAccountNumber", e.target.value)
												}
											/>
										) : (
											<FieldValue>{estate.bankAccountNumber || "-"}</FieldValue>
										)}
									</FieldValueBox>
								</FieldColumn>
							</FieldsRow>

							<FieldsRow>
								<HalfWidthColumn>
									<FieldLabelRow>
										<FieldIcon
											src='/assets/yourEstate/czynsz.svg'
											alt='ikona czynsz'
										/>
										<FieldLabel>Czynsz płatny do</FieldLabel>
									</FieldLabelRow>
									<FieldValueBox>
										{edit ? (
											<FieldInput
												placeholder='np. 10'
												value={editData.rentDueDate}
												onChange={e =>
													handleInput("rentDueDate", e.target.value)
												}
											/>
										) : (
											<FieldValue>
												{estate.rentDueDate
													? `do ${estate.rentDueDate} każdego miesiąca`
													: "-"}
											</FieldValue>
										)}
									</FieldValueBox>
								</HalfWidthColumn>
								<HalfWidthColumn>
									<FieldLabelRow>
										<FieldIcon
											src='/assets/yourEstate/residents.svg'
											alt='ikona mieszkańcy'
										/>
										<FieldLabel>Ilość mieszkań</FieldLabel>
									</FieldLabelRow>
									<FieldValueBox>
										{edit ? (
											<FieldInput
												type='number'
												value={editData.numberOfFlats}
												onChange={e =>
													handleInput("numberOfFlats", e.target.value)
												}
											/>
										) : (
											<FieldValue>
												{typeof estate.numberOfFlats === "number"
													? estate.numberOfFlats
													: "-"}
											</FieldValue>
										)}
									</FieldValueBox>
								</HalfWidthColumn>
							</FieldsRow>
						</FormSection>

						<VerifyHeaderRow>
							<VerifyTitle>Weryfikacja osiedla</VerifyTitle>
							<VerifyButton onClick={handleVerify}>
								Zweryfikuj ponownie
							</VerifyButton>
						</VerifyHeaderRow>

						<VerifySection>
							<VerifyCol>
								<FieldLabelRow>
									<FieldIcon
										src='/assets/yourEstate/building2.svg'
										alt='ikona budynku'
									/>
									<FieldLabel>Dokument weryfikujący osiedle</FieldLabel>
								</FieldLabelRow>
								<FieldValueBox>
									<VerifyButton onClick={() => setShowDocumentsModal(true)}>
										Dokumenty Osiedla
									</VerifyButton>
								</FieldValueBox>
							</VerifyCol>
							<VerifyCol>
								<FieldLabelRow>
									<FieldIcon
										src='/assets/yourEstate/building2.svg'
										alt='ikona budynku'
									/>
									<FieldLabel>Status</FieldLabel>
								</FieldLabelRow>
								<StatusBox bg={statusColor}>
									<StatusValue>{statusLabel}</StatusValue>
								</StatusBox>
							</VerifyCol>
						</VerifySection>
					</Card>
				</>
			)}
			
			{/* Modal dokumentów osiedla */}
			{showDocumentsModal && estate && (
				<EstateDocumentsModal
					open={showDocumentsModal}
					onClose={() => setShowDocumentsModal(false)}
					estateId={estate._id}
				/>
			)}
		</Wrapper>
	);
};

export default YourEstate;
