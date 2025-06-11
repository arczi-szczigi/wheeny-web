// app/allEstate/page.tsx
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar";
import { HelloTop } from "../../components/top/HelloTop";
import TopPanelChooseEstate from "../../components/panelEstate/TopPanelChooseEstate";
import SearchBarPanelEstate from "../../components/panelEstate/SearchBarPanelEstate";
import {
	CardEstate,
	CardEstateProps,
} from "../../components/panelEstate/CardEstate";

// przykładowe dane, zastąp je swoimi z backendu
const estatesData: CardEstateProps["estate"][] = [
	{
		name: "Osiedle Słoneczne",
		city: "Warszawa",
		zipCode: "01-345",
		street: "Jerozolimskie",
		buildingNumber: "44",
		residentsCount: 55,
		newMessages: 12,
		newTickets: 7,
		inProgress: 8,
	},
	{
		name: "Osiedle Zielone",
		city: "Kraków",
		zipCode: "30-001",
		street: "Floriańska",
		buildingNumber: "12",
		residentsCount: 32,
		newMessages: 5,
		newTickets: 2,
		inProgress: 1,
	},
	// dodaj kolejne osiedla...
];

const PageContainer = styled.div`
	display: grid;
	grid-template-columns: 260px 1fr;
	height: 100vh;
	width: 100%;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
	padding: 42px 40px 0 64px;
	gap: 32px;
	overflow-y: auto;
	align-items: center;
`;

const EstatesList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
	max-width: 1200px;
`;

export default function AllEstatePage() {
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<PageContainer>
			<Sidebar />
			<ContentWrapper>
				<HelloTop />

				{/* Panel statystyk */}
				<TopPanelChooseEstate />

				{/* Pasek akcji: dodaj, wyszukaj, filtr, sort */}
				<SearchBarPanelEstate
					onAddClick={() => console.log("Dodaj osiedle")}
					onSearch={val => console.log("Szukaj:", val)}
					onFilterClick={() => console.log("Filtruj")}
					onSortClick={() => console.log("Sortuj")}
				/>

				{/* Lista kart osiedli */}
				<EstatesList>
					{estatesData.map(estate => (
						<CardEstate
							key={estate.name}
							estate={estate}
							isSelected={selected === estate.name}
							onSelect={() =>
								setSelected(prev => (prev === estate.name ? null : estate.name))
							}
						/>
					))}
				</EstatesList>
			</ContentWrapper>
		</PageContainer>
	);
}
