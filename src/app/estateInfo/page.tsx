//app/estaetInfo/page.tsx

"use client";

import React from "react";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar";
import { HelloTop } from "../../components/top/HelloTop";
import YourEstate from "../../components/yourEstates/YourEstate";

// Layout grid z sidebar i sekcją treści
const PageContainer = styled.div`
	display: grid;
	grid-template-columns: 260px 1fr;
	height: 100vh;
	width: 100%;
`;

// Wrapper dla głównej zawartości (HelloTop + content)
const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	background: #f5f5f5;

	/* tu dodajemy padding, żeby content nie przyklejał się do góry i od sidebaru */
	padding: 42px 40px 0 64px;

	/* przerwa między HelloTop i Twoim panelem */
	gap: 32px;

	/* przewijanie w pionie, jeśli jest za dużo treści */
	overflow-y: auto;
`;

export default function EstateInfoPage() {
	return (
		<PageContainer>
			<Sidebar />
			<ContentWrapper>
				<HelloTop />
				<YourEstate />
			</ContentWrapper>
		</PageContainer>
	);
}
