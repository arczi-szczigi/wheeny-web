"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import OfficeImage from "../../../public/assets/selectedEstate/office.png";

// Tło całego panelu
const EstatePanelWrapper = styled.div`
	width: 800px;
	height: 190px;
	position: relative;
`;

// Żółte tło z zaokrągleniem i cieniem
const YellowBackground = styled.div`
	width: 800px;
	height: 190px;
	background: #ffd100;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	position: absolute;
	top: 0;
	left: 0;
`;

// „Wybrane osiedle”
const SelectedLabel = styled.span`
	position: absolute;
	left: 43px;
	top: 24px;
	color: black;
	font-size: 24px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 1.2px;
	word-wrap: break-word;
`;

// Nazwa osiedla
const EstateName = styled.span`
	position: absolute;
	left: 150px;
	top: 80px;
	color: #202020;
	font-size: 22px;
	font-family: Roboto;
	font-weight: 700;
	text-transform: capitalize;
	letter-spacing: 1.1px;
	word-wrap: break-word;
`;

// Adres osiedla
const EstateAddress = styled.span`
	position: absolute;
	left: 150px;
	top: 120px;
	color: #202020;
	font-size: 16px;
	font-family: Roboto;
	font-weight: 300;
	letter-spacing: 0.8px;
	word-wrap: break-word;
`;

// Linia oddzielająca
const SeparatorLine = styled.div`
	width: 730px;
	height: 0;
	position: absolute;
	left: 43px;
	top: 62px;
	border-bottom: 1px solid #f3f3f3;
`;

// Obrazek budynku
const BuildingImageWrapper = styled.div`
	width: 108px;
	height: 108px;
	position: absolute;
	left: 21px;
	top: 65px;
	border-radius: 10px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
`;

// Przycisk „Przełącz osiedle”
const SwitchButton = styled.button`
	width: 150px;
	height: 30px;
	position: absolute;
	left: 623px;
	top: 24px;
	background: #202020;
	color: white;
	border: none;
	border-radius: 30px;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.6px;
	cursor: pointer;
	transition: background 0.2s;
	&:hover {
		background: #383838;
	}
`;

interface SelectedEstateProps {
	estateName?: string;
	address?: string;
	onSwitch?: () => void;
}

const DEFAULT_ESTATE_NAME = "Osiedle słoneczne";
const DEFAULT_ESTATE_ADDRESS = "ul. Jerozolimskie 44,\n01-345 Warszawa";

const SelectedEstate: React.FC<SelectedEstateProps> = ({
	estateName = DEFAULT_ESTATE_NAME,
	address = DEFAULT_ESTATE_ADDRESS,
	onSwitch,
}) => {
	return (
		<EstatePanelWrapper>
			<YellowBackground />
			<SelectedLabel>Wybrane osiedle</SelectedLabel>
			<SeparatorLine />
			<BuildingImageWrapper>
				<Image
					src={OfficeImage}
					alt='Budynek osiedla'
					width={108}
					height={108}
					style={{ objectFit: "cover" }}
					priority
				/>
			</BuildingImageWrapper>
			<EstateName>{estateName}</EstateName>
			<EstateAddress>
				{address.split("\n").map((line, i) => (
					<React.Fragment key={i}>
						{line}
						{i < address.split("\n").length - 1 && <br />}
					</React.Fragment>
				))}
			</EstateAddress>
			<SwitchButton onClick={onSwitch}>Przełącz osiedle</SwitchButton>
		</EstatePanelWrapper>
	);
};

export default SelectedEstate;
