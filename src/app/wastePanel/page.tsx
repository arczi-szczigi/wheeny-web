"use client";
import React from "react";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar";
import { HelloTop } from "../../components/top/HelloTop";
import Trash from "../../components/trashPanel/Trash";

// Główny wrapper strony z gridem dla sidebar i treści
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
`;

export default function WastePanelPage() {
	return (
		<PageContainer>
			{/* Sidebar */}
			<Sidebar />

			{/* Główna zawartość */}
			<ContentWrapper>
				{/* Pasek powitania */}
				<HelloTop />

				{/* Panel odpadów */}
				<Trash />
			</ContentWrapper>
		</PageContainer>
	);
}
