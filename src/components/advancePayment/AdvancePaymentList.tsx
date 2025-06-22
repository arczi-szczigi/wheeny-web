import React, { useState } from "react";
import { useMain } from "@/context/EstateContext";
import styled from "styled-components";

const TabsWrapper = styled.div`
	display: flex;
	gap: 14px;
	margin-top: 26px;
	padding: 0 0 0 0;
`;

const TabButton = styled.div<{ active?: boolean }>`
	flex: 1 1 0;
	height: 50px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	letter-spacing: 0.6px;
	font-weight: 600;
	color: #202020;
	background: ${({ active }) => (active ? "#FFD100" : "#D9D9D9")};
	cursor: pointer;
	transition: background 0.18s;
`;

const ControlsBar = styled.div`
	display: flex;
	gap: 18px;
	margin-top: 22px;
`;

const ButtonYellow = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	height: 40px;
	background: #ffd100;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 30px;
	padding: 0 22px;
	border: none;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	color: #202020;
	font-weight: 400;
	letter-spacing: 0.6px;
	cursor: pointer;
`;

const InputWrapper = styled.div`
	display: flex;
	align-items: center;
	height: 40px;
	width: 340px;
	background: #fff;
	border-radius: 30px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border: 0.5px solid #d9d9d9;
	padding: 0 18px;
	gap: 10px;
`;

const Input = styled.input`
	border: none;
	outline: none;
	font-size: 12px;
	color: #202020;
	background: transparent;
	font-family: Roboto, sans-serif;
	width: 100%;
`;

const Table = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;

const TableHeader = styled.div`
	display: flex;
	align-items: center;
	border-bottom: 0.5px solid #dadada;
	padding: 0 8px;
	min-height: 44px;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #9d9d9d;
	letter-spacing: 0.5px;
`;

const Th = styled.div`
	flex: 1 1 0;
	min-width: 100px;
	padding-left: 10px;
	padding-right: 10px;
`;

const TableRow = styled.div<{ faded?: boolean }>`
	display: flex;
	align-items: center;
	min-height: 44px;
	border-bottom: 0.5px solid #dadada;
	background: ${({ faded }) => (faded ? "rgba(255,255,255,0.5)" : "#fff")};
	border-radius: 10px;
	padding: 0 8px;
	opacity: ${({ faded }) => (faded ? 0.5 : 1)};
`;

const Td = styled.div`
	flex: 1 1 0;
	min-width: 100px;
	padding-left: 10px;
	padding-right: 10px;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #202020;
	letter-spacing: 0.5px;
`;

const EditButton = styled.button`
	background: #d9d9d9;
	border: none;
	border-radius: 30px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	padding: 9px 24px;
	cursor: pointer;
	margin-left: 8px;
`;

export default function AdvancePaymentList() {
	const [activeTab, setActiveTab] = useState(0); // 0 = zaliczki, 1 = saldo
	const [search, setSearch] = useState("");

	const { payments, balances, loading, error, selectedEstateId } = useMain();

	if (!selectedEstateId) return <div>Wybierz osiedle!</div>;
	if (loading) return <div>Ładowanie danych...</div>;
	if (error) return <div style={{ color: "red" }}>Błąd: {error}</div>;

	const filteredPayments = payments.filter(
		p =>
			p.estateId === selectedEstateId &&
			p.flatNumber.toLowerCase().includes(search.toLowerCase())
	);
	const filteredBalances = balances.filter(
		b =>
			b.estateId === selectedEstateId &&
			b.flatNumber.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<>
			<TabsWrapper>
				<TabButton active={activeTab === 0} onClick={() => setActiveTab(0)}>
					Miesięczne zaliczki mieszkańców – czynsz
				</TabButton>
				<TabButton active={activeTab === 1} onClick={() => setActiveTab(1)}>
					Aktualne saldo mieszkańców
				</TabButton>
			</TabsWrapper>
			<ControlsBar>
				<ButtonYellow>
					{activeTab === 0
						? "Dodaj/Edytuj kwoty zaliczek"
						: "Dodaj/Edytuj kwoty salda"}
				</ButtonYellow>
				<InputWrapper>
					<Input
						placeholder='Wyszukaj mieszkanie'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</InputWrapper>
			</ControlsBar>

			{activeTab === 0 ? (
				<Table>
					<TableHeader>
						<Th>Mieszkanie</Th>
						<Th>Kwota czynszu</Th>
						<Th>Nr konta</Th>
						<Th />
					</TableHeader>
					{filteredPayments.map(row => (
						<TableRow key={row._id}>
							<Td>{row.flatNumber}</Td>
							<Td>{row.amount} zł</Td>
							<Td>{row.bankAccount}</Td>
							<Td style={{ display: "flex", justifyContent: "flex-end" }}>
								<EditButton>Edytuj dane</EditButton>
							</Td>
						</TableRow>
					))}
				</Table>
			) : (
				<Table>
					<TableHeader>
						<Th>Mieszkanie</Th>
						<Th>Saldo</Th>
						<Th />
					</TableHeader>
					{filteredBalances.map(row => (
						<TableRow key={row._id}>
							<Td>{row.flatNumber}</Td>
							<Td>{row.amount} zł</Td>
							<Td style={{ display: "flex", justifyContent: "flex-end" }}>
								<EditButton>Edytuj saldo</EditButton>
							</Td>
						</TableRow>
					))}
				</Table>
			)}
		</>
	);
}
