import React from "react";
import styled from "styled-components";
import { FiPlus, FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";

const Container = styled.div`
	width: 100%;
	background: #f3f3f3;
	border-radius: 16px;
	padding: 24px 24px 16px 24px;
	display: flex;
	flex-direction: column;
	gap: 18px;
`;

const ActionsBar = styled.div`
	display: flex;
	gap: 18px;
	width: 100%;
`;

const AddOwnerButton = styled.button`
	display: flex;
	align-items: center;
	background: #ffd100;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 30px;
	padding: 0 20px;
	height: 40px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	font-size: 12px;
	letter-spacing: 0.6px;
	color: #202020;
	border: none;
	cursor: pointer;
	gap: 8px;
`;

const SearchInputWrap = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	background: #fff;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 30px;
	padding: 0 20px;
	height: 40px;
`;

const SearchInput = styled.input`
	border: none;
	outline: none;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	width: 100%;
	color: #202020;
	background: transparent;
	margin-left: 8px;
`;

const CircleBox = styled.button<{ active?: boolean }>`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 30px;
	padding: 0 20px;
	height: 40px;
	border: none;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	gap: 6px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	color: #9d9d9d;
	font-weight: 400;
	cursor: pointer;
`;

const TableHead = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	border-bottom: 1px solid #dadada;
	padding: 10px 0 10px 0;
	font-family: Roboto, sans-serif;
`;

const Th = styled.div`
	min-width: 110px;
	font-size: 10px;
	font-weight: 500;
	color: #9d9d9d;
	letter-spacing: 0.5px;
	text-align: left;
	flex: 1;
`;

const ResidentsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const ResidentRow = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 10px;
	padding: 5px 0;
	border-bottom: 1px solid #dadada;
	font-family: Roboto, sans-serif;
`;

const Td = styled.div`
	min-width: 110px;
	font-size: 10px;
	font-weight: 500;
	color: #202020;
	letter-spacing: 0.5px;
	flex: 1;
	text-align: left;
`;

const Actions = styled.div`
	display: flex;
	gap: 10px;
	margin-left: 20px;
`;

const EditButton = styled.button`
	background: #d9d9d9;
	border: none;
	border-radius: 30px;
	padding: 8px 22px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	cursor: pointer;
`;

const DeleteButton = styled.button`
	background: #e8ae9e;
	border: none;
	border-radius: 30px;
	padding: 8px 22px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	cursor: pointer;
`;

const residents = [
	{
		apt: "m.1",
		name: "Imię i Nazwisko",
		email: "Adres e-mail",
		phone: "Telefon",
		area: "68m",
		garage: "TAK",
		storage: "TAK",
		consent: "TAK",
	},
	{
		apt: "m.2",
		name: "Imię i Nazwisko",
		email: "Adres e-mail",
		phone: "Telefon",
		area: "68m",
		garage: "TAK",
		storage: "TAK",
		consent: "TAK",
	},
	// ...więcej rekordów
];

export const ResidentsInfoListBox = () => (
	<Container>
		<ActionsBar>
			<AddOwnerButton>
				<FiPlus size={16} />
				Dodaj właściciela/i
			</AddOwnerButton>
			<SearchInputWrap>
				<FiSearch size={16} color='#9d9d9d' />
				<SearchInput placeholder='Wyszukaj właściciela' />
			</SearchInputWrap>
			<CircleBox>
				<img
					src='/assets/announcmentPanel/filter.png'
					alt='pdf'
					width={25}
					height={25}
				/>
				Filtrowanie
				<FiChevronDown size={16} />
			</CircleBox>
			<CircleBox>
				<img
					src='/assets/announcmentPanel/filter.png'
					alt='pdf'
					width={25}
					height={25}
				/>
				Sortowanie
				<FiChevronDown size={16} />
			</CircleBox>
		</ActionsBar>
		<TableHead>
			<Th>Mieszkanie</Th>
			<Th>Imię i Nazwisko</Th>
			<Th>Adres e-mail</Th>
			<Th>Telefon</Th>
			<Th>Metraż mieszkania</Th>
			<Th>Garaż</Th>
			<Th>Komórka lokatorska</Th>
			<Th>Zgoda na aplikację</Th>
			<Th style={{ minWidth: 180, flex: "none" }}></Th>
		</TableHead>
		<ResidentsList>
			{residents.map((r, idx) => (
				<ResidentRow key={idx}>
					<Td>{r.apt}</Td>
					<Td>{r.name}</Td>
					<Td>{r.email}</Td>
					<Td>{r.phone}</Td>
					<Td>{r.area}</Td>
					<Td>{r.garage}</Td>
					<Td>{r.storage}</Td>
					<Td>{r.consent}</Td>
					<Actions>
						<EditButton>Edytuj dane</EditButton>
						<DeleteButton>Usuń dane</DeleteButton>
					</Actions>
				</ResidentRow>
			))}
		</ResidentsList>
	</Container>
);

export default ResidentsInfoListBox;
