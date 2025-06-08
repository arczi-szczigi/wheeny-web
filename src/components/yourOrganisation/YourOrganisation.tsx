import React from "react";
import styled from "styled-components";

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
	border-radius: 32px;
	flex: 1;
	min-width: 260px;
	height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 32px;
	overflow: hidden;
`;

// ZAMIANA TYLKO TEGO FRAGMENTU NA WZÓR TWOJEGO DZIAŁAJĄCEGO PRZYKŁADU
const QuarterCircleWrapper = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	width: 80px;
	height: 80px;
	pointer-events: none;
	z-index: 1;
`;

// SVG ćwiartki, duża, obrót o 0deg (brak transformacji)
const QuarterSvg = styled.svg`
	width: 100%;
	height: 100%;
	display: block;
`;

// Ikona na środku ćwiartki
const QuarterIcon = styled.img`
	position: absolute;
	right: 22px;
	bottom: 12px;
	width: 32px;
	height: 32px;
	z-index: 2;
	pointer-events: none;
`;

const StatNumber = styled.span`
	color: #202020;
	font-size: 40px;
	font-family: Roboto;
	font-weight: 700;
	letter-spacing: 2px;
	z-index: 2;
`;

const StatLabel = styled.span`
	color: #4d4d4d;
	font-size: 12px;
	font-family: Roboto;
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
	font-family: Roboto;
	font-weight: 700;
	letter-spacing: 0.6px;
`;

const CalendarDate = styled.span`
	color: white;
	font-size: 30px;
	font-family: Roboto;
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
	font-family: Roboto;
	font-weight: 700;
	letter-spacing: 1.3px;
	margin: 0;
`;

const ProButton = styled.button`
	background: #ffd100;
	color: #202020;
	font-size: 10px;
	font-family: Roboto;
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
	font-family: Roboto;
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
	font-family: Roboto;
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

export default function YourOrganisation() {
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

	return (
		<Container>
			<StatsRow>
				{/* Osiedla */}
				<StatBox>
					<StatNumber>3</StatNumber>
					<StatLabel>Osiedla</StatLabel>
					<QuarterCircleWrapper>
						<QuarterSvg viewBox='0 0 110 110'>
							<path d='M0,110 A110,110 0 0,1 110,0 L110,110 Z' fill='#FFD100' />
						</QuarterSvg>
						<QuarterIcon
							src='/assets/yourOrganisation/building.svg'
							alt='Ikona osiedla'
						/>
					</QuarterCircleWrapper>
				</StatBox>
				{/* Mieszkańców */}
				<StatBox>
					<StatNumber>145</StatNumber>
					<StatLabel>Mieszkańców</StatLabel>
					<QuarterCircleWrapper>
						<QuarterSvg viewBox='0 0 110 110'>
							<path d='M0,110 A110,110 0 0,1 110,0 L110,110 Z' fill='#E8AE9E' />
						</QuarterSvg>
						<QuarterIcon
							src='/assets/yourOrganisation/residents.svg'
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
							<Icon src='/assets/yourOrganisation/building.svg' alt='' />
							<InputLabel>Nazwa firmy</InputLabel>
						</InputLabelRow>
						<InputField>NAZWA FIRMY</InputField>
					</InputGroup>
					<InputGroup>
						<InputLabelRow>
							<Icon src='/assets/yourOrganisation/building.svg' alt='' />
							<InputLabel>NIP</InputLabel>
						</InputLabelRow>
						<InputField>NIP</InputField>
					</InputGroup>
					<InputGroup>
						<InputLabelRow>
							<Icon src='/assets/yourOrganisation/residents.svg' alt='' />
							<InputLabel>Konto zarejestrowane przez</InputLabel>
						</InputLabelRow>
						<InputField>IMIE NAZWISKO</InputField>
					</InputGroup>
					{/* Kolumna 2 */}
					<InputGroup>
						<InputLabelRow>
							<Icon src='/assets/yourOrganisation/building2.svg' alt='' />
							<InputLabel>Ulica</InputLabel>
						</InputLabelRow>
						<InputField>ULICA</InputField>
					</InputGroup>
					<InputGroup>
						<InputLabelRow>
							<Icon src='/assets/yourOrganisation/building2.svg' alt='' />
							<InputLabel>Miasto</InputLabel>
						</InputLabelRow>
						<InputField>MIASTO</InputField>
					</InputGroup>
					<InputGroup>
						<InputLabelRow>
							<Icon src='/assets/yourOrganisation/building2.svg' alt='' />
							<InputLabel>Kod pocztowy</InputLabel>
						</InputLabelRow>
						<InputField>KOD POCZTOWY</InputField>
					</InputGroup>
					{/* Kolumna 3 */}
					<InputGroup>
						<InputLabelRow>
							<Icon src='/assets/yourOrganisation/telephone.svg' alt='' />
							<InputLabel>Numer telefonu (firmowy)</InputLabel>
						</InputLabelRow>
						<InputField>NUMER TELEFONU</InputField>
					</InputGroup>
					<InputGroup style={{ gridColumn: "2 / span 2" }}>
						<InputLabelRow>
							<Icon src='/assets/yourOrganisation/residents.svg' alt='' />
							<InputLabel>Adres email</InputLabel>
						</InputLabelRow>
						<InputField>FIRMOWY ADRES EMAIL</InputField>
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
						<InputField>Konto podstawowe</InputField>
					</InputGroup>
				</KontoGrid>
			</KontoCard>
		</Container>
	);
}
