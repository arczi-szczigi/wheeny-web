"use client";

import React from "react";
import styled, { css } from "styled-components";

// Kolory statusów
const dotColors: Record<string, string> = {
	nowa: "#FFD100",
	ważna: "#FFD100",
	"w trakcie": "#E1F1FF",
	zamknięta: "#98C580",
	odczytana: "#073C5F",
	default: "#98C580",
};

const messages = [
	{
		name: "Marek Kowal",
		message: "Mam pytanie odnośnie nadchodzącego zebrania...",
		time: "11:40",
		status: "ważna",
	},
	{
		name: "Ewa Konieczna",
		message: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "09:10",
		status: "ważna",
	},
	{
		name: "Dorota Przylas",
		message: "Dziękujemy za ostanie spotkanI, było nam...",
		time: "wczoraj",
		status: "w trakcie",
	},
	{
		name: "Rafał Borówka",
		message: "Szanowni Państwo",
		time: "wczoraj",
		status: "zamknięta",
	},
	{
		name: "Jacek Izolta",
		message: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "12.05.2025",
		status: "zamknięta",
	},
	{
		name: "Stefan Niemas",
		message: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "01.04.2025",
		status: "odczytana",
	},
	{
		name: "Tomek Cios",
		message: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "21.04.2025",
		status: "odczytana",
	},
	{
		name: "Grzegorz Boberek",
		message: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "19.03.2025",
		status: "zamknięta",
	},
	{
		name: "Ola Szfran",
		message: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "02.02.2025",
		status: "zamknięta",
	},
];

const Wrapper = styled.div`
	width: 400px;
	height: 780px;
	background: #fdfdfd;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	position: relative;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

const TopBar = styled.div`
	padding: 24px 25px 10px 25px;
	display: flex;
	align-items: center;
	gap: 12px;
`;

const WriteMsgButton = styled.button`
	flex: 1;
	background: #fff;
	border: 1px solid #202020;
	border-radius: 30px;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 400;
	color: #202020;
	padding: 10px 20px;
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	letter-spacing: 0.6px;
	outline: none;
	min-width: 0;
	justify-content: space-between;
`;

// Ikona po lewej w przycisku
const ButtonIconLeft = styled.img`
	width: 18px;
	height: 18px;
	margin-right: 8px;
`;

// Ikona po prawej w przycisku
const ButtonIconRight = styled.img`
	width: 20px;
	height: 20px;
	margin-left: 8px;
`;

const SearchBar = styled.div`
	margin: 0 25px 16px 25px;
	background: #f3f3f3;
	border-radius: 20px;
	display: flex;
	align-items: center;
	padding: 0 20px;
	height: 40px;
	gap: 10px;
`;

const SearchInput = styled.input`
	flex: 1;
	border: none;
	background: transparent;
	font-size: 12px;
	font-family: Roboto;
	color: #202020;
	outline: none;
	padding: 8px 0;
	::placeholder {
		color: #9d9d9d;
		font-size: 12px;
		letter-spacing: 0.6px;
	}
`;

// Możesz podmienić na PNG jak chcesz, tu zostaje svg lupa
const SearchIcon = () => (
	<svg width='18' height='18' fill='none' viewBox='0 0 20 20'>
		<circle cx='9' cy='9' r='7' stroke='#9D9D9D' strokeWidth='2' />
		<line
			x1='14.1213'
			y1='14.7071'
			x2='17'
			y2='17.5858'
			stroke='#9D9D9D'
			strokeWidth='2'
		/>
	</svg>
);

const Tabs = styled.div`
	display: flex;
	gap: 10px;
	margin: 0 25px 16px 25px;
`;

const Tab = styled.button<{ active?: boolean }>`
	flex: 1;
	background: ${({ active }) => (active ? "#DADADA" : "#F3F3F3")};
	border: none;
	border-radius: 10px;
	height: 40px;
	font-size: 10px;
	font-family: Roboto;
	font-weight: ${({ active }) => (active ? 600 : 400)};
	color: #202020;
	letter-spacing: 0.5px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	cursor: pointer;
	gap: 8px;
	padding-left: 12px;
	transition: background 0.15s;
