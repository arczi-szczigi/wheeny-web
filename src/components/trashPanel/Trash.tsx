"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import { useAnnouncement } from "@/context/AnnouncementContext";
import WasteModal from "../modal/WasteModal";
import type { GarbageCalendar } from "@/context/AnnouncementContext";

// --- Style ---
const PageWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	background: #ededed;
	padding: 42px 0 0 64px;
`;
const Title = styled.h1`
	font-size: 30px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 1.5px;
	color: #202020;
	margin-bottom: 32px;
`;
const WhiteCard = styled.div`
	width: 1360px;
	margin: 0;
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
const AddButton = styled.button`
	display: flex;
	align-items: center;
	background: #ffd100;
	border: none;
	border-radius: 30px;
	height: 40px;
	padding: 0 26px 0 20px;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.6px;
	color: #202020;
	cursor: pointer;
	gap: 8px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	&:hover {
		background: #ffe25c;
	}
`;
const AddIcon = styled.img`
	width: 15px;
	height: 15px;
	margin-right: 2px;
`;
const SearchInputWrapper = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 30px;
	height: 40px;
	padding: 0 22px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	min-width: 380px;
	flex: 1 1 0;
	gap: 8px;
`;
const SearchIcon = styled.img`
	width: 15px;
	height: 15px;
`;
const SearchInput = styled.input`
	border: none;
	background: transparent;
	font-size: 12px;
	font-family: Roboto;
	color: #9d9d9d;
	outline: none;
	flex: 1;
`;
const FilterRow = styled.div`
	display: flex;
	gap: 10px;
`;
const FilterBox = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 30px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	height: 40px;
	padding: 0 20px;
	font-size: 12px;
	color: #9d9d9d;
	font-family: Roboto;
	gap: 8px;
`;
const FilterIcon = styled.img`
	width: 17px;
	height: 17px;
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
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 0.6px;
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
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 0.5px;
	margin-bottom: 1px;
`;
const RowValue = styled.div`
	color: #202020;
	font-size: 10px;
	font-family: Roboto;
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
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.5px;
	cursor: pointer;
	transition: background 0.18s;
	&:hover {
		background: ${({ danger }) => (danger ? "#f9cac0" : "#e3e3e3")};
	}
`;

export default function Trash() {
	const { selectedEstateId } = useMain();
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

	const filtered: GarbageCalendar[] =
		search.trim().length > 0
			? garbageCalendars.filter((calendar: GarbageCalendar) =>
					calendar.year.toString().includes(search.trim())
			  )
			: garbageCalendars;

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
			if (window.confirm("Czy na pewno usunąć ten kalendarz?")) {
				await deleteGarbageCalendar(id, selectedEstateId);
			}
		}
	};

	return (
		<PageWrapper>
			<Title>Odpady</Title>
			<WhiteCard>
				<TopRow>
					<AddButton onClick={handleAdd}>
						<AddIcon src='/assets/trash/plus.svg' alt='plus' />
						Dodaj kalendarz
					</AddButton>
					<SearchInputWrapper>
						<SearchIcon src='/assets/trash/search.svg' alt='search' />
						<SearchInput
							placeholder='Wyszukaj kalendarz (rok)'
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</SearchInputWrapper>
					<FilterRow>
						<FilterBox>
							<FilterIcon src='/assets/trash/filter.svg' alt='filter' />
							Filtrowanie
						</FilterBox>
						<FilterBox>
							<FilterIcon src='/assets/trash/filter.svg' alt='filter' />
							Sortowanie
						</FilterBox>
					</FilterRow>
				</TopRow>

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
									<RowLabel>Kalendarz odbioru odpadów gabarytowych</RowLabel>
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
									<ActionBtn danger onClick={() => handleDelete(calendar._id)}>
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
					calendar={editCalendar} // null = dodawanie, obiekt = edycja
					selectedEstateId={selectedEstateId ?? undefined}
					// poniżej przekazujemy funkcje obsługi dodawania/edycji
					onCreate={async ({ year, days }) => {
						if (!selectedEstateId) return;
						await addGarbageCalendar({
							estateId: selectedEstateId,
							year: Number(year),
							dates: days,
						});
						setShowWasteModal(false);
					}}
					onEdit={async (id, { year, days }) => {
						if (!selectedEstateId) return;
						await editGarbageCalendar(
							id,
							{
								year: Number(year),
								dates: days,
							},
							selectedEstateId
						);
						setShowWasteModal(false);
					}}
				/>
			)}
		</PageWrapper>
	);
}
