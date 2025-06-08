"use client";

import React from "react";
import styled, { css } from "styled-components";

// Typ pojedynczego eventu
type Event = {
	type: "message" | "alert" | "vote" | "message_inactive";
	title: string;
	date: string;
	status: string;
	priority: "niski" | "wysoki" | "-";
	read: boolean;
	iconColor: string; // #FFD100, #E56A6A, #DADADA
	dotColor: string; // #FFD100, #E56A6A, #DADADA
	active: boolean;
};

// Przykładowe dane (możesz podpiąć z backendu)
const EVENTS: Event[] = [
	{
		type: "message",
		title: "Nowa wiadomość od Jana Z.",
		date: "12 sierpnia 2024",
		status: "nieprzeczytana",
		priority: "niski",
		read: false,
		iconColor: "#FFD100",
		dotColor: "#FFD100",
		active: true,
	},
	{
		type: "alert",
		title: "Zgłoszenie awarii",
		date: "11 sierpnia 2024",
		status: "nieprzeczytana",
		priority: "wysoki",
		read: false,
		iconColor: "#E56A6A",
		dotColor: "#E56A6A",
		active: true,
	},
	{
		type: "vote",
		title: "Zakończone głosowanie",
		date: "09 sierpnia 2024",
		status: "zakończone",
		priority: "-",
		read: true,
		iconColor: "#DADADA",
		dotColor: "#DADADA",
		active: false,
	},
	{
		type: "message_inactive",
		title: "Nowa wiadomość od Konserwator",
		date: "07 sierpnia 2024",
		status: "rozwiązane",
		priority: "-",
		read: true,
		iconColor: "#DADADA",
		dotColor: "#DADADA",
		active: false,
	},
	{
		type: "message_inactive",
		title: "Nowa wiadomość od Tomek I.",
		date: "02 sierpnia 2024",
		status: "rozwiązane",
		priority: "-",
		read: true,
		iconColor: "#DADADA",
		dotColor: "#DADADA",
		active: false,
	},
];

const Box = styled.div`
	width: 720px;
	min-height: 350px;
	background: white;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	padding: 38px 38px 22px 38px;
	position: relative;
	margin-top: 15px;
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const Title = styled.div`
	font-size: 20px;
	font-family: Roboto;
	font-weight: 400;
	color: black;
	letter-spacing: 1px;
	margin-bottom: 8px;
`;

const Table = styled.div`
	width: 100%;
	margin-top: 12px;
`;

const HeaderRow = styled.div`
	display: grid;
	grid-template-columns: 50px 1.5fr 1fr 1fr 0.7fr;
	align-items: center;
	color: #dadada;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.6px;
	margin-bottom: 8px;
`;

const StyledUnderline = styled.div`
	width: 95%;
	height: 1px;
	background: #d9d9d9;
	margin: 2px 0 18px 0;
`;

const Row = styled.div<{ active?: boolean }>`
	display: grid;
	grid-template-columns: 50px 1.5fr 1fr 1fr 0.7fr;
	align-items: center;
	font-size: 14px;
	font-family: Roboto;
	letter-spacing: 0.7px;
	color: #4d4d4d;
	min-height: 56px;
	opacity: ${({ active }) => (active ? 1 : 0.5)};
	transition: opacity 0.18s;
	position: relative;

	${({ active }) =>
		!active &&
		css`
			color: #dadada;
			font-size: 14px;
			span,
			div,
			b {
				color: #dadada;
			}
		`}
`;

const EventIcon = styled.div<{ color: string }>`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: 2px solid ${({ color }) => color};
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	margin-left: 6px;
	margin-right: 4px;
`;

const IconSVG = styled.svg`
	width: 18px;
	height: 18px;
	display: block;
	opacity: 0.92;
`;

const EventTitle = styled.span<{ active?: boolean }>`
	color: ${({ active }) => (active ? "#4D4D4D" : "#DADADA")};
	font-size: 14px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.7px;
