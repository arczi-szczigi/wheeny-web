import React from "react";
import styled from "styled-components";

const COLORS = {
	background: "#FEFEFE",
	border: "#F3F3F3",
	shadow: "1px 1px 10px rgba(0, 0, 0, 0.02)",
	accent: "#FFD100",
	accent2: "#E8AE9E",
	text: "#202020",
	gray: "#DADADA",
	icon: "#4D4D4D",
};

const Wrapper = styled.div<{ $selected?: boolean }>`
	background: ${COLORS.background};
	border-radius: 10px;
	box-shadow: ${COLORS.shadow};
	padding: 10px 22px 10px 22px;
	margin-bottom: 12px;
	min-width: 1250px;
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	gap: 14px;
	border: ${({ $selected }) =>
		$selected ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`};
	transition: border 0.18s;
`;

const TopRow = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 6px;
`;

const Code = styled.div`
	color: black;
	font-size: 20px;
	font-family: "Roboto", sans-serif;
	font-weight: 400;
	letter-spacing: 1px;
`;

const SelectBtn = styled.button<{ $selected?: boolean }>`
	background: ${({ $selected }) =>
		$selected ? COLORS.accent2 : COLORS.accent};
	border-radius: 30px;
	border: none;
	color: ${COLORS.text};
	font-size: 12px;
	font-family: "Roboto", sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
	padding: 8px 38px;
	cursor: pointer;
	transition: background 0.15s, color 0.15s;
	outline: ${({ $selected }) =>
		$selected ? `2px solid ${COLORS.accent2}` : "none"};

	&:hover {
		background: ${({ $selected }) => ($selected ? COLORS.accent2 : "#ffc800")};
	}
`;

const Line = styled.div`
	height: 1px;
	width: 100%;
	background: ${COLORS.border};
	margin: 6px 0 0 0;
`;

const InfoRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 24px;
	margin-top: 0px;
`;

const Icon = styled.img`
	width: 69px;
	height: 69px;
	margin-top: 3px;
	margin-right: 12px;
`;

const EstateInfo = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const Name = styled.div`
	color: ${COLORS.text};
	font-size: 22px;
	font-family: "Roboto", sans-serif;
	font-weight: 700;
	letter-spacing: 1.1px;
	text-transform: capitalize;
`;

const Address = styled.div`
	color: ${COLORS.text};
	font-size: 16px;
	font-family: "Roboto", sans-serif;
	font-weight: 300;
	letter-spacing: 0.8px;
`;

const StatsRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 16px;
	margin-left: 36px;
	margin-top: 6px;
`;

// Zmiana: szare tło, kolorowa ikona, napis na czarno (nie kolorowe tło!)
// Każde pole ma własny "IconBox" ze swoim kolorem
const Stat = styled.div`
	background: #f3f3f3;
	border-radius: 4px;
	min-width: 150px;
	height: 32px;
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 0 16px;
	font-size: 12px;
	font-family: "Roboto", sans-serif;
	color: ${COLORS.text};
	font-weight: 300;
	letter-spacing: 0.6px;
`;

const IconBox = styled.div<{ $bg?: string }>`
	width: 22px;
	height: 22px;
	border-radius: 6px;
	background: ${({ $bg }) => $bg || "#FFD100"};
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 7px;
`;

const StatValue = styled.span`
	font-weight: 700;
	font-size: 14px;
	margin-right: 2px;
	letter-spacing: 0.2px;
`;

export type CardEstateProps = {
	estate: {
		name: string;
		city: string;
		zipCode: string;
		street: string;
		buildingNumber: string;
		residentsCount: number;
		newMessages: number;
		newTickets: number;
		inProgress: number;
	};
	onSelect?: () => void;
	isSelected?: boolean;
};

export const CardEstate: React.FC<CardEstateProps> = ({
	estate,
	onSelect,
	isSelected,
}) => (
	<Wrapper $selected={isSelected}>
		<TopRow>
			<Code>{estate.name}</Code>
			<SelectBtn $selected={isSelected} onClick={onSelect}>
				{isSelected ? "Wybrane" : "Wybierz osiedle"}
			</SelectBtn>
		</TopRow>
		<Line />
		<InfoRow>
			<Icon src='/assets/panelEstate/building.png' alt='ikona osiedla' />
			<EstateInfo>
				<Name>{estate.name}</Name>
				<Address>
					{estate.city} {estate.zipCode} {estate.street} {estate.buildingNumber}
				</Address>
			</EstateInfo>
			<StatsRow>
				<Stat>
					<StatValue>{estate.residentsCount}</StatValue> Mieszkań
				</Stat>
				<Stat>
					<IconBox $bg='#FFD100'>
						<img
							src='/assets/panelEstate/comment.svg'
							alt='wiadomości'
							style={{ width: 16, height: 16 }}
						/>
					</IconBox>
					Nowe wiadomości: <StatValue>{estate.newMessages}</StatValue>
				</Stat>
				<Stat>
					<IconBox $bg='#E8AE9E'>
						<img
							src='/assets/panelEstate/check.svg'
							alt='wiadomości'
							style={{ width: 16, height: 16 }}
						/>
					</IconBox>
					Nowe zgłoszenia: <StatValue>{estate.newTickets}</StatValue>
				</Stat>
				<Stat>
					<IconBox $bg='#DADADA'>
						<img
							src='/assets/panelEstate/check.svg'
							alt='wiadomości'
							style={{ width: 16, height: 16 }}
						/>
					</IconBox>
					W trakcie: <StatValue>{estate.inProgress}</StatValue>
				</Stat>
			</StatsRow>
		</InfoRow>
	</Wrapper>
);
