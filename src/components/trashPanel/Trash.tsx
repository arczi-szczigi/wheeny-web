// components/trashPanel/Trash.tsx

"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import { useAnnouncement } from "@/context/AnnouncementContext";
import { useToastContext } from "@/components/toast/ToastContext";
import WasteModal from "../modal/WasteModal";
import type { GarbageCalendar } from "@/context/AnnouncementContext";
import SearchBarWaste, { FilterStatus, SortValue } from "./SearchBarWaste";

// --- STYLE ---
const OuterWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	background: transparent;
	display: flex;
	justify-content: center;
`;

const CenteredContent = styled.div`
	width: 100%;
	max-width: 1400px;
	margin: 0 auto;
	padding: 0;
	background: transparent;
`;

const Title = styled.h1`
	font-size: 30px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 1.5px;
	color: #202020;
	margin-bottom: 32px;
	margin-top: 0;
`;

const WhiteCard = styled.div`
	width: 100%;
	background: #fdfdfd;
	border-radius: 20px 20px 10px 10px;
	padding: 30px 20px 20px 20px;
	box-sizing: border-box;
	box-shadow: 0 2px 20px rgba(0, 0, 0, 0.01);
`;

const TopRow = styled.div`
	display: flex;
	gap: 18px;
	align-items: center;
	margin-bottom: 18px;
`;

// Info bar dla filtrów
const InfoBar = styled.div`
	margin: 16px 0 0 8px;
	font-size: 13px;
	color: #666;
	display: flex;
	gap: 18px;
`;

const ListWrapper = styled.div`
	margin-top: 24px;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 10px;
	min-height: 64px;
	padding: 0 10px 0 0;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.01);
	gap: 20px;
`;

const RowCol1 = styled.div`
	flex: 3;
	display: flex;
	align-items: center;
	gap: 14px;
`;

const TrashIconWrap = styled.div`
	width: 25px;
	height: 25px;
	background: #ffd100;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const TrashIcon = styled.img`
	width: 16px;
	height: 16px;
`;

const RowLabel = styled.div`
	color: #4d4d4d;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.6px;
`;

const FileNameLink = styled.a`
	color: #222;
	font-size: 13px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.5px;
	text-decoration: underline;
	cursor: pointer;
	&:hover {
		color: #f3a000;
	}
`;

const RowCol2 = styled.div`
	flex: 4;
	display: flex;
	gap: 44px;
	align-items: flex-start;
	padding: 16px 0;
`;

const RowColGroup = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	min-width: 90px;
	gap: 2px;
`;

const ColHeader = styled.div`
	color: #9d9d9d;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.5px;
	margin-bottom: 1px;
`;

const RowValue = styled.div`
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.5px;
`;

const RowActions = styled.div`
	display: flex;
	gap: 20px;
	margin-left: 18px;
`;

const ActionBtn = styled.button<{ danger?: boolean }>`
	padding: 9px 20px;
	border-radius: 30px;
	border: none;
	background: ${({ danger }) => (danger ? "#e8ae9e" : "#d9d9d9")};
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	cursor: pointer;
	transition: background 0.18s;
	&:hover {
		background: ${({ danger }) => (danger ? "#f9cac0" : "#e3e3e3")};
	}
`;

