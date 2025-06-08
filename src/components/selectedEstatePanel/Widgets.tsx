"use client";

import React from "react";
import styled from "styled-components";

// Kontener główny na całość widgetów
const Wrapper = styled.div`
	width: 100%;
	background: #f4f4f4;
	padding: 32px 0 40px 0;
`;

const Content = styled.div`
	width: 800px; // szeroko jak na figmie!
`;

const TitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 28px;
`;

const Title = styled.h2`
	font-family: Roboto;
	font-size: 20px;
	color: black;
	font-weight: 400;
	letter-spacing: 1px;
`;

const Underline = styled.div`
	flex: 1;
	height: 1px;
	background: #d9d9d9;
`;

const WidgetRow = styled.div`
	display: flex;
	gap: 36px;
	margin-top: 24px;
`;

const WidgetCard = styled.div`
	flex: 1;
	background: white;
	border-radius: 22px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.04);
	display: flex;
	align-items: center;
	min-height: 230px; // wyższe boxy!
	padding: 0;
`;

const WidgetArt = styled.div`
	flex: 0 0 43%; // dużo miejsca na grafikę!
	height: 230px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;

const WidgetContent = styled.div`
	flex: 1;
	padding: 0 38px 0 0; // tekst przesunięty bardziej w prawo
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 18px;
`;

const WidgetText = styled.div`
	color: #202020;
	font-size: 16px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.6px;
	margin-bottom: 8px;
`;

const WidgetButton = styled.button`
	background: #202020;
	color: white;
	border: none;
	border-radius: 30px;
	font-family: Roboto;
	font-size: 16px;
	font-weight: 400;
	letter-spacing: 0.6px;
	padding: 8px 28px;
	margin-top: 2px;
	cursor: pointer;
	transition: background 0.14s;
	&:hover {
		background: #313131;
	}
`;

const widgets = [
	{
		title: "Poinformuj mieszkańców o bieżących sprawach",
		button: "Dodaj Ogłoszenie",
		img: "/assets/selectedEstate/father.png",
		onClick: () => alert("Dodaj Ogłoszenie kliknięte!"),
	},
	{
		title: "Utwórz głosowanie dla mieszkańców",
		button: "Utwórz Głosowanie",
		img: "/assets/selectedEstate/mom.png",
		onClick: () => alert("Utwórz Głosowanie kliknięte!"),
	},
];

export default function WidgetsBox() {
	return (
		<Wrapper>
			<Content>
				<TitleRow>
					<Title>Widgety</Title>
					<Underline />
				</TitleRow>
				<WidgetRow>
					{widgets.map((w, i) => (
						<WidgetCard key={i}>
							<WidgetArt>
								<img
									src={w.img}
									alt=''
									style={{
										width: "100%",
										height: "100%",
										objectFit: "contain",
										display: "block",
									}}
								/>
							</WidgetArt>
							<WidgetContent>
								<WidgetText>{w.title}</WidgetText>
								<WidgetButton onClick={w.onClick}>{w.button}</WidgetButton>
							</WidgetContent>
						</WidgetCard>
					))}
				</WidgetRow>
			</Content>
		</Wrapper>
	);
}
