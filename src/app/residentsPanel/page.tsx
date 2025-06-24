// src/app/residentsPanel/page.tsx
"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar";
import { HelloTop } from "../../components/top/HelloTop";
import { ResidentsInfoListBox } from "../../components/residents/ResidentsInfoListBox";
import { useMain } from "@/context/EstateContext";
import { useAnnouncement } from "@/context/AnnouncementContext";

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
	gap: 24px;
	overflow-y: auto;
`;
const SectionTitle = styled.h1`
	font-size: 24px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #202020;
	margin: 0;
`;

export default function ResidentsPanelPage() {
	const { selectedEstateId } = useMain();
	const {
		residents,
		loading,
		error,
		fetchResidents,
		editResident,
		deleteResident,
	} = useAnnouncement();

	// Pobieramy raz mieszkańców, gdy zmieni się selectedEstateId
	useEffect(() => {
		if (selectedEstateId) {
			fetchResidents(selectedEstateId);
		}
	}, [selectedEstateId, fetchResidents]);

	if (!selectedEstateId) {
		return (
			<PageContainer>
				<Sidebar />
				<ContentWrapper>
					<HelloTop />
					<SectionTitle>Najemcy</SectionTitle>
					<div style={{ padding: 40 }}>
						Wybierz osiedle, aby wyświetlić listę najemców.
					</div>
				</ContentWrapper>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<Sidebar />
			<ContentWrapper>
				<HelloTop />
				<SectionTitle>Najemcy</SectionTitle>

				<ResidentsInfoListBox
					estateId={selectedEstateId}
					residents={residents}
					loading={loading}
					error={error}
					editResident={editResident}
					deleteResident={deleteResident}
				/>
			</ContentWrapper>
		</PageContainer>
	);
}