// === KOMPONENT ===
export default function Trash() {
	const { selectedEstateId } = useMain();
	const { showToast } = useToastContext();
	const {
		garbageCalendars,
		loading,
		error,
		fetchGarbageCalendars,
		addGarbageCalendar,
		editGarbageCalendar,
		deleteGarbageCalendar,
	} = useAnnouncement();

	const [search, setSearch] = useState<string>("");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
	const [sortValue, setSortValue] = useState<SortValue>("az");
	const [showWasteModal, setShowWasteModal] = useState(false);
	const [editCalendar, setEditCalendar] = useState<GarbageCalendar | null>(
		null
	);

	// Pobierz harmonogramy na wejściu i przy zmianie osiedla
	useEffect(() => {
		if (selectedEstateId) {
			fetchGarbageCalendars(selectedEstateId);
		}
	}, [selectedEstateId, fetchGarbageCalendars]);

	// Funkcja filtrowania i sortowania kalendarzy
	const getFilteredAndSortedCalendars = () => {
		let filtered = garbageCalendars.filter((calendar: GarbageCalendar) =>
			search.trim().length > 0
				? calendar.year.toString().includes(search.trim())
				: true
		);

		// Filtrowanie
		const currentYear = new Date().getFullYear();
		const today = new Date();

		filtered = filtered.filter(calendar => {
			switch (filterStatus) {
				case "currentYear":
					return calendar.year === currentYear;
				case "upcoming":
					return calendar.year >= currentYear;
				case "past":
					return calendar.year < currentYear;
				case "withFile":
					return calendar.infoFileUrl && calendar.infoFileOriginalName;
				case "withoutFile":
					return !calendar.infoFileUrl || !calendar.infoFileOriginalName;
				default:
					return true;
			}
		});

		// Sortowanie
		filtered.sort((a, b) => {
			switch (sortValue) {
				case "az":
					return a.year.toString().localeCompare(b.year.toString(), "pl");
				case "za":
					return b.year.toString().localeCompare(a.year.toString(), "pl");
				case "yearAsc":
					return a.year - b.year;
				case "yearDesc":
					return b.year - a.year;
				case "datesAsc":
					return a.dates.length - b.dates.length;
				case "datesDesc":
					return b.dates.length - a.dates.length;
				default:
					return 0;
			}
		});

		return filtered;
	};

	const filtered = getFilteredAndSortedCalendars();

	// --- obsługa modala dodawania/edycji ---
	const handleAdd = () => {
		setEditCalendar(null);
		setShowWasteModal(true);
	};
	const handleEdit = (calendar: GarbageCalendar) => {
		setEditCalendar(calendar);
		setShowWasteModal(true);
	};
	const handleDelete = async (id: string) => {
		if (selectedEstateId) {
			showToast({
				type: "confirm",
				message: "Czy na pewno usunąć ten kalendarz?",
				onConfirm: async () => {
					await deleteGarbageCalendar(id, selectedEstateId);
					showToast({
						type: "success",
						message: "Kalendarz został usunięty",
					});
				},
				onCancel: () => {
					// Użytkownik anulował
				},
			});
		}
	};

	return (
		<OuterWrapper>
			<CenteredContent>
				<Title>Odpady</Title>
				<WhiteCard>
					<TopRow>
						<SearchBarWaste
							onAddClick={handleAdd}
							onSearch={setSearch}
							onFilterChange={setFilterStatus}
							onSortChange={setSortValue}
							filterValue={filterStatus}
							sortValue={sortValue}
							placeholder='Wyszukaj kalendarz (rok)'
						/>
					</TopRow>

					<InfoBar>
						<span>
							Filtr:{" "}
							<b>
								{
									{
										all: "Wszystkie",
										currentYear: "Bieżący rok",
										upcoming: "Nadchodzące",
										past: "Przeszłe",
										withFile: "Z plikiem",
										withoutFile: "Bez pliku",
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
										yearAsc: "Rok rosnąco",
										yearDesc: "Rok malejąco",
										datesAsc: "Liczba terminów rosnąco",
										datesDesc: "Liczba terminów malejąco",
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

					<ListWrapper>
						{loading ? (
							<Row>
								<RowCol1>
									<RowLabel>Ładowanie...</RowLabel>
								</RowCol1>
							</Row>
						) : error ? (
							<Row>
								<RowCol1>
									<RowLabel style={{ color: "red" }}>Błąd: {error}</RowLabel>
								</RowCol1>
							</Row>
						) : filtered.length === 0 ? (
							<Row>
								<RowCol1>
									<RowLabel>Brak kalendarzy dla tego osiedla.</RowLabel>
								</RowCol1>
							</Row>
						) : (
							filtered.map((calendar: GarbageCalendar) => (
								<Row key={calendar._id}>
									<RowCol1>
										<TrashIconWrap>
											<TrashIcon src='/assets/trash/trash.svg' alt='trash' />
										</TrashIconWrap>
										{/* RENDERUJEMY NAZWĘ PLIKU JAKO LINK */}
										{calendar.infoFileUrl && calendar.infoFileOriginalName ? (
											<FileNameLink
												href={`${
													process.env.NEXT_PUBLIC_API_URL ||
													"http://localhost:8080"
												}${calendar.infoFileUrl}`}
												download={calendar.infoFileOriginalName}
												target='_blank'
												rel='noopener noreferrer'>
												{calendar.infoFileOriginalName}
											</FileNameLink>
										) : (
											<RowLabel>
												Kalendarz odbioru odpadów gabarytowych
											</RowLabel>
										)}
									</RowCol1>
									<RowCol2>
										<RowColGroup>
											<ColHeader>Rok kalendarzowy</ColHeader>
											<RowValue>{calendar.year}</RowValue>
										</RowColGroup>
										<RowColGroup>
											<ColHeader>Liczba terminów</ColHeader>
											<RowValue>{calendar.dates.length}</RowValue>
										</RowColGroup>
										<RowColGroup>
											<ColHeader>Najbliższy termin</ColHeader>
											<RowValue>
												{calendar.dates.length > 0 ? calendar.dates[0] : "Brak"}
											</RowValue>
										</RowColGroup>
									</RowCol2>
									<RowActions>
										<ActionBtn onClick={() => handleEdit(calendar)}>
											Edytuj terminy
										</ActionBtn>
										<ActionBtn
											danger
											onClick={() => handleDelete(calendar._id)}>
											Usuń kalendarz
										</ActionBtn>
									</RowActions>
								</Row>
							))
						)}
					</ListWrapper>
				</WhiteCard>
				{/* MODAL */}
				{showWasteModal && (
					<WasteModal
						isOpen={showWasteModal}
						onClose={() => setShowWasteModal(false)}
						calendar={editCalendar}
						selectedEstateId={selectedEstateId ?? undefined}
						onCreate={async ({ estateId, year, dates, file }) => {
							await addGarbageCalendar({
								estateId,
								year: Number(year),
								dates,
								file,
							});
							setShowWasteModal(false);
						}}
						onEdit={async (id, { estateId, year, dates, file }) => {
							await editGarbageCalendar(
								id,
								{
									year: Number(year),
									dates,
									file,
								},
								estateId
							);
							setShowWasteModal(false);
						}}
					/>
				)}
			</CenteredContent>
		</OuterWrapper>
	);
}
