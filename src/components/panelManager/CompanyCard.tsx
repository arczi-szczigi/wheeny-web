import React from "react";
import styled, { css } from "styled-components";

const StyledCard = styled.div<{ selected?: boolean }>`
	width: 1400px;
	background: #fefefe;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	margin: 0 auto 26px auto;
	padding: 0;
	display: flex;
	flex-direction: column;
	border: 1.5px solid transparent;
	transition: border-color 0.17s;

	${props =>
		props.selected &&
		css`
			border-color: #ffd100;
			box-shadow: 0 0 0 2px #ffe555;
		`}
`;

const TopRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 23px 44px 0px 44px;
`;

const Title = styled.div`
	color: #202020;
	font-size: 20px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 1px;
`;

const ButtonsRow = styled.div`
	display: flex;
	gap: 18px;
`;

const Button = styled.button<{
	bg: string;
	color: string;
	selected?: boolean;
}>`
	padding: 8px 38px;
	background: ${({ selected, bg }) => (selected ? "#faf6da" : bg)};
	border: none;
	border-radius: 30px;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	color: ${({ selected, color }) => (selected ? "#ffd100" : color)};
	letter-spacing: 0.6px;
	cursor: ${({ selected }) => (selected ? "default" : "pointer")};
	transition: filter 0.14s, background 0.15s, color 0.15s;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: ${({ selected }) => (selected ? 0.85 : 1)};
	box-shadow: ${({ selected }) => (selected ? "0 0 0 2px #ffd10020" : "none")};
	border: ${({ selected }) => (selected ? "1.7px solid #ffd100" : "none")};

	&:hover {
		filter: ${({ selected }) => (selected ? "none" : "brightness(0.96)")};
	}
`;

const Divider = styled.div`
	width: 1318px;
	height: 0;
	margin: 9px 0 0 41px;
	border-bottom: 1px solid #f3f3f3;
`;

const MainRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	padding: 14px 44px 0px 44px;
	gap: 18px;
`;

const OfficeIcon = styled.img`
	width: 69px;
	height: 69px;
	margin-right: 24px;
	border-radius: 10px;
	object-fit: cover;
`;

const InfoSection = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
`;

const OrgName = styled.div`
	color: #202020;
	font-size: 22px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	text-transform: capitalize;
	letter-spacing: 1.1px;
	margin-bottom: 3px;
`;

const SecondRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 30px;
	width: 100%;
`;

const OrgAddress = styled.div`
	color: #202020;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 0.8px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	margin-right: 60px;
`;

const StatBar = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const Tag = styled.div`
	background: #f3f3f3;
	border-radius: 1px;
	padding: 6px 17px;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 0.6px;
	color: #202020;
	margin-right: -2px;
	display: flex;
	align-items: center;
`;

const TagSecondary = styled(Tag)`
	font-weight: 400;
	margin-left: -8px;
`;

const Stat = styled.div`
	background: #f3f3f3;
	border-radius: 1px;
	width: 179px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0 18px;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 0.6px;
	color: #202020;
	margin-left: 8px;
	white-space: nowrap;
`;

const StatValue = styled.span`
	font-weight: 700;
	margin-right: 6px;
`;

export type CardOrganizationProps = {
	org: {
		id: string;
		name: string;
		address: string;
		registrationDate: string;
		estatesCount: number;
		residentsCount: number;
	};
	onSelect?: () => void;
	isSelected?: boolean;
};

export const CardOrganization: React.FC<CardOrganizationProps> = ({
	org,
	onSelect,
	isSelected,
}) => {
	return (
		<StyledCard selected={isSelected}>
			<TopRow>
				<Title>{org.name}</Title>
				<ButtonsRow>
					<Button
						bg='#FFD100'
						color='#202020'
						onClick={isSelected ? undefined : onSelect}
						selected={isSelected}
						disabled={isSelected}>
						{isSelected ? "Wybrana" : "Wybierz firmę"}
					</Button>
					<Button bg='#4D4D4D' color='#fff'>
						Edytuj dane
					</Button>
					<Button bg='#E1F1FF' color='#202020'>
						Weryfikacja
					</Button>
					<Button bg='#98C580' color='#202020'>
						Pakiet
					</Button>
					<Button bg='#E8AE9E' color='#202020'>
						Usuń firmę
					</Button>
				</ButtonsRow>
			</TopRow>
			<Divider />
			<MainRow>
				<OfficeIcon
					src='/assets/panelOrganisation/building.png'
					alt='ikona biura'
				/>
				<InfoSection>
					<OrgName>{org.name}</OrgName>
					<SecondRow>
						<OrgAddress>{org.address}</OrgAddress>
						<StatBar>
							<Tag>Podstawowe</Tag>
							<TagSecondary>Konto</TagSecondary>
							<Stat>
								<StatValue>{org.registrationDate}</StatValue> Data rejestracji
							</Stat>
							<Stat>
								<StatValue>{org.estatesCount}</StatValue> Osiedla
							</Stat>
							<Stat>
								<StatValue>{org.residentsCount}</StatValue> Mieszkańców
							</Stat>
						</StatBar>
					</SecondRow>
				</InfoSection>
			</MainRow>
		</StyledCard>
	);
};
