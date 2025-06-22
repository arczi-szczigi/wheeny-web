"use client";

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar";
import { HelloTop } from "../../components/top/HelloTop";
import TopPanelChooseEstate from "../../components/panelEstate/TopPanelChooseEstate";
import SearchBarPanelEstate from "../../components/panelEstate/SearchBarPanelEstate";
import { CardEstate } from "../../components/listAllEstates/CardEstate";
import { useMain } from "@/context/EstateContext";
import type { Estate } from "@/context/EstateContext";

// --- STYLES ---
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
`;

export default function AllEstatePage() {
	const [selected, setSelected] = useState<string | null>(null);

	// Context – pobranie wybranej organizacji i jej osiedli
	const { organisations, selectedOrganisationId, loading, error } = useMain();
	const selectedOrg = useMemo(
		() => organisations.find(org => org._id === selectedOrganisationId),
		[organisations, selectedOrganisationId]
	);
	const estates: Estate[] = selectedOrg?.estates || [];

	// Obsługa wyszukiwania
	const [search, setSearch] = useState<string>("");

	const filteredEstates = useMemo(() => {
		const val = search.trim().toLowerCase();
		if (!val) return estates;
		return estates.filter(
			e =>
				e.name.toLowerCase().includes(val) ||
				e.address.city?.toLowerCase().includes(val) ||
				e.address.street?.toLowerCase().includes(val) ||
				e.address.zipCode?.toLowerCase().includes(val)
		);
	}, [estates, search]);

	return (
		<PageContainer>
			<Sidebar />
			<ContentWrapper>
				<HelloTop />

				<TopPanelChooseEstate />

				<SearchBarPanelEstate
					onAddClick={() => console.log("Dodaj osiedle")}
					onSearch={val => setSearch(val)}
					onFilterClick={() => console.log("Filtruj")}
					onSortClick={() => console.log("Sortuj")}
				/>

				<EstatesList>
					{loading ? (
						<div>Ładowanie osiedli...</div>
					) : error ? (
						<div>Błąd: {error}</div>
					) : filteredEstates.length === 0 ? (
						<div>Brak osiedli do wyświetlenia.</div>
					) : (
						filteredEstates.map(estate => (
							<CardEstate
								key={estate._id}
								estate={{
									id: estate._id, // <--- UWAGA: wymagane przez CardEstate
									name: estate.name,
									city: estate.address?.city ?? "",
									zipCode: estate.address?.zipCode ?? "",
									street: estate.address?.street ?? "",
									buildingNumber: estate.address?.buildingNumber ?? "",
									residentsCount:
										typeof estate.numberOfFlats === "number"
											? estate.numberOfFlats
											: 0,
									newMessages: 0, // jeśli nie masz – ustaw na 0
									newTickets: 0, // jeśli nie masz – ustaw na 0
									inProgress: 0, // jeśli nie masz – ustaw na 0
								}}
								isSelected={selected === estate._id}
								onSelect={() =>
									setSelected(prev => (prev === estate._id ? null : estate._id))
								}
							/>
						))
					)}
				</EstatesList>
			</ContentWrapper>
		</PageContainer>
	);
}
