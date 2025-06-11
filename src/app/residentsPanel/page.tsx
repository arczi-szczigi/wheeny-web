"use client";

import React from "react";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar";
import { HelloTop } from "../../components/top/HelloTop";
import ResidentsInfoListBox from "../../components/residents/ResidentsInfoListBox";

// Layout z sidebar i główną zawartością
const PageContainer = styled.div`
	display: grid;
	grid-template-columns: 260px 1fr;
	height: 100vh;
	width: 100%;
`;

// Wrapper dla całej treści; ustawia padding i odstępy
const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
	padding: 42px 40px 0 64px;
	gap: 24px;
	overflow-y: auto;
`;

// Tytuł sekcji Najemcy
const SectionTitle = styled.h1`
	font-size: 24px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #202020;
	margin: 0; /* reset */
`;

export default function ResidentsPanelPage() {
	return (
		<PageContainer>
			<Sidebar />

			<ContentWrapper>
				{/* Pasek powitania */}
				<HelloTop />

				{/* Nagłówek sekcji */}
				<SectionTitle>Najemcy</SectionTitle>

				{/* Lista najemców */}
				<ResidentsInfoListBox />
			</ContentWrapper>
		</PageContainer>
	);
}
