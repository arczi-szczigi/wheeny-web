// components/ResidentsInfoListBox.tsx

"use client";

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import ResidentsModal from "@/components/modal/ResidentsModal";
import { Resident } from "@/context/AnnouncementContext";
import SearchBarResidents, { FilterStatus, SortValue } from "./SearchBarResidents";

interface ResidentsInfoListBoxProps {
	estateId: string;
	residents: Resident[];
	loading: boolean;
	error: string | null;
	editResident: (
		id: string,
		data: Partial<Resident>,
		estateId: string
	) => Promise<void>;
	deleteResident: (id: string, estateId: string) => Promise<void>;
}

const Container = styled.div`
	width: 100%;
	max-width: 1400px;
	margin: 0 auto;
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

// Info bar dla filtrów
const InfoBar = styled.div`
	margin: 16px 0 0 8px;
	font-size: 13px;
	color: #666;
	display: flex;
	gap: 18px;
`;
const TableHead = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	border-bottom: 1px solid #dadada;
	padding: 10px 0;
	font-family: Roboto, sans-serif;
`;
const Th = styled.div<{ email?: boolean; phone?: boolean }>`
	min-width: ${({ email, phone }) =>
		email ? "250px" : phone ? "130px" : "110px"};
	flex: ${({ email, phone }) => (email ? 2.5 : phone ? 1.1 : 1)};
	font-size: 10px;
	font-weight: 500;
	color: #9d9d9d;
	letter-spacing: 0.5px;
	text-align: left;
	&:first-child {
		padding-left: 32px;
	}
	&:last-child {
		padding-right: 32px;
	}
`;
const Td = styled.div<{ email?: boolean; phone?: boolean }>`
	min-width: ${({ email, phone }) =>
		email ? "250px" : phone ? "130px" : "110px"};
	flex: ${({ email, phone }) => (email ? 2.5 : phone ? 1.1 : 1)};
	font-size: 10px;
	font-weight: 500;
	color: #202020;
	letter-spacing: 0.5px;
	text-align: left;
	white-space: pre-line;
	overflow: hidden;
	text-overflow: ellipsis;
	&:first-child {
		padding-left: 32px;
	}
	&:last-child {
		padding-right: 32px;
	}
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
const EditInput = styled.input`
	width: 95%;
	padding: 2px 8px;
	border: 1px solid #dadada;
	border-radius: 6px;
	font-size: 11px;
	background: #fafafa;
	color: #202020;
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })`
	width: 18px;
	height: 18px;
	accent-color: white;
	cursor: pointer;
	border-radius: 5px;
	margin: 0;
`;

// Funkcja do renderowania każdej wartości w osobnej linii
function renderMultiLine(text?: string | number) {
	if (text === undefined || text === null) return null;
	if (typeof text === "number") return <div>{text}</div>;
	return text.split(",").map((item, i) => <div key={i}>{item.trim()}</div>);
}

