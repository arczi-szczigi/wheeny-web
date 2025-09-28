// components//announcmentsPanel/AnnouncmentsListBox.tsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddAnnouncementModal from "../modal/AddAnnouncementModal";
import EditAnnouncementModal from "../modal/EditAnnouncementModal";
import { useAnnouncement } from "@/context/AnnouncementContext";
import { useMain } from "@/context/EstateContext";
import { useToastContext } from "../toast/ToastContext";
import SearchBarAnnouncement, { FilterStatus, SortValue } from "./SearchBarAnnouncement";

const Container = styled.div`
	width: 100vw;
	min-height: 100vh;
	background: #f5f5f5;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
`;

const MainPanel = styled.div`
	width: 1400px;
	margin: 42px auto 0 auto;
	background: #fdfdfd;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	box-shadow: 0px 2px 24px 0px #2828280a;
	display: flex;
	flex-direction: column;
	padding: 30px 20px 30px 20px;
	gap: 10px;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding-left: 12px;
`;

const Title = styled.span`
	color: black;
	font-size: 30px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 1.5px;
`;

const ControlsBar = styled.div`
	display: flex;
	gap: 18px;
	margin-top: 22px;
	align-items: center;
`;

// Info bar dla filtrów
const InfoBar = styled.div`
	margin: 16px 0 0 8px;
	font-size: 13px;
	color: #666;
	display: flex;
	gap: 18px;
`;

const TableWrapper = styled.div`
	margin-top: 20px;
	width: 100%;
	background: #f3f3f3;
	border-radius: 10px;
	padding: 15px 10px 15px 10px;
`;

const Table = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0px;
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
	background: transparent;
`;

const Th = styled.div`
	flex: 1 1 0;
	min-width: 100px;
	padding-left: 10px;
	padding-right: 10px;
	&:first-child {
		max-width: 50px;
	}
`;

const TableRow = styled.div`
	display: flex;
	align-items: center;
	min-height: 60px;
	border-bottom: 0.5px solid #dadada;
	background: #fff;
	border-radius: 10px;
	padding: 0 8px;
	margin-bottom: 8px;
`;

const AnnouncementIcon = styled.div`
	width: 25px;
	height: 25px;
	background: #ffd100;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 17px;
	color: #202020;
	margin-right: 10px;
`;

const Td = styled.div`
	flex: 1 1 0;
	min-width: 100px;
	padding-left: 10px;
	padding-right: 10px;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #4d4d4d;
	letter-spacing: 0.6px;
	display: flex;
	align-items: center;

	&.author,
	&.date,
	&.receivers {
		font-size: 10px;
		color: #202020;
		font-weight: 500;
		letter-spacing: 0.5px;
	}
	&.receivers {
		text-transform: lowercase;
	}
`;

const ActionsCell = styled.div`
	display: flex;
	gap: 10px;
	justify-content: flex-end;
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
	white-space: nowrap;
	transition: background 0.14s;
`;

const DeleteButton = styled(EditButton)`
	background: #e8ae9e;
