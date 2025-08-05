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
};

const Wrapper = styled.div<{ $selected?: boolean }>`
	background: ${COLORS.background};
	border-radius: 10px;
	box-shadow: ${COLORS.shadow};
	padding: 10px 22px;
	margin-bottom: 12px;
	display: flex;
	flex-direction: column;
	gap: 14px;
	border: ${({ $selected }) =>
		$selected ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`};
	transition: border 0.18s;
`;

const TopRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Code = styled.div`
	color: black;
	font-size: 20px;
	font-weight: 700;
`;

const SelectBtn = styled.button<{ $selected?: boolean }>`
	background: ${({ $selected }) =>
		$selected ? COLORS.accent2 : COLORS.accent};
	border-radius: 30px;
	border: none;
	color: ${COLORS.text};
	font-size: 12px;
	padding: 8px 38px;
	cursor: pointer;
	outline: ${({ $selected }) =>
		$selected ? `2px solid ${COLORS.accent2}` : "none"};
	&:hover {
		background: ${({ $selected }) => ($selected ? COLORS.accent2 : "#ffc800")};
	}
`;

const StatusBtn = styled.button<{ $status: string }>`
	border-radius: 30px;
	border: none;
	font-size: 12px;
	padding: 8px 38px;
	margin-left: 8px;
	cursor: default;
	${({ $status }) =>
		$status === "unverified"
			? `
				background: #232323;
				color: #fff;
			`
			: $status === "verifying"
			? `
				background: #E1F1FF;
				color: #232323;
			`
			: `
				display: none;
			`}
	pointer-events: none;
`;

const Line = styled.div`
	height: 1px;
	background: ${COLORS.border};
`;

const InfoRow = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 24px;
`;

const Icon = styled.img`
	width: 69px;
	height: 69px;
`;

const EstateInfo = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const Name = styled.div`
	color: ${COLORS.text};
	font-size: 22px;
	font-weight: 700;
	text-transform: capitalize;
`;

const Address = styled.div`
	color: ${COLORS.text};
	font-size: 16px;
	font-weight: 300;
`;

const StatsRow = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
	margin-left: 36px;
	margin-top: 6px;
`;

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
	font-weight: 300;
	color: ${COLORS.text};
`;

const IconBox = styled.div<{ $bg?: string }>`
	width: 22px;
	height: 22px;
	border-radius: 6px;
	background: ${({ $bg }) => $bg || COLORS.accent};
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StatValue = styled.span`
	font-weight: 700;
	font-size: 14px;
`;

export type CardEstateProps = {
	estate: {
		id: string;
		name: string;
		city: string;
		zipCode: string;
		street: string;
		buildingNumber: string;
		residentsCount: number;
		newMessages: number;
		newTickets: number;
		inProgress: number;
		status: "unverified" | "verifying" | "verified";
	};
	onSelect?: () => void;
	isSelected?: boolean;
};

export const CardEstate: React.FC<CardEstateProps> = ({
	estate,
	onSelect,
	isSelected,
}) => {
	return (
		<Wrapper $selected={isSelected}>
			<TopRow>
				<Code>{estate.name}</Code>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					{estate.status === "unverified" && (
						<StatusBtn $status='unverified'>Zweryfikuj osiedle</StatusBtn>
					)}
					{estate.status === "verifying" && (
						<StatusBtn $status='verifying'>W trakcie weryfikacji</StatusBtn>
					)}
					<SelectBtn $selected={isSelected} onClick={onSelect}>
						{isSelected ? "Wybrane" : "Wybierz osiedle"}
					</SelectBtn>
				</div>
			</TopRow>

			<Line />

			<InfoRow>
				<Icon src='/assets/panelEstate/building.png' alt='ikona osiedla' />
				<EstateInfo>
					<Name>{estate.name}</Name>
					<Address>
						{estate.city} {estate.zipCode} {estate.street}{" "}
						{estate.buildingNumber}
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
								alt='nowe zgłoszenia'
								style={{ width: 16, height: 16 }}
							/>
						</IconBox>
						Nowe zgłoszenia: <StatValue>{estate.newTickets}</StatValue>
					</Stat>
					<Stat>
						<IconBox $bg='#DADADA'>
							<img
								src='/assets/panelEstate/check.svg'
								alt='w trakcie'
								style={{ width: 16, height: 16 }}
							/>
						</IconBox>
						W trakcie: <StatValue>{estate.inProgress}</StatValue>
					</Stat>
				</StatsRow>
			</InfoRow>
		</Wrapper>
	);
};
