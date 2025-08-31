"use client";

import React from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import type { Organisation, Estate } from "@/context/EstateContext";

// --- STYLES ---
const Container = styled.div`
	width: 100%;
	max-width: 1400px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 40px;
`;

const StatsRow = styled.div`
	display: flex;
	gap: 24px;
	margin-bottom: 10px;
`;

const StatBox = styled.div`
	position: relative;
	background: white;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 18px;
	flex: 1;
	min-width: 260px;
	height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 32px;
	overflow: hidden;
`;

const QuarterCircleWrapper = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	width: 60px;
	height: 60px;
	pointer-events: none;
	z-index: 1;
`;

const QuarterSvg = styled.svg`
	width: 100%;
	height: 100%;
	display: block;
`;

const QuarterIcon = styled.img`
	position: absolute;
	right: 15px;
	bottom: 12px;
	width: 22px;
	height: 22px;
	z-index: 2;
	pointer-events: none;
`;

const StatNumber = styled.span`
	color: #202020;
	font-size: 40px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 2px;
	z-index: 2;
`;

const StatLabel = styled.span`
	color: #4d4d4d;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
	margin-top: 4px;
	z-index: 2;
`;

const CalendarBox = styled.div`
	background: #202020;
	border-radius: 10px;
	height: 100px;
	min-width: 320px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 40px;
	color: white;
	position: relative;
`;

const CalendarLabel = styled.span`
	color: white;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 0.6px;
`;

const CalendarDate = styled.span`
	color: white;
	font-size: 30px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 1.5px;
	margin-top: 4px;
`;

const Card = styled.div`
	background: #f7f7f7;
	border-radius: 10px;
	padding: 36px 36px 24px 36px;
	margin-top: 0;
`;

const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
	color: #202020;
	font-size: 26px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.3px;
	margin: 0;
`;

const ProButton = styled.button`
	background: #ffd100;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	border: none;
	border-radius: 30px;
	padding: 8px 18px;
	cursor: pointer;
	transition: background 0.2s;
	&:hover {
		background: #ffea80;
	}
`;

const InputsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 22px 24px;
	margin-bottom: 0;
`;

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

const InputLabelRow = styled.div`
	display: flex;
	align-items: center;
	gap: 7px;
`;

const InputLabel = styled.label`
	color: #4d4d4d;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
`;

const Icon = styled.img`
	width: 16px;
	height: 16px;
	display: block;
`;

const InputField = styled.div`
	background: #ededed;
	border-radius: 10px;
	padding: 9px 16px;
	color: #4d4d4d;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
`;

const KontoCard = styled(Card)`
	margin-top: 0;
	padding: 32px 36px 32px 36px;
`;

const KontoGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;
`;

