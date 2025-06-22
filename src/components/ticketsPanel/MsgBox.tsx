"use client";

import React from "react";
import styled from "styled-components";
import { useMain, Ticket } from "@/context/EstateContext"; // Popraw import na useMain!

// Kolory tła i kropek dla statusów
const BG_COLORS: Record<string, string> = {
	open: "#FFD100", // żółty
	in_progress: "#E1F1FF", // niebieski
	closed: "#E56A6A", // czerwony
};

const DOT_COLORS: Record<string, string> = {
	open: "#FFD100",
	in_progress: "#52A2F9",
	closed: "#98C580",
};

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

const Wrapper = styled.div`
	width: 370px;
	height: 780px;
	background: #fdfdfd;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

const TopBar = styled.div`
	padding: 24px 25px 10px 25px;
	display: flex;
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
`;

const ButtonIconLeft = styled.img`
	width: 18px;
	height: 18px;
`;

const ButtonIconRight = styled.img`
	width: 20px;
	height: 20px;
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
	cursor: pointer;
	gap: 8px;
	padding-left: 12px;
`;

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
	background: ${({ status }) => BG_COLORS[status] || "#fff"};
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
	color: ${({ status }) => (status === "in_progress" ? "#9D9D9D" : "#202020")};
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
	background: ${({ status }) => DOT_COLORS[status] || "#98C580"};
`;

export default function MsgBox() {
	const { tickets, selectedEstateId } = useMain(); // <-- Nowy context!
	const [tab, setTab] = React.useState(0);

	const tabIcons = [
		"/assets/msgPanel/check.png",
		"/assets/msgPanel/check.png",
		"/assets/msgPanel/delete.png",
	];

	const filtered = React.useMemo(() => {
		let list = tickets.filter((t: Ticket) => t.estate === selectedEstateId);
		if (tab === 1) list = list.filter(t => t.status === "in_progress");
		if (tab === 2) list = list.filter(t => t.status === "closed");
		return list.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	}, [tickets, selectedEstateId, tab]);

	const formatDate = (iso: string) => {
		const d = new Date(iso);
		return d.toLocaleDateString("pl-PL", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

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
				{["Wszystkie", "W trakcie", "Zamknięte"].map((label, idx) => (
					<Tab key={idx} active={tab === idx} onClick={() => setTab(idx)}>
						<TabIcon src={tabIcons[idx]} alt={label.toLowerCase()} />
						{label}
					</Tab>
				))}
			</Tabs>

			<List>
				{filtered.length === 0 && (
					<div
						style={{
							color: "#9d9d9d",
							fontSize: 14,
							textAlign: "center",
							marginTop: 20,
						}}>
						Brak zgłoszeń w tej zakładce.
					</div>
				)}
				{filtered.map((t: Ticket, i: number) => {
					const latest = t.messages[t.messages.length - 1];
					return (
						<MsgRow key={t._id || i} status={t.status}>
							<AvatarCircle>
								<AvatarImg src='/assets/msgPanel/msg.png' alt='avatar' />
							</AvatarCircle>
							<MsgMain>
								<Name>
									{latest?.sender === "manager" ? "Zarządca" : "Mieszkaniec"}
								</Name>
								<Message status={t.status}>{latest?.content}</Message>
							</MsgMain>
							<Meta>
								<Time>{formatDate(t.createdAt)}</Time>
								<Dot status={t.status} />
							</Meta>
						</MsgRow>
					);
				})}
			</List>
		</Wrapper>
	);
}
