"use client";
import React from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";

const Row = styled.div`
	display: flex;
	flex-direction: row;
	gap: 20px;
	width: 100%;
	margin-bottom: 28px;
`;

const StatBox = styled.div`
	position: relative;
	background: white;
	border-radius: 10px;
	width: 240px;
	height: 100px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 32px;
	overflow: hidden;
`;

const StatNumber = styled.span`
	color: #202020;
	font-size: 40px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 2px;
	z-index: 2;
`;

const StatLabel = styled.span`
	color: #4d4d4d;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
	margin-top: 4px;
	z-index: 2;
	line-height: 1.3;
`;

const QuarterCircleWrapper = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	width: 60px;
	height: 60px;
	pointer-events: none;
	z-index: 1;
`;

const QuarterSvg = styled.svg`
	width: 100%;
	height: 100%;
	display: block;
`;

const QuarterIcon = styled.img`
	position: absolute;
	right: 18px;
	bottom: 12px;
	width: 22px;
	height: 22px;
	z-index: 2;
	pointer-events: none;
`;

const CalendarBox = styled(StatBox)`
	background: #202020;
	color: white;
	width: 335px;
	padding-left: 32px;
	padding-right: 32px;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const CalendarLabel = styled.span`
	color: white;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 0.6px;
`;

const CalendarDate = styled.span`
	color: white;
	font-size: 30px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 1.5px;
	margin-top: 4px;
`;

function formatPolishDate(date: Date) {
	const miesiace = [
		"stycznia",
		"lutego",
		"marca",
		"kwietnia",
		"maja",
		"czerwca",
		"lipca",
		"sierpnia",
		"września",
		"października",
		"listopada",
		"grudnia",
	];
	return `${date.getDate()} ${miesiace[date.getMonth()]} ${date.getFullYear()}`;
}

const ICONS = [
	{ color: "#FFD100", icon: "/assets/panelEstate/comment.svg" }, // żółty
	{ color: "#E8AE9E", icon: "/assets/panelEstate/check.svg" }, // łosoś/różowy
	{ color: "#DADADA", icon: "/assets/panelEstate/play.svg" }, // szary
	{ color: "#E1F1FF", icon: "/assets/panelEstate/delete.svg" }, // błękit
];

export default function TopPanelChooseEstate() {
	const today = new Date();

	const {
		organisations,
		selectedOrganisationId,
		selectedEstateId,
		// możesz dołożyć tickets jak potrzebujesz
	} = useMain();

	// Znajdź wybraną firmę i wybrane osiedle
	const selectedOrganisation = organisations.find(
		org => org._id === selectedOrganisationId
	);
	const estates = selectedOrganisation?.estates ?? [];
	const selectedEstate = estates.find(e => e._id === selectedEstateId);

	// Przykładowe statystyki – tu możesz dopiąć logikę pod swoje dane
	const newMessages = 0; // <-- tu możesz podpiąć liczenie wiadomości, jeśli masz
	const newTickets = 0; // <-- podaj liczbę zgłoszeń "open" jeśli masz
	const inProgress = 0; // <-- zgłoszenia w trakcie, jeśli masz
	const closed = 0; // <-- zamknięte zgłoszenia, jeśli masz

	// Jeśli masz tickets w context, możesz zrobić coś takiego:
	// const { tickets } = useMain();
	// const newTickets = tickets.filter(t => t.estate === selectedEstateId && t.status === "open").length;

	const VALUES = [
		{ value: newMessages, desc: "Nowych wiadomości\nod mieszkańców" },
		{ value: newTickets, desc: "Nowe zgłoszenia\nod mieszkańców" },
		{ value: inProgress, desc: "Zgłoszeń\nw trakcie" },
		{ value: closed, desc: "Zamkniętych zgłoszeń" },
	];

	// Ładowanie (jeśli nie ma wybranego osiedla lub nie ma danych)
	if (!selectedEstateId || estates.length === 0) {
		return (
			<Row>
				<StatBox>
					<StatNumber>...</StatNumber>
					<StatLabel>Ładowanie danych osiedla...</StatLabel>
				</StatBox>
				<CalendarBox>
					<CalendarLabel>Dziś mamy:</CalendarLabel>
					<CalendarDate>{formatPolishDate(today)}</CalendarDate>
				</CalendarBox>
			</Row>
		);
	}

	return (
		<Row>
			{VALUES.map((val, i) => (
				<StatBox key={i}>
					<StatNumber>{val.value}</StatNumber>
					<StatLabel>
						{val.desc.split("\n").map((line, idx) => (
							<div key={idx}>{line}</div>
						))}
					</StatLabel>
					<QuarterCircleWrapper>
						<QuarterSvg viewBox='0 0 110 110'>
							<path
								d='M0,110 A110,110 0 0,1 110,0 L110,110 Z'
								fill={ICONS[i].color}
							/>
						</QuarterSvg>
					</QuarterCircleWrapper>
					<QuarterIcon src={ICONS[i].icon} alt='' />
				</StatBox>
			))}
			<CalendarBox>
				<CalendarLabel>Dziś mamy:</CalendarLabel>
				<CalendarDate>{formatPolishDate(today)}</CalendarDate>
			</CalendarBox>
		</Row>
	);
}