// --- COMPONENT ---
export default function YourOrganisation() {
	const { organisations, selectedOrganisationId, loading, error } = useMain();

	// Znajdź wybraną organizację
	const organisation: Organisation | undefined =
		organisations.find(org => org._id === selectedOrganisationId) ||
		organisations[0];

	const estates: Estate[] = organisation?.estates || [];

	const today = new Date();
	const monthsPL = [
		"stycznia",
		"lutego",
		"marca",
		"kwietnia",
		"maja",
		"czerwca",
		"lipca",
		"sierpnia",
		"września",
		"października",
		"listopada",
		"grudnia",
	];
	const formattedDate = `${today.getDate()} ${
		monthsPL[today.getMonth()]
	} ${today.getFullYear()}`;

	// Liczba osiedli
	const estateCount = estates.length;

	// Liczba mieszkańców (sumujemy liczbę mieszkań ze wszystkich osiedli)
	const residentsCount = estates.reduce(
		(acc, estate) =>
			acc +
			(typeof estate.numberOfFlats === "number" ? estate.numberOfFlats : 0),
		0
	);

	// Dane firmy z organizacji
	const companyName = organisation?.companyName || "-";
	const nip = "-"; // Jeśli masz pole NIP w organizacji to je tu dodaj
	const registeredBy = organisation?.manager ?? "-"; // Jeżeli manager to string, wyświetlamy id, jeśli obiekt to .firstName .lastName
	const address = organisation?.address;
	const street =
		address?.street && address?.buildingNumber
			? `${address.street} ${address.buildingNumber}`
			: address?.street ?? "-";
	const city = address?.city || "-";
	const zipCode = address?.zipCode || "-";
	const phone = organisation?.phone || "-";
	const email = organisation?.email || "-";
	const accountStatus = organisation?.accountStatus || "-";

	return (
		<Container>
			{loading ? (
				<Card>
					<InputField>Ładowanie danych organizacji...</InputField>
				</Card>
			) : error ? (
				<Card>
					<InputField>Błąd: {error}</InputField>
				</Card>
			) : !organisation ? (
				<Card>
					<InputField>Brak wybranej organizacji.</InputField>
				</Card>
			) : (
				<>
					<StatsRow>
						{/* Osiedla */}
						<StatBox>
							<StatNumber>{estateCount}</StatNumber>
							<StatLabel>Osiedla</StatLabel>
							<QuarterCircleWrapper>
								<QuarterSvg viewBox='0 0 110 110'>
									<path
										d='M0,110 A110,110 0 0,1 110,0 L110,110 Z'
										fill='#FFD100'
									/>
								</QuarterSvg>
								<QuarterIcon
									src='/assets/yourOrganisation/building3.svg'
									alt='Ikona osiedla'
								/>
							</QuarterCircleWrapper>
						</StatBox>
						{/* Mieszkańców */}
						<StatBox>
							<StatNumber>{residentsCount}</StatNumber>
							<StatLabel>Mieszkańców</StatLabel>
							<QuarterCircleWrapper>
								<QuarterSvg viewBox='0 0 110 110'>
									<path
										d='M0,110 A110,110 0 0,1 110,0 L110,110 Z'
										fill='#E8AE9E'
									/>
								</QuarterSvg>
								<QuarterIcon
									src='/assets/yourOrganisation/building2.svg'
									alt='Ikona mieszkańców'
								/>
							</QuarterCircleWrapper>
						</StatBox>
						{/* Kalendarz */}
						<CalendarBox>
							<CalendarLabel>Dziś mamy:</CalendarLabel>
							<CalendarDate>{formattedDate}</CalendarDate>
						</CalendarBox>
					</StatsRow>

					{/* --- Dane Twojej firmy --- */}
					<Card>
						<SectionHeader>
							<SectionTitle>Dane Twojej firmy</SectionTitle>
						</SectionHeader>
						<InputsGrid>
							{/* Kolumna 1 */}
							<InputGroup>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/building2.svg' alt='' />
									<InputLabel>Nazwa firmy</InputLabel>
								</InputLabelRow>
								<InputField>{companyName}</InputField>
							</InputGroup>
							<InputGroup>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/building2.svg' alt='' />
									<InputLabel>NIP</InputLabel>
								</InputLabelRow>
								<InputField>{nip}</InputField>
							</InputGroup>
							<InputGroup>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/residents.svg' alt='' />
									<InputLabel>Konto zarejestrowane przez</InputLabel>
								</InputLabelRow>
								<InputField>{registeredBy}</InputField>
							</InputGroup>
							{/* Kolumna 2 */}
							<InputGroup>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/building2.svg' alt='' />
									<InputLabel>Ulica</InputLabel>
								</InputLabelRow>
								<InputField>{street}</InputField>
							</InputGroup>
							<InputGroup>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/building2.svg' alt='' />
									<InputLabel>Miasto</InputLabel>
								</InputLabelRow>
								<InputField>{city}</InputField>
							</InputGroup>
							<InputGroup>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/building2.svg' alt='' />
									<InputLabel>Kod pocztowy</InputLabel>
								</InputLabelRow>
								<InputField>{zipCode}</InputField>
							</InputGroup>
							{/* Kolumna 3 */}
							<InputGroup>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/telephone.svg' alt='' />
									<InputLabel>Numer telefonu (firmowy)</InputLabel>
								</InputLabelRow>
								<InputField>{phone}</InputField>
							</InputGroup>
							<InputGroup style={{ gridColumn: "2 / span 2" }}>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/residents.svg' alt='' />
									<InputLabel>Adres email</InputLabel>
								</InputLabelRow>
								<InputField>{email}</InputField>
							</InputGroup>
						</InputsGrid>
					</Card>
					{/* --- Twoje konto --- */}
					<KontoCard>
						<SectionHeader>
							<SectionTitle>Twoje konto</SectionTitle>
							<ProButton>Odblokuj wersję PRO</ProButton>
						</SectionHeader>
						<KontoGrid>
							<InputGroup>
								<InputLabelRow>
									<Icon src='/assets/yourOrganisation/building.svg' alt='' />
									<InputLabel>Typ twojego konta</InputLabel>
								</InputLabelRow>
								<InputField>
									{accountStatus === "confirmed"
										? "Konto potwierdzone"
										: "Konto podstawowe"}
								</InputField>
							</InputGroup>
						</KontoGrid>
					</KontoCard>
				</>
			)}
		</Container>
	);
}
