"use client";

import React, { useState } from "react";
import styled from "styled-components";

import { Sidebar } from "@/components/Sidebar";
import { HelloTop } from "@/components/top/HelloTop";
import { useMain } from "@/context/EstateContext";

// ─── Modale ───────────────────────────────────────────────────────
import { AddPaymentsModal } from "@/components/modal/AddPaymentsModal";
import { AddBalancesModal } from "@/components/modal/AddBalancesModal";

// ───────────────────────────────────────────────────────────────────
//  Styled Components
// ───────────────────────────────────────────────────────────────────
const MAX_WIDTH = 1400;

const Outer = styled.div`
	display: flex;
	min-height: 100vh;
	background: #f5f5f5;
`;

const Central = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #f5f5f5;
`;

const HelloWrapper = styled.div`
	width: 100%;
	max-width: ${MAX_WIDTH}px;
	margin: 0 auto;
	padding-top: 36px;
`;

const MainPanel = styled.div`
	width: 100%;
	max-width: ${MAX_WIDTH}px;
	margin: 32px auto 0 auto;
	background: #fdfdfd;
	border-radius: 20px 20px 0 0;
	box-shadow: 0px 2px 24px 0px #2828280a;
	display: flex;
	flex-direction: column;
	padding: 0 0 30px 0;
	box-sizing: border-box;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 36px 40px 0 40px;
`;

const Title = styled.span`
	color: #202020;
	font-size: 30px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 1.5px;
`;

const SubTitle = styled.span`
	color: #9d9d9d;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	margin-top: 3px;
`;

const TabsWrapper = styled.div`
	display: flex;
	gap: 14px;
	margin-top: 26px;
	padding: 0 40px;
`;

const TabButton = styled.div<{ active?: boolean }>`
	flex: 1 1 0;
	height: 50px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 0 18px;
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
	padding: 0 40px;
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

const GrayButton = styled.button`
	display: flex;
	align-items: center;
	gap: 7px;
	height: 40px;
	background: #f3f3f3;
	border-radius: 30px;
	border: none;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	color: #9d9d9d;
	font-weight: 400;
	letter-spacing: 0.6px;
	padding: 0 23px;
	cursor: pointer;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const TableWrapper = styled.div`
	margin-top: 22px;
	width: 100%;
	background: #f3f3f3;
	border-radius: 10px;
	padding: 15px 20px 15px 20px;
	box-sizing: border-box;
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

// ───────────────────────────────────────────────────────────────────
//  Component
// ───────────────────────────────────────────────────────────────────
export default function AdvancePaymentPage() {
	const [activeTab, setActiveTab] = useState<0 | 1>(0); // 0 = czynsz, 1 = saldo
	const [search, setSearch] = useState("");
	const [showModal, setShowModal] = useState<"payments" | "balances" | null>(
		null
	);

	const { payments, balances, loading, error, selectedEstateId } = useMain();

	console.log("selectedEstateId", selectedEstateId);
	console.log("payments", payments);
	console.log("balances", balances);

	if (!selectedEstateId)
		return (
			<Outer>
				<Sidebar />
				<Central>
					<HelloWrapper>
						<HelloTop />
					</HelloWrapper>
					<MainPanel>
						<Header>
							<Title>Rozliczenia osiedla</Title>
							<SubTitle>
								Wybierz najpierw osiedle, żeby zobaczyć dane o rozliczeniach.
							</SubTitle>
						</Header>
					</MainPanel>
				</Central>
			</Outer>
		);

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

	const addBtnLabel =
		activeTab === 0
			? "Dodaj/Edytuj kwoty zaliczek"
			: "Dodaj/Edytuj kwoty salda";

	return (
		<Outer>
			<Sidebar />

			<Central>
				<HelloWrapper>
					<HelloTop />
				</HelloWrapper>

				<MainPanel>
					<Header>
						<Title>Rozliczenia osiedla</Title>
						<SubTitle>
							Tutaj ustalasz ogólne stawki na podstawie których system oblicza
							miesięczną zaliczkę dla każdego lokalu i wyświetla ją w aplikacji
							mobilnej mieszkańców.
						</SubTitle>
					</Header>

					<TabsWrapper>
						<TabButton active={activeTab === 0} onClick={() => setActiveTab(0)}>
							<img
								src='/assets/advancePayment/list.png'
								width={15}
								height={15}
								alt='list'
							/>
							Miesięczne zaliczki mieszkańców – czynsz
						</TabButton>
						<TabButton active={activeTab === 1} onClick={() => setActiveTab(1)}>
							<img
								src='/assets/advancePayment/list.png'
								width={15}
								height={15}
								alt='list'
							/>
							Aktualne saldo mieszkańców
						</TabButton>
					</TabsWrapper>

					<ControlsBar>
						<ButtonYellow
							onClick={() =>
								setShowModal(activeTab === 0 ? "payments" : "balances")
							}>
							<img
								src='/assets/advancePayment/plus.png'
								width={15}
								height={15}
								alt='plus'
							/>
							{addBtnLabel}
						</ButtonYellow>

						<InputWrapper>
							<img
								src='/assets/advancePayment/search.png'
								width={15}
								height={15}
								alt='search'
							/>
							<Input
								placeholder='Wyszukaj mieszkanie'
								value={search}
								onChange={e => setSearch(e.target.value)}
							/>
						</InputWrapper>

						<GrayButton>
							<img
								src='/assets/advancePayment/filter.png'
								width={20}
								height={20}
								alt='filter'
							/>
							Filtrowanie
						</GrayButton>
						<GrayButton>
							<img
								src='/assets/advancePayment/filter.png'
								width={20}
								height={20}
								alt='sort'
							/>
							Sortowanie
						</GrayButton>
					</ControlsBar>

					<TableWrapper>
						{loading && (
							<div
								style={{ padding: 30, textAlign: "center", color: "#9d9d9d" }}>
								Ładowanie danych...
							</div>
						)}
						{error && (
							<div style={{ padding: 30, textAlign: "center", color: "red" }}>
								Błąd: {error}
							</div>
						)}

						{!loading && !error && (
							<Table>
								{activeTab === 0 ? (
									<>
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
												<Td
													style={{
														display: "flex",
														justifyContent: "flex-end",
													}}>
													<EditButton>Edytuj dane</EditButton>
												</Td>
											</TableRow>
										))}
									</>
								) : (
									<>
										<TableHeader>
											<Th>Mieszkanie</Th>
											<Th>Saldo</Th>
											<Th />
										</TableHeader>
										{filteredBalances.map(row => (
											<TableRow key={row._id}>
												<Td>{row.flatNumber}</Td>
												<Td>{row.amount} zł</Td>
												<Td
													style={{
														display: "flex",
														justifyContent: "flex-end",
													}}>
													<EditButton>Edytuj saldo</EditButton>
												</Td>
											</TableRow>
										))}
									</>
								)}
							</Table>
						)}
					</TableWrapper>
				</MainPanel>

				{/* ─── Modale */}
				{showModal === "payments" && (
					<AddPaymentsModal isOpen onClose={() => setShowModal(null)} />
				)}
				{showModal === "balances" && (
					<AddBalancesModal isOpen onClose={() => setShowModal(null)} />
				)}
			</Central>
		</Outer>
	);
}
