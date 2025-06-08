"use client";

import React from "react";
import styled from "styled-components";

// Styl główny karty kontaktów
const Box = styled.div`
	width: 556px;
	background: #fdfdfd;
	border-radius: 16px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	padding: 32px 28px 24px 28px;
	margin: 0 auto;
`;

const HeaderRow = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 16px;
`;

const Header = styled.h2`
	font-family: Roboto;
	font-size: 20px;
	font-weight: 400;
	color: black;
	letter-spacing: 1px;
	flex: 1;
	margin: 0;
`;

const FullListButton = styled.button`
	background: #202020;
	color: white;
	border: none;
	border-radius: 30px;
	padding: 8px 32px;
	font-family: Roboto;
	font-size: 12px;
	font-weight: 400;
	letter-spacing: 0.6px;
	cursor: pointer;
	transition: background 0.14s;
	&:hover {
		background: #313131;
	}
`;

const Divider = styled.div`
	height: 1px;
	background: #d9d9d9;
	margin: 16px 0 12px 0;
`;

const List = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
`;

// Pojedynczy kontakt
const ContactCard = styled.div`
	background: white;
	border-radius: 16px;
	display: flex;
	align-items: center;
	padding: 18px 24px 18px 20px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.01);
`;

const Avatar = styled.img`
	width: 50px;
	height: 50px;
	border-radius: 50%;
	object-fit: cover;
	flex-shrink: 0;
`;

const Info = styled.div`
	flex: 1;
	margin-left: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const Name = styled.div`
	color: #4d4d4d;
	font-size: 20px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.8px;
	margin-bottom: 4px;
`;

const Role = styled.div`
	color: #4d4d4d;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 300;
	letter-spacing: 0.5px;
`;

// Ikony akcji
const Actions = styled.div`
	display: flex;
	gap: 12px;
`;

const ActionButton = styled.button`
	width: 36px;
	height: 36px;
	background: #f3f3f3;
	border: none;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 18px;
	transition: background 0.14s;
	&:hover {
		background: #ececec;
	}
`;

const IconImg = styled.img`
	width: 18px;
	height: 18px;
	object-fit: contain;
	display: block;
`;

const contacts = [
	{
		name: "Zuzanna Kamionek",
		role: "Opiekun osiedla",
		img: "/assets/selectedEstate/zuza.png",
	},
	{
		name: "Łukasz Kosztyła",
		role: "Konserwator",
		img: "/assets/selectedEstate/lukasz.png",
	},
	{
		name: "Marcin Radziwik",
		role: "Zarząd osiedla",
		img: "/assets/selectedEstate/marcin.png",
	},
	{
		name: "Zuzanna Kamionek",
		role: "Zarząd osiedla",
		img: "/assets/selectedEstate/zuza.png",
	},
	{
		name: "Zuzanna Kamionek",
		role: "Księgowa",
		img: "/assets/selectedEstate/zuza.png",
	},
];

export default function ContactsBox() {
	return (
		<Box>
			<HeaderRow>
				<Header>Ważne kontakty</Header>
				<FullListButton>Pełna lista</FullListButton>
			</HeaderRow>
			<Divider />
			<List>
				{contacts.map((c, i) => (
					<ContactCard key={i}>
						<Avatar src={c.img} alt={c.name} />
						<Info>
							<Name>{c.name}</Name>
							<Role>{c.role}</Role>
						</Info>
						<Actions>
							<ActionButton title='Wyślij wiadomość'>
								<IconImg src='/assets/selectedEstate/msg.png' alt='info' />
							</ActionButton>
							<ActionButton title='Zadzwoń'>
								<IconImg src='/assets/selectedEstate/phone.png' alt='tel' />
							</ActionButton>
							<ActionButton title='Szczegóły'>
								<IconImg src='/assets/selectedEstate/info.png' alt='info' />
							</ActionButton>
						</Actions>
					</ContactCard>
				))}
			</List>
		</Box>
	);
}
