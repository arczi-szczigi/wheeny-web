"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMain } from "@/context/EstateContext"; // NOWY context!
import OfficeImage from "../../../public/assets/selectedEstate/office.png";

// ============ STYLE ============

const EstatePanelWrapper = styled.div`
	width: 100%;
	min-height: 190px;
	position: relative;
	margin-bottom: 10px;
`;

const YellowBackground = styled.div`
	width: 100%;
	height: 190px;
	background: #ffd100;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	position: absolute;
	top: 0;
	left: 0;
`;

const SelectedLabel = styled.span`
	position: absolute;
	left: 43px;
	top: 24px;
	color: black;
	font-size: 24px;
	font-family: Roboto, Arial, sans-serif;
	font-weight: 400;
	letter-spacing: 1.2px;
`;

const EstateName = styled.span`
	position: absolute;
	left: 150px;
	top: 80px;
	color: #202020;
	font-size: 22px;
	font-family: Roboto, Arial, sans-serif;
	font-weight: 700;
	text-transform: capitalize;
	letter-spacing: 1.1px;
`;

const EstateAddress = styled.span`
	position: absolute;
	left: 150px;
	top: 120px;
	color: #202020;
	font-size: 16px;
	font-family: Roboto, Arial, sans-serif;
	font-weight: 300;
	letter-spacing: 0.8px;
	line-height: 20px;
`;

const SeparatorLine = styled.div`
	width: 80%;
	height: 0;
	position: absolute;
	left: 43px;
	top: 62px;
	border-bottom: 1px solid #f3f3f3;
`;

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

const SwitchButton = styled.button`
	width: 150px;
	height: 30px;
	position: absolute;
	left: 90%;
	top: 24px;
	transform: translateX(-50%);
	background: #202020;
	color: white;
	border: none;
	border-radius: 30px;
	font-size: 12px;
	font-family: Roboto, Arial, sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
	cursor: pointer;
	transition: background 0.2s;
	&:hover {
		background: #383838;
	}
`;

// ============ KOMPONENT ============

const SelectedEstate: React.FC = () => {
	const router = useRouter();
	const { organisations, selectedOrganisationId, selectedEstateId } = useMain();

	const selectedOrganisation = organisations.find(
		org => org._id === selectedOrganisationId
	);
	const estates = selectedOrganisation?.estates ?? [];
	const selectedEstate = estates.find(e => e._id === selectedEstateId);

	const name = selectedEstate?.name ?? "Nie wybrano osiedla";
	const address = selectedEstate ? (
		<>
			{selectedEstate.address.street} {selectedEstate.address.buildingNumber}
			<br />
			{selectedEstate.address.zipCode} {selectedEstate.address.city}
		</>
	) : (
		"Brak danych adresowych"
	);

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
			<EstateName>{name}</EstateName>
			<EstateAddress>{address}</EstateAddress>
			<SwitchButton onClick={() => router.push("/panelEstate")}>
				Przełącz osiedle
			</SwitchButton>
		</EstatePanelWrapper>
	);
};

export default SelectedEstate;