`;

// --------------------- KOMPONENT -------------------------

export default function AnnouncmentsListBox() {
	const { selectedEstateId, manager } = useMain();
	const {
		announcements,
		loading,
		error,
		fetchAnnouncements,
		deleteAnnouncement,
	} = useAnnouncement();
	const { showToast } = useToastContext();

	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
	const [sortValue, setSortValue] = useState<SortValue>("az");
	const [showAddModal, setShowAddModal] = useState(false);

	// Obsługa modala edycji:
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(
		null
	);

	useEffect(() => {
		if (selectedEstateId) fetchAnnouncements(selectedEstateId);
	}, [selectedEstateId, fetchAnnouncements]);

	// Funkcja filtrowania i sortowania ogłoszeń
	const getFilteredAndSortedAnnouncements = () => {
		let filtered = announcements.filter(
			a =>
				(String(a.estate) === String(selectedEstateId) ||
					String(a.estateId) === String(selectedEstateId)) &&
				a.title.toLowerCase().includes(search.toLowerCase())
		);

		// Filtrowanie po dacie
		const now = new Date();
		const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const startOfWeek = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000);

		filtered = filtered.filter(announcement => {
			const publishDate = new Date(announcement.publishedAt);
			
			switch (filterStatus) {
				case "recent":
					return publishDate >= sevenDaysAgo;
				case "thisMonth":
					return publishDate >= startOfMonth;
				case "thisWeek":
					return publishDate >= startOfWeek;
				case "old":
					return publishDate < oneMonthAgo;
				default:
					return true;
			}
		});

		// Sortowanie
		filtered.sort((a, b) => {
			switch (sortValue) {
				case "az":
					return a.title.localeCompare(b.title, "pl");
				case "za":
					return b.title.localeCompare(a.title, "pl");
				case "dateNewest":
					return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
				case "dateOldest":
					return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
				default:
					return 0;
			}
		});

		return filtered;
	};

	const filtered = getFilteredAndSortedAnnouncements();

	return (
		<Container>
			<MainPanel>
				<Header>
					<Title>Ogłoszenia</Title>
				</Header>
				<ControlsBar>
					<SearchBarAnnouncement
						onAddClick={() => setShowAddModal(true)}
						onSearch={setSearch}
						onFilterChange={setFilterStatus}
						onSortChange={setSortValue}
						filterValue={filterStatus}
						sortValue={sortValue}
						placeholder='Wyszukaj ogłoszenie'
					/>
				</ControlsBar>

				<InfoBar>
					<span>
						Filtr:{" "}
						<b>
							{
								{
									all: "Wszystkie",
									recent: "Ostatnie 7 dni",
									thisMonth: "Ten miesiąc",
									thisWeek: "Ten tydzień",
									old: "Starsze niż miesiąc",
								}[filterStatus]
							}
						</b>
					</span>
					<span>
						Sort:{" "}
						<b>
							{
								{
									az: "A-Z",
									za: "Z-A",
									dateNewest: "Data (najnowsze)",
									dateOldest: "Data (najstarsze)",
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
					<Table>
						<TableHeader>
							<Th style={{ maxWidth: 50 }}></Th>
							<Th>Tytuł ogłoszenia</Th>
							<Th style={{ minWidth: 110 }}>Dodane przez</Th>
							<Th style={{ minWidth: 110 }}>Data dodania</Th>
							<Th style={{ minWidth: 100 }}>Odbiorcy</Th>
							<Th></Th>
						</TableHeader>
						{loading ? (
							<div
								style={{ padding: 30, textAlign: "center", color: "#9d9d9d" }}>
								Ładowanie danych...
							</div>
						) : error ? (
							<div style={{ padding: 30, textAlign: "center", color: "red" }}>
								Błąd: {error}
							</div>
						) : filtered.length === 0 ? (
							<div
								style={{ padding: 30, textAlign: "center", color: "#9d9d9d" }}>
								Brak ogłoszeń.
							</div>
						) : (
							filtered.map(row => (
								<TableRow key={row._id}>
									<Td style={{ maxWidth: 50 }}>
										<AnnouncementIcon>
											<img
												src='/assets/announcmentPanel/book.png'
												alt='pdf'
												width={15}
												height={15}
											/>
										</AnnouncementIcon>
									</Td>
									<Td>{row.title}</Td>
									<Td className='author'>
										{manager && row.createdBy === manager._id
											? `${manager.firstName} ${manager.lastName}`
											: "Manager"}
									</Td>
									<Td className='date'>
										{row.publishedAt
											?.slice(0, 10)
											?.split("-")
											.reverse()
											.join(".")}
									</Td>
									<Td className='receivers'>wszyscy</Td>
									<ActionsCell>
										<EditButton
											onClick={() => {
												setEditingAnnouncement(row);
												setEditModalOpen(true);
											}}>
											Edytuj ogłoszenie
										</EditButton>
											<DeleteButton
												onClick={() => {
													if (!selectedEstateId) return;
													
													showToast({
														type: "confirm",
														message: `Czy na pewno chcesz usunąć ogłoszenie "${row.title}"?`,
														onConfirm: async () => {
															try {
																await deleteAnnouncement(row._id, selectedEstateId);
																showToast({
																	type: "success",
																	message: "Ogłoszenie zostało usunięte"
																});
															} catch (error) {
																showToast({
																	type: "error",
																	message: "Błąd podczas usuwania ogłoszenia"
																});
															}
														}
													});
												}}>
													Usuń ogłoszenie
												</DeleteButton>
									</ActionsCell>
								</TableRow>
							))
						)}
					</Table>
				</TableWrapper>
			</MainPanel>
			{showAddModal && (
				<AddAnnouncementModal
					isOpen
					onClose={() => setShowAddModal(false)}
					selectedEstateId={selectedEstateId ?? undefined}
				/>
			)}
			{editModalOpen && editingAnnouncement && (
				<EditAnnouncementModal
					isOpen={editModalOpen}
					onClose={() => setEditModalOpen(false)}
					announcement={{
						_id: editingAnnouncement._id,
						title: editingAnnouncement.title,
						content: editingAnnouncement.content,
						publishedAt: editingAnnouncement.publishedAt,
						estateId:
							editingAnnouncement.estateId ?? editingAnnouncement.estate ?? "",
					}}
				/>
			)}
		</Container>
	);
}
