import React from "react";
import styled from "styled-components";

// Kontenery i layouty
const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`;

// Banner - wybrane osiedle
const Banner = styled.div`
	width: 1400px;
	padding: 20px;
	position: absolute;
	top: 0;
	left: 0;
	background: #ffd100;
	border-radius: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const BannerContent = styled.div`
	display: flex;
	flex-direction: row;
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
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 1.2px;
`;

const BannerName = styled.span`
	color: #202020;
	font-size: 22px;
	font-family: Roboto;
	font-weight: 700;
	letter-spacing: 1.1px;
	text-transform: capitalize;
`;

const BannerAddress = styled.span`
	color: #202020;
	font-size: 16px;
	font-family: Roboto;
	font-weight: 300;
	letter-spacing: 0.8px;
`;

const BannerButton = styled.button`
	padding: 9px 20px;
	background: #202020;
	border-radius: 30px;
	color: white;
	font-size: 10px;
	font-family: Roboto;
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

// Główna karta
const Card = styled.div`
	width: 1400px;
	padding: 20px;
	position: absolute;
	top: 180px;
	left: 0;
	background: #fff;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	gap: 30px;
`;

// Sekcja nagłówka + edycji
const CardHeaderRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const CardTitle = styled.span`
	color: #202020;
	font-size: 26px;
	font-family: Roboto;
	font-weight: 700;
	letter-spacing: 1.3px;
`;

const CardEditButton = styled.button`
	padding: 9px 20px;
	background: #ffd100;
	border-radius: 30px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	cursor: pointer;
	transition: opacity 0.2s;
	&:hover {
		opacity: 0.9;
	}
`;

// Formularz danych osiedla
const FormSection = styled.div`
	background: #f3f3f3;
	border-radius: 10px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
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
	padding-top: 5px;
	padding-bottom: 5px;
	padding-right: 10px;
`;

const FieldIcon = styled.img`
	width: 16px;
	height: 16px;
`;

const FieldLabel = styled.span`
	color: #4d4d4d;
	font-size: 14px;
	font-family: Roboto;
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
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.5px;
`;

// Rząd dla bank + czynsz + ilość mieszkań
const FieldsRow3 = styled.div`
	width: 100%;
	display: flex;
	gap: 35px;
`;

const HalfWidthColumn = styled.div`
	flex: 1 1 0;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

// Sekcja weryfikacji nagłówek + przycisk
const VerifyHeaderRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const VerifyTitle = styled.span`
	color: #202020;
	font-size: 26px;
	font-family: Roboto;
	font-weight: 700;
	letter-spacing: 1.3px;
`;

const VerifyButton = styled.button`
	padding: 9px 20px;
	background: #ffd100;
	border-radius: 30px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	cursor: pointer;
	transition: opacity 0.2s;
	&:hover {
		opacity: 0.9;
	}
`;

// Dokument + status
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

const StatusBox = styled.div`
	height: 40px;
	padding: 10px;
	background: #98c580;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	display: flex;
	align-items: center;
`;

const StatusValue = styled.span`
	color: #202020;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.5px;
`;

// ---------------------------
// GŁÓWNY KOMPONENT
// ---------------------------
export const YourEstate = () => {
	return (
		<Wrapper>
			{/* Banner */}
			<Banner>
				<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
					<BannerTitle>Wybrane osiedle</BannerTitle>
					<BannerContent>
						<BannerIcon
							src='/assets/yourEstate/building.png'
							alt='ikona budynku'
						/>
						<BannerInfo>
							<BannerName>Osiedle słoneczne</BannerName>
							<BannerAddress>
								ul. Jerozolimskie 44, 01-345 Warszawa
							</BannerAddress>
						</BannerInfo>
					</BannerContent>
				</div>
				<BannerButton>Przełącz osiedle</BannerButton>
			</Banner>

			{/* Główna karta */}
			<Card>
				{/* Sekcja Dane Osiedla */}
				<CardHeaderRow>
					<CardTitle>Dane Osiedla</CardTitle>
					<CardEditButton>Edytuj dane osiedla</CardEditButton>
				</CardHeaderRow>

				{/* Pola */}
				<FormSection>
					{/* rząd: nazwa osiedla */}
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
								<FieldValue>NAZWA OSIEDLA</FieldValue>
							</FieldValueBox>
						</FieldColumn>
					</FieldsRow>

					{/* rząd: ulica, miasto, kod pocztowy */}
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
								<FieldValue>ULICA</FieldValue>
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
								<FieldValue>MIASTO</FieldValue>
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
								<FieldValue>KOD POCZTOWY</FieldValue>
							</FieldValueBox>
						</FieldColumn>
					</FieldsRow>

					{/* rząd: konto bankowe */}
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
								<FieldValue>NUMER KONTA BANKOWEGO</FieldValue>
							</FieldValueBox>
						</FieldColumn>
					</FieldsRow>

					{/* rząd: czynsz, ilość mieszkań */}
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
								<FieldValue>10 każdego miesiąca</FieldValue>
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
								<FieldValue>55</FieldValue>
							</FieldValueBox>
						</HalfWidthColumn>
					</FieldsRow>
				</FormSection>

				{/* Sekcja Weryfikacji */}
				<VerifyHeaderRow>
					<VerifyTitle>Weryfikacja osiedla</VerifyTitle>
					<VerifyButton>Zweryfikuj ponownie</VerifyButton>
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
							<FieldValue>Umowa Osiedle Słoneczne.pdf</FieldValue>
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
						<StatusBox>
							<StatusValue>Zweryfikowane</StatusValue>
						</StatusBox>
					</VerifyCol>
				</VerifySection>
			</Card>
		</Wrapper>
	);
};

export default YourEstate;