export const ResidentsInfoListBox: React.FC<ResidentsInfoListBoxProps> = ({
	estateId,
	residents,
	loading,
	error,
	editResident,
	deleteResident,
}) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);
	const [editData, setEditData] = useState<Partial<Resident>>({});
	const [editLoading, setEditLoading] = useState(false);
	const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

	// --- SEARCH / FILTER / SORT STATE ---
	const [searchValue, setSearchValue] = useState("");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
	const [sortValue, setSortValue] = useState<SortValue>("numerical");

	const parseApartmentNumber = (flatNumber: string): number => {
		const match = (flatNumber || "").toString().match(/\d+/);
		return match ? parseInt(match[0], 10) : 0;
	};

	const filteredResidents = useMemo(() => {
		return residents
			.filter(r => {
				// Wyszukiwanie
				const s = searchValue.trim().toLowerCase();
				if (s) {
					const searchFields = [
						r.flatNumber,
						r.name,
						r.email,
						r.phone,
					]
						.filter(Boolean)
						.map(val => String(val).toLowerCase());
					
					if (!searchFields.some(field => field.includes(s))) {
						return false;
					}
				}

				// Filtrowanie
				switch (filterStatus) {
					case "withGarage":
						return r.garage?.trim().toUpperCase() === "TAK";
					case "withoutGarage":
						return r.garage?.trim().toUpperCase() === "NIE";
					case "withStorage":
						return r.storage?.trim().toUpperCase() === "TAK";
					case "withoutStorage":
						return r.storage?.trim().toUpperCase() === "NIE";
					case "withConsent":
						return r.appConsent?.trim().toUpperCase() === "TAK";
					case "withoutConsent":
						return r.appConsent?.trim().toUpperCase() === "NIE";
					default:
						return true;
				}
			})
			.sort((a, b) => {
				switch (sortValue) {
					case "numerical":
						return parseApartmentNumber(a.flatNumber) - parseApartmentNumber(b.flatNumber);
					case "numericalDesc":
						return parseApartmentNumber(b.flatNumber) - parseApartmentNumber(a.flatNumber);
					case "flatNumber":
						return a.flatNumber.localeCompare(b.flatNumber, "pl");
					case "flatNumberDesc":
						return b.flatNumber.localeCompare(a.flatNumber, "pl");
					case "name":
						return (a.name || "").localeCompare(b.name || "", "pl");
					case "nameDesc":
						return (b.name || "").localeCompare(a.name || "", "pl");
					case "area":
						return (a.area || 0) - (b.area || 0);
					case "areaDesc":
						return (b.area || 0) - (a.area || 0);
					default:
						return 0;
				}
			});
	}, [residents, searchValue, filterStatus, sortValue]);

	const handleDelete = async (id: string) => {
		if (!confirm("Na pewno usunąć mieszkańca?")) return;
		setDeleteLoadingId(id);
		await deleteResident(id, estateId);
		setDeleteLoadingId(null);
	};

	const handleEditSave = async () => {
		if (!editId) return;
		setEditLoading(true);
		await editResident(editId, editData, estateId);
		setEditId(null);
		setEditData({});
		setEditLoading(false);
	};

	return (
		<Container>
			<ActionsBar>
				<SearchBarResidents
					onAddClick={() => setModalOpen(true)}
					onSearch={setSearchValue}
					onFilterChange={setFilterStatus}
					onSortChange={setSortValue}
					filterValue={filterStatus}
					sortValue={sortValue}
					placeholder='Wyszukaj mieszkańca po numerze mieszkania, imieniu, nazwisku, email lub telefonie'
				/>
			</ActionsBar>
			<InfoBar>
				<span>
					Filtr:{" "}
					<b>
						{
							{
								all: "Wszyscy",
								withGarage: "Z garażem",
								withoutGarage: "Bez garażu",
								withStorage: "Z komórką",
								withoutStorage: "Bez komórki",
								withConsent: "Z zgodą",
								withoutConsent: "Bez zgody",
							}[filterStatus]
						}
					</b>
				</span>
				<span>
					Sort:{" "}
					<b>
						{
							{
								numerical: "Numer mieszkania 1-999",
								numericalDesc: "Numer mieszkania 999-1",
								flatNumber: "Numer mieszkania A-Z",
								flatNumberDesc: "Numer mieszkania Z-A",
								name: "Imię i nazwisko A-Z",
								nameDesc: "Imię i nazwisko Z-A",
								area: "Metraż rosnąco",
								areaDesc: "Metraż malejąco",
							}[sortValue]
						}
					</b>
				</span>
				{searchValue && (
					<span>
						Szukasz: <b>{searchValue}</b>
					</span>
				)}
			</InfoBar>
			<TableHead>
				<Th>Mieszkanie</Th>
				<Th>Imię i Nazwisko</Th>
				<Th email>Adres e-mail</Th>
				<Th phone>Telefon</Th>
				<Th>Metraż</Th>
				<Th>Garaż</Th>
				<Th>Komórka</Th>
				<Th>Zgoda</Th>
				<Th style={{ minWidth: 180, flex: "none" }} />
			</TableHead>
			<ResidentsList>
				{loading ? (
					<Td>Ładowanie...</Td>
				) : error ? (
					<Td>Błąd: {error}</Td>
				) : filteredResidents.length === 0 ? (
					<Td>
						{searchValue || filterStatus !== "all" 
							? "Brak mieszkańców spełniających kryteria wyszukiwania." 
							: "Brak mieszkańców w tym osiedlu."}
					</Td>
				) : (
					filteredResidents.map(r => (
						<ResidentRow key={r._id}>
							{editId === r._id ? (
								<>
									<Td>
										<EditInput
											value={editData.flatNumber || ""}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													flatNumber: e.target.value,
												}))
											}
										/>
									</Td>
									<Td>
										<EditInput
											value={editData.name || ""}
											onChange={e =>
												setEditData(prev => ({ ...prev, name: e.target.value }))
											}
										/>
									</Td>
									<Td email>
										<EditInput
											value={editData.email || ""}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													email: e.target.value,
												}))
											}
										/>
									</Td>
									<Td phone>
										<EditInput
											value={editData.phone || ""}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													phone: e.target.value,
												}))
											}
										/>
									</Td>
									<Td>
										<EditInput
											value={editData.area?.toString() || ""}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													area: Number(e.target.value),
												}))
											}
										/>
									</Td>
									<Td>
										<CheckBox
											checked={editData.garage?.trim().toUpperCase() === "TAK"}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													garage: e.target.checked ? "TAK" : "NIE",
												}))
											}
										/>
									</Td>
									<Td>
										<CheckBox
											checked={editData.storage?.trim().toUpperCase() === "TAK"}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													storage: e.target.checked ? "TAK" : "NIE",
												}))
											}
										/>
									</Td>
									<Td>
										<CheckBox
											checked={
												editData.appConsent?.trim().toUpperCase() === "TAK"
											}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													appConsent: e.target.checked ? "TAK" : "NIE",
												}))
											}
										/>
									</Td>
									<Actions>
										<EditButton onClick={handleEditSave} disabled={editLoading}>
											Zapisz
										</EditButton>
										<DeleteButton onClick={() => setEditId(null)}>
											Anuluj
										</DeleteButton>
									</Actions>
								</>
							) : (
								<>
									<Td>m.{r.flatNumber}</Td>
									<Td>{renderMultiLine(r.name)}</Td>
									<Td email>{renderMultiLine(r.email)}</Td>
									<Td phone>{renderMultiLine(r.phone)}</Td>
									<Td>
										{r.area !== undefined && r.area !== null
											? renderMultiLine(
													typeof r.area === "number" ? `${r.area} m²` : r.area
											  )
											: null}
									</Td>
									<Td>
										<CheckBox
											checked={r.garage?.trim().toUpperCase() === "TAK"}
											readOnly
											tabIndex={-1}
										/>
									</Td>
									<Td>
										<CheckBox
											checked={r.storage?.trim().toUpperCase() === "TAK"}
											readOnly
											tabIndex={-1}
										/>
									</Td>
									<Td>
										<CheckBox
											checked={r.appConsent?.trim().toUpperCase() === "TAK"}
											readOnly
											tabIndex={-1}
										/>
									</Td>
									<Actions>
										<EditButton
											onClick={() => {
												setEditId(r._id);
												setEditData(r);
											}}>
											Edytuj
										</EditButton>
										<DeleteButton
											onClick={() => handleDelete(r._id)}
											disabled={deleteLoadingId === r._id}>
											{deleteLoadingId === r._id ? "Usuwam..." : "Usuń"}
										</DeleteButton>
									</Actions>
								</>
							)}
						</ResidentRow>
					))
				)}
			</ResidentsList>
			<ResidentsModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				estateId={estateId}
			/>
		</Container>
	);
};

export default ResidentsInfoListBox;