`;

const EventDate = styled.span<{ active?: boolean }>`
	color: ${({ active }) => (active ? "#4D4D4D" : "#DADADA")};
	font-size: 10px;
	font-family: Roboto;
	font-weight: 300;
	letter-spacing: 0.5px;
`;

const EventStatus = styled.b<{ active?: boolean }>`
	color: ${({ active }) => (active ? "#4D4D4D" : "#DADADA")};
	font-size: 10px;
	font-family: Roboto;
	font-weight: ${({ active }) => (active ? 500 : 400)};
	letter-spacing: 0.5px;
`;

const EventPriority = styled.div`
	display: flex;
	align-items: center;
	gap: 7px;
`;

const PriorityText = styled.span<{ active?: boolean }>`
	color: ${({ active }) => (active ? "#4D4D4D" : "#DADADA")};
	font-size: 10px;
	font-family: Roboto;
	font-weight: 300;
	letter-spacing: 0.5px;
`;

const PriorityDot = styled.div<{ color: string }>`
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: ${({ color }) => color};
`;

export default function EventsInfoBox() {
	return (
		<Box>
			<Title>Ostatnie zdarzenia</Title>
			<Table>
				<HeaderRow>
					<span>Zdarzenie</span>
					<span></span>
					<span>Data zdarzenia</span>
					<span>Status</span>
					<span>Priorytet</span>
				</HeaderRow>
				<StyledUnderline />
				{EVENTS.map((ev, idx) => (
					<Row key={idx} active={ev.active}>
						<EventIcon color={ev.iconColor}>
							{/* Ikona wiadomości */}
							{ev.type === "message" && (
								<IconSVG viewBox='0 0 18 18' fill='none'>
									<circle
										cx='9'
										cy='9'
										r='8'
										stroke='#FFD100'
										strokeWidth='1.5'
									/>
									<rect
										x='5'
										y='7.5'
										width='8'
										height='1.5'
										rx='0.75'
										fill='#FFD100'
									/>
									<rect
										x='5'
										y='10'
										width='5'
										height='1.5'
										rx='0.75'
										fill='#FFD100'
									/>
								</IconSVG>
							)}
							{/* Ikona alertu */}
							{ev.type === "alert" && (
								<IconSVG viewBox='0 0 18 18' fill='none'>
									<circle
										cx='9'
										cy='9'
										r='8'
										stroke='#E56A6A'
										strokeWidth='1.5'
									/>
									<rect
										x='8'
										y='5'
										width='2'
										height='6'
										rx='1'
										fill='#E56A6A'
									/>
									<circle cx='9' cy='13.2' r='1' fill='#E56A6A' />
								</IconSVG>
							)}
							{/* Ikona szara (głosowanie/wiadomość archiwalna) */}
							{(ev.type === "vote" || ev.type === "message_inactive") && (
								<IconSVG viewBox='0 0 18 18' fill='none'>
									<circle
										cx='9'
										cy='9'
										r='8'
										stroke='#DADADA'
										strokeWidth='1.5'
									/>
									<rect
										x='5'
										y='7.5'
										width='8'
										height='1.5'
										rx='0.75'
										fill='#DADADA'
									/>
									<rect
										x='5'
										y='10'
										width='5'
										height='1.5'
										rx='0.75'
										fill='#DADADA'
									/>
								</IconSVG>
							)}
						</EventIcon>
						<EventTitle active={ev.active}>{ev.title}</EventTitle>
						<EventDate active={ev.active}>{ev.date}</EventDate>
						<EventStatus active={ev.active}>{ev.status}</EventStatus>
						<EventPriority>
							<PriorityText active={ev.active}>{ev.priority}</PriorityText>
							{ev.priority !== "-" && <PriorityDot color={ev.dotColor} />}
						</EventPriority>
					</Row>
				))}
			</Table>
		</Box>
	);
}
