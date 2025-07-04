// ResidentsInfoListBox.tsx
"use client";

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FiPlus, FiSearch, FiChevronDown } from "react-icons/fi";
import ResidentsModal from "@/components/modal/ResidentsModal";
import { Resident } from "@/context/AnnouncementContext";

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
	white-space: ${({ email }) => (email ? "normal" : "nowrap")};
	overflow: hidden;
	text-overflow: ellipsis;
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

export const ResidentsInfoListBox: React.FC<ResidentsInfoListBoxProps> = ({
	estateId,
	residents,
	loading,
	error,
	editResident,
	deleteResident,
}) => {
	const [search, setSearch] = useState<string>("");
	const [modalOpen, setModalOpen] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);
	const [editData, setEditData] = useState<Partial<Resident>>({});
	const [editLoading, setEditLoading] = useState(false);
	const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

	const filteredResidents = useMemo(() => {
		if (!search.trim()) return residents;
		const lower = search.toLowerCase();
		return residents.filter(
			r =>
				`${r.flatNumber}`.toLowerCase().includes(lower) ||
				(r.name ?? "").toLowerCase().includes(lower) ||
				(r.email ?? "").toLowerCase().includes(lower) ||
				(r.phone ?? "").toLowerCase().includes(lower)
		);
	}, [residents, search]);

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
				<AddOwnerButton onClick={() => setModalOpen(true)}>
					<FiPlus size={16} /> Dodaj właściciela/i
				</AddOwnerButton>
				<SearchInputWrap>
					<FiSearch size={16} color='#9d9d9d' />
					<SearchInput
						placeholder='Wyszukaj właściciela'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</SearchInputWrap>
				<CircleBox>
					Filtrowanie <FiChevronDown size={16} />
				</CircleBox>
				<CircleBox>
					Sortowanie <FiChevronDown size={16} />
				</CircleBox>
			</ActionsBar>
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
					<Td>Brak wyników.</Td>
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
										<EditInput
											value={editData.garage || ""}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													garage: e.target.value,
												}))
											}
										/>
									</Td>
									<Td>
										<EditInput
											value={editData.storage || ""}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													storage: e.target.value,
												}))
											}
										/>
									</Td>
									<Td>
										<EditInput
											value={editData.appConsent || ""}
											onChange={e =>
												setEditData(prev => ({
													...prev,
													appConsent: e.target.value,
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
									<Td>{r.name}</Td>
									<Td email>{r.email}</Td>
									<Td phone>{r.phone}</Td>
									<Td>
										{r.area}
										{typeof r.area === "number" ? " m²" : ""}
									</Td>
									<Td>{r.garage}</Td>
									<Td>{r.storage}</Td>
									<Td>{r.appConsent}</Td>
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
