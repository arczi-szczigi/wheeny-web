// app/socialGroup/page.tsx
"use client";

import React from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	background: #ffd100;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Title = styled.h1`
	font-size: 36px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #202020;
`;

export default function SocialGroupPage() {
	return (
		<PageWrapper>
			<Title>Panel w budowie</Title>
		</PageWrapper>
	);
}
