"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Sidebar } from "@/components/Sidebar";
import { HelloTop } from "@/components/top/HelloTop";
import { useMain } from "@/context/EstateContext";

// Komponenty:
import SearchBarAdvancePayment, { FilterStatus, SortValue } from "@/components/advancePayment/SearchBarAdvancePayment";

// Modale do importu plików:
import AddPaymentsModal from "@/components/modal/AddPaymentsModal";
import AddBalancesModal from "@/components/modal/AddBalancesModal";

// Toasty:
import { useToast } from "@/components/toast/useToast";
import ToastContainer from "@/components/toast/ToastContainer";

const MAX_WIDTH = 1400;

// --- STYLE ---
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

// Info bar dla filtrów
const InfoBar = styled.div`
	margin: 16px 0 0 8px;
	font-size: 13px;
	color: #666;
	display: flex;
	gap: 18px;
	padding: 0 40px;
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

export default function AdvancePaymentPage() {
	const [activeTab, setActiveTab] = useState<0 | 1>(0); // 0 = czynsz, 1 = saldo
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
	const [sortValue, setSortValue] = useState<SortValue>("numerical");
	const [showAddPaymentsModal, setShowAddPaymentsModal] = useState(false);
	const [showAddBalancesModal, setShowAddBalancesModal] = useState(false);

	const {
		payments,
		balances,
		loading,
		error,
		selectedEstateId,
		updatePayment,
		updateBalance,
		reloadPayments,
		reloadBalances,
	} = useMain();

	// Toast
	const { toasts, removeToast, showToast } = useToast();

	// Funkcja pomocnicza do parsowania numeru mieszkania
	const parseApartmentNumber = (flatNumber: string): number => {
		// Próbuje wyciągnąć liczbę z początku stringu (np. "12A" -> 12, "5" -> 5, "M12" -> 12)
		const match = flatNumber.match(/\d+/);
		return match ? parseInt(match[0], 10) : 0;
	};

	// Funkcja filtrowania i sortowania dla payments
	const getFilteredAndSortedPayments = () => {
		let filtered = payments.filter(
			p =>
				p.estateId === selectedEstateId &&
				p.flatNumber.toLowerCase().includes(search.toLowerCase())
		);

		// Filtrowanie
		if (filterStatus === "withBalance") {
			filtered = filtered.filter(p => p.amount > 0);
		} else if (filterStatus === "withoutBalance") {
			filtered = filtered.filter(p => p.amount === 0);
		} else if (filterStatus === "overdue") {
			// Tutaj można dodać logikę dla przeterminowanych płatności
			// Na razie zostawiamy wszystkie
		}

		// Sortowanie
		filtered.sort((a, b) => {
			switch (sortValue) {
				case "numerical":
					return parseApartmentNumber(a.flatNumber) - parseApartmentNumber(b.flatNumber);
				case "numericalDesc":
					return parseApartmentNumber(b.flatNumber) - parseApartmentNumber(a.flatNumber);
				case "az":
					return a.flatNumber.localeCompare(b.flatNumber, "pl");
				case "za":
					return b.flatNumber.localeCompare(a.flatNumber, "pl");
				case "amountAsc":
					return a.amount - b.amount;
				case "amountDesc":
					return b.amount - a.amount;
				default:
					return 0;
			}
		});

		return filtered;
	};

	// Funkcja filtrowania i sortowania dla balances
	const getFilteredAndSortedBalances = () => {
		let filtered = balances.filter(
			b =>
				b.estateId === selectedEstateId &&
				b.flatNumber.toLowerCase().includes(search.toLowerCase())
		);

		// Filtrowanie
		if (filterStatus === "withBalance") {
			filtered = filtered.filter(b => b.amount > 0);
		} else if (filterStatus === "withoutBalance") {
			filtered = filtered.filter(b => b.amount === 0);
		} else if (filterStatus === "overdue") {
			// Tutaj można dodać logikę dla przeterminowanych sald
			// Na razie zostawiamy wszystkie
		}

		// Sortowanie
		filtered.sort((a, b) => {
			switch (sortValue) {
				case "numerical":
					return parseApartmentNumber(a.flatNumber) - parseApartmentNumber(b.flatNumber);
				case "numericalDesc":
					return parseApartmentNumber(b.flatNumber) - parseApartmentNumber(a.flatNumber);
				case "az":
					return a.flatNumber.localeCompare(b.flatNumber, "pl");
				case "za":
					return b.flatNumber.localeCompare(a.flatNumber, "pl");
				case "amountAsc":
					return a.amount - b.amount;
				case "amountDesc":
					return b.amount - a.amount;
				default:
					return 0;
			}
		});

		return filtered;
	};

	const filteredPayments = getFilteredAndSortedPayments();
	const filteredBalances = getFilteredAndSortedBalances();

	// Edycja payments
	const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
	const [editingPaymentAmount, setEditingPaymentAmount] = useState<number>(0);
	const [editingPaymentBankAccount, setEditingPaymentBankAccount] =
		useState<string>("");

	const startEditPayment = (row: (typeof payments)[0]) => {
		setEditingPaymentId(row._id);
		setEditingPaymentAmount(row.amount);
		setEditingPaymentBankAccount(row.bankAccount);
	};
	const handleSavePayment = async () => {
		if (editingPaymentId) {
			await updatePayment(editingPaymentId, {
				amount: editingPaymentAmount,
				bankAccount: editingPaymentBankAccount,
			});
			setEditingPaymentId(null);
			reloadPayments?.();
		}
	};
	const cancelEditPayment = () => setEditingPaymentId(null);

	// Edycja balances
	const [editingBalanceId, setEditingBalanceId] = useState<string | null>(null);
	const [editingBalanceAmount, setEditingBalanceAmount] = useState<number>(0);

	const startEditBalance = (row: (typeof balances)[0]) => {
		setEditingBalanceId(row._id);
		setEditingBalanceAmount(row.amount);
	};
	const handleSaveBalance = async () => {
		if (editingBalanceId) {
			await updateBalance(editingBalanceId, {
				amount: editingBalanceAmount,
			});
			setEditingBalanceId(null);
			reloadBalances?.();
		}
	};
	const cancelEditBalance = () => setEditingBalanceId(null);

	return (
		<>
			{/* Toasty */}
			<ToastContainer toasts={toasts} removeToast={removeToast} />

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
								miesięczną zaliczkę dla każdego lokalu i wyświetla ją w
								aplikacji mobilnej mieszkańców.
							</SubTitle>
						</Header>

						<TabsWrapper>
							<TabButton
								active={activeTab === 0}
								onClick={() => setActiveTab(0)}>
								<img
									src='/assets/advancePayment/list.png'
									width={15}
									height={15}
									alt='list'
								/>
								Miesięczne zaliczki mieszkańców – czynsz
							</TabButton>
							<TabButton
								active={activeTab === 1}
								onClick={() => setActiveTab(1)}>
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
							<SearchBarAdvancePayment
								onAddClick={() =>
									activeTab === 0
										? setShowAddPaymentsModal(true)
										: setShowAddBalancesModal(true)
								}
								onSearch={setSearch}
								onFilterChange={setFilterStatus}
								onSortChange={setSortValue}
								filterValue={filterStatus}
								sortValue={sortValue}
								placeholder='Wyszukaj mieszkanie'
								activeTab={activeTab}
							/>
						</ControlsBar>

						<InfoBar>
							<span>
								Filtr:{" "}
								<b>
									{
										{
											all: "Wszystkie",
											withBalance: "Z saldem",
											withoutBalance: "Bez salda",
											overdue: "Przeterminowane",
										}[filterStatus]
									}
								</b>
							</span>
							<span>
								Sort:{" "}
								<b>
									{
										{
											numerical: "1-999",
											numericalDesc: "999-1",
											az: "A-Z",
											za: "Z-A",
											amountAsc: "Kwota rosnąco",
											amountDesc: "Kwota malejąco",
										}[sortValue]
									}
								</b>
							</span>
							{search && (
								<span>
									Szukasz: <b>{search}</b>
								</span>
							)}
						</InfoBar>

						<TableWrapper>
							{loading && (
								<div
									style={{
										padding: 30,
										textAlign: "center",
										color: "#9d9d9d",
									}}>
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
													<Td>
														{editingPaymentId === row._id ? (
															<input
																type='number'
																value={editingPaymentAmount}
																onChange={e =>
																	setEditingPaymentAmount(
																		Number(e.target.value)
																	)
																}
																style={{
																	width: "80px",
																	padding: "2px 6px",
																	borderRadius: "7px",
																	border: "1px solid #ccc",
																}}
															/>
														) : (
															`${row.amount} zł`
														)}
													</Td>
													<Td>
														{editingPaymentId === row._id ? (
															<input
																type='text'
																value={editingPaymentBankAccount}
																onChange={e =>
																	setEditingPaymentBankAccount(e.target.value)
																}
																style={{
																	width: "160px",
																	padding: "2px 6px",
																	borderRadius: "7px",
																	border: "1px solid #ccc",
																}}
															/>
														) : (
															row.bankAccount
														)}
													</Td>
													<Td
														style={{
															display: "flex",
															justifyContent: "flex-end",
														}}>
														{editingPaymentId === row._id ? (
															<>
																<EditButton onClick={handleSavePayment}>
																	Zapisz
																</EditButton>
																<EditButton onClick={cancelEditPayment}>
																	Anuluj
																</EditButton>
															</>
														) : (
															<EditButton onClick={() => startEditPayment(row)}>
																Edytuj dane
															</EditButton>
														)}
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
													<Td>
														{editingBalanceId === row._id ? (
															<input
																type='number'
																value={editingBalanceAmount}
																onChange={e =>
																	setEditingBalanceAmount(
																		Number(e.target.value)
																	)
																}
																style={{
																	width: "80px",
																	padding: "2px 6px",
																	borderRadius: "7px",
																	border: "1px solid #ccc",
																}}
															/>
														) : (
															`${row.amount} zł`
														)}
													</Td>
													<Td
														style={{
															display: "flex",
															justifyContent: "flex-end",
														}}>
														{editingBalanceId === row._id ? (
															<>
																<EditButton onClick={handleSaveBalance}>
																	Zapisz
																</EditButton>
																<EditButton onClick={cancelEditBalance}>
																	Anuluj
																</EditButton>
															</>
														) : (
															<EditButton onClick={() => startEditBalance(row)}>
																Edytuj saldo
															</EditButton>
														)}
													</Td>
												</TableRow>
											))}
										</>
									)}
								</Table>
							)}
						</TableWrapper>
					</MainPanel>
				</Central>
			</Outer>

			{/* Modale */}
			<AddPaymentsModal
				isOpen={showAddPaymentsModal}
				onClose={() => setShowAddPaymentsModal(false)}
				showToast={showToast}
				reloadPayments={reloadPayments}
			/>
			<AddBalancesModal
				isOpen={showAddBalancesModal}
				onClose={() => setShowAddBalancesModal(false)}
				showToast={showToast}
				reloadBalances={reloadBalances}
			/>
		</>
	);
}
