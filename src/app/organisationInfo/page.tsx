// app/organisationInfo/page.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar";
import { HelloTop } from "../../components/top/HelloTop";
import YourOrganisation from "../../components/yourOrganisation/YourOrganisation";

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
	/* çocuklarınızı poziomo centrować */
	align-items: center;
`;

export default function OrganisationInfoPage() {
	return (
		<PageContainer>
			<Sidebar />
			<ContentWrapper>
				<HelloTop />

				{/* Cała zawartość YourOrganisation jest już ograniczona do max-width i wyśrodkowana */}
				<YourOrganisation />
			</ContentWrapper>
		</PageContainer>
	);
}