`;

// Ikona po lewej w Tabie
const TabIcon = styled.img`
	width: 16px;
	height: 16px;
	margin-right: 8px;
`;

const List = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 0 25px 24px 25px;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const MsgRow = styled.div<{ status: string }>`
	display: flex;
	align-items: center;
	border-radius: 10px;
	background: ${({ status }) =>
		status === "ważna"
			? "#FFD100"
			: status === "w trakcie"
			? "#E1F1FF"
			: "#fff"};
	padding: 10px 10px 10px 0;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	min-height: 50px;
`;

const AvatarCircle = styled.div`
	min-width: 30px;
	min-height: 30px;
	border-radius: 15px;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 10px;
	margin-right: 10px;
`;

const AvatarImg = styled.img`
	width: 18px;
	height: 18px;
`;

const MsgMain = styled.div`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

const Name = styled.div`
	color: #202020;
	font-size: 14px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.7px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Message = styled.div<{ status: string }>`
	color: ${({ status }) => (status === "w trakcie" ? "#9D9D9D" : "#202020")};
	font-size: 8px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.4px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Meta = styled.div`
	min-width: 65px;
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 5px;
`;

const Time = styled.div`
	color: #4d4d4d;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 600;
	letter-spacing: 0.5px;
	text-align: right;
`;

const Dot = styled.div<{ status: string }>`
	width: 10px;
	height: 10px;
	border-radius: 999px;
	background: ${({ status }) => dotColors[status] || "#98C580"};
`;

export default function MsgBox() {
	const [tab, setTab] = React.useState(0);

	// Tab ikony
	const tabIcons = [
		"/assets/msgPanel/check.png", // Wszystkie
		"/assets/msgPanel/check.png", // W trakcie
		"/assets/msgPanel/delete.png", // Zamknięte
	];

	// Filtruj wg tabów:
	const filteredMessages = messages.filter(msg => {
		if (tab === 0) return true;
		if (tab === 1) return msg.status === "w trakcie";
		if (tab === 2)
			return msg.status === "zamknięta" || msg.status === "odczytana";
		return true;
	});

	return (
		<Wrapper>
			<TopBar>
				<WriteMsgButton>
					<ButtonIconLeft src='/assets/msgPanel/msg.png' alt='msg' />
					<span style={{ flex: 1, textAlign: "left" }}>
						Napisz nową wiadomość
					</span>
					<ButtonIconRight src='/assets/msgPanel/send.png' alt='send' />
				</WriteMsgButton>
			</TopBar>
			<SearchBar>
				<SearchIcon />
				<SearchInput placeholder='Wyszukaj wiadomość' />
			</SearchBar>
			<Tabs>
				<Tab active={tab === 0} onClick={() => setTab(0)}>
					<TabIcon src={tabIcons[0]} alt='all' />
					Wszystkie
				</Tab>
				<Tab active={tab === 1} onClick={() => setTab(1)}>
					<TabIcon src={tabIcons[1]} alt='inprogress' />W trakcie
				</Tab>
				<Tab active={tab === 2} onClick={() => setTab(2)}>
					<TabIcon src={tabIcons[2]} alt='closed' />
					Zamknięte
				</Tab>
			</Tabs>
			<List>
				{filteredMessages.map((msg, i) => (
					<MsgRow key={i} status={msg.status}>
						<AvatarCircle>
							<AvatarImg src='/assets/msgPanel/msg.png' alt='avatar' />
						</AvatarCircle>
						<MsgMain>
							<Name>{msg.name}</Name>
							<Message status={msg.status}>{msg.message}</Message>
						</MsgMain>
						<Meta>
							<Time>{msg.time}</Time>
							<Dot status={msg.status} />
						</Meta>
					</MsgRow>
				))}
			</List>
		</Wrapper>
	);
}
