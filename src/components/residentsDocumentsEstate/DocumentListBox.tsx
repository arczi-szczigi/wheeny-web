// src/components/residentsDocumentsEstate/DocumentListBox.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import { useDocForResidents } from "@/context/DocForResidentsContext";
import AddEstateDocumentModal from "../modal/AddEstateDocumentModal";
import AddResidentDocumentModal from "../modal/AddResidentDocumentModal";
import AddIndividualDocumentModal from "../modal/AddIndividualDocumentModal";
import { useAnnouncement } from "@/context/AnnouncementContext";
import { useToastContext } from "@/components/toast/ToastContext";
import {
	FiPlus,
	FiSearch,
	FiFilter,
	FiChevronDown,
	FiAlignLeft,
} from "react-icons/fi";

// Funkcja pomocnicza do określania ikony na podstawie typu MIME
const getDocumentIcon = (mimetype: string): string => {
	const mimeType = mimetype.toLowerCase();
	
	if (mimeType.includes('pdf')) {
		return '/assets/documentsEstate/pdf.png';
	} else if (mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc')) {
		return '/assets/documentsEstate/word.png';
	} else if (mimeType.includes('doc')) {
		return '/assets/documentsEstate/doc.png';
	} else if (mimeType.includes('excel') || mimeType.includes('xlsx') || mimeType.includes('xls')) {
		return '/assets/documentsEstate/doc.png'; // Możesz dodać ikonę Excel jeśli masz
	} else if (mimeType.includes('powerpoint') || mimeType.includes('pptx') || mimeType.includes('ppt')) {
		return '/assets/documentsEstate/doc.png'; // Możesz dodać ikonę PowerPoint jeśli masz
	} else {
		// Domyślna ikona dla innych typów plików
		return '/assets/documentsEstate/doc.png';
	}
};

// Typy dla wyszukiwarki
export type DocumentFilterStatus = "all" | "pdf" | "word" | "excel" | "other";
export type DocumentSortValue = "name_az" | "name_za" | "date_new" | "date_old" | "size_big" | "size_small";

// ---------- STYLES ----------
const Container = styled.div`
	width: 100%;
	min-height: 100vh;
	background: #f5f5f5;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MainPanel = styled.div`
	width: 1150px;
	margin: 42px auto 0;
	background: #fdfdfd;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	box-shadow: 0 2px 24px rgba(40, 40, 40, 0.067);
	display: flex;
	flex-direction: column;
	padding: 30px 20px;
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
const SubTitle = styled.span`
	color: #9d9d9d;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	margin-top: 2px;
`;

const TabsWrapper = styled.div`
	display: flex;
	gap: 14px;
	margin-top: 26px;
`;
const TabButton = styled.div<{ active?: boolean }>`
	flex: 1;
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

// Nowe style dla wyszukiwarki
const SearchContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 18px;
	margin-top: 22px;
`;

const AddButton = styled.button`
	height: 40px;
	padding: 0 20px;
	background: #ffd100;
	border: none;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 4px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	font-weight: 400;
	letter-spacing: 0.6px;
	cursor: pointer;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const SearchWrapper = styled.div`
	flex: 1 1 0;
	height: 40px;
	padding: 0 20px;
	background: #ffffff;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 4px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const SearchInput = styled.input`
	flex: 1 1 0;
	border: none;
	outline: none;
	font-family: Roboto, sans-serif;
	font-size: 14px;
	color: #202020;
	&::placeholder {
		color: #9d9d9d;
	}
`;

const Dropdown = styled.div`
	position: relative;
	display: inline-block;
`;

const DropButton = styled.button<{ $active?: boolean }>`
	display: flex;
	align-items: center;
	gap: 6px;
	background: #fff;
	border: none;
	border-radius: 30px;
	padding: 8px 20px;
	font-size: 12px;
	color: #202020;
	font-family: Roboto, sans-serif;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	cursor: pointer;
	outline: ${({ $active }) => ($active ? "2px solid #FFD100" : "none")};
	margin-right: 8px;
`;

const DropList = styled.ul`
	position: absolute;
	left: 0;
	top: 110%;
	min-width: 150px;
	background: #fff;
	border-radius: 10px;
	box-shadow: 0 8px 32px rgba(30, 30, 30, 0.16);
	list-style: none;
	padding: 6px 0;
	margin: 0;
	z-index: 10000;
`;

const DropItem = styled.li<{ $selected?: boolean }>`
	padding: 8px 18px;
	font-size: 13px;
	cursor: pointer;
	color: #232323;
	background: ${({ $selected }) => ($selected ? "#f0f0f0" : "transparent")};
	&:hover {
		background: #f0f0f0;
	}
`;

const TableWrapper = styled.div`
	margin-top: 20px;
	width: 100%;
	background: #f3f3f3;
	border-radius: 10px;
	padding: 15px 10px;
`;
const Table = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0;
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
	flex: 1;
	min-width: 100px;
	padding: 0 10px;
	text-align: center;
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
	flex: 1;
	min-width: 100px;
	padding: 0 10px;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #202020;
	letter-spacing: 0.5px;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
	margin-left: 8px;
`;

// Style dla grup dokumentów
const BatchGroup = styled.div`
	border: 2px solid #ffd100;
	border-radius: 8px;
	margin: 10px 0;
	background: #fffbee;
`;

const BatchHeader = styled.div`
	background: #ffd100;
	padding: 8px 15px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	font-weight: 600;
	color: #202020;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const BatchTitle = styled.span`
	font-size: 11px;
`;

const BatchDeleteButton = styled.button`
	background: #e74c3c;
	border: none;
	border-radius: 4px;
	color: white;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	padding: 4px 8px;
	cursor: pointer;
	transition: background 0.2s;

	&:hover {
		background: #c0392b;
	}
`;

const BatchContent = styled.div`
	background: white;
`;

// Opcje filtrowania i sortowania
const FILTER_OPTIONS: { value: DocumentFilterStatus; label: string }[] = [
	{ value: "all", label: "Wszystkie typy" },
	{ value: "pdf", label: "PDF" },
	{ value: "word", label: "Word" },
	{ value: "excel", label: "Excel" },
	{ value: "other", label: "Inne" },
];

const SORT_OPTIONS: { value: DocumentSortValue; label: string }[] = [
	{ value: "name_az", label: "Nazwa A-Z" },
	{ value: "name_za", label: "Nazwa Z-A" },
	{ value: "date_new", label: "Data (najnowsze)" },
	{ value: "date_old", label: "Data (najstarsze)" },
	{ value: "size_big", label: "Rozmiar (największe)" },
	{ value: "size_small", label: "Rozmiar (najmniejsze)" },
];

// ---------- LOGIC ----------
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type Resident = { _id: string; flatNumber: string; name: string };

export default function DocumentListBox() {
	const { estateDocuments, loading, fetchEstateDocuments, deleteDocument, deleteBatch, downloadDocument } =
		useDocForResidents();
	const { selectedEstateId } = useMain();
	const { residents, fetchResidents } = useAnnouncement();
	const { showToast } = useToastContext();

	const [activeTab, setActiveTab] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const [filterStatus, setFilterStatus] = useState<DocumentFilterStatus>("all");
	const [sortAZ, setSortAZ] = useState<DocumentSortValue>("name_az");
	const [showEstateModal, setShowEstateModal] = useState(false);
	const [showResidentModal, setShowResidentModal] = useState(false);
	const [showIndividualModal, setShowIndividualModal] = useState(false);

	// Refs dla dropdownów
	const filterRef = useRef<HTMLDivElement>(null);
	const sortRef = useRef<HTMLDivElement>(null);
	const [showFilter, setShowFilter] = useState(false);
	const [showSort, setShowSort] = useState(false);

	// Funkcja do obsługi pobierania dokumentów
	const handleDownloadDocument = async (id: string, title: string) => {
		try {
			await downloadDocument(id);
			showToast({
				type: "success",
				message: `Pobrano dokument: ${title}`
			});
		} catch (error) {
			showToast({
				type: "error",
				message: "Błąd podczas pobierania dokumentu"
			});
		}
	};

	// Funkcja do obsługi pomyślnego przesłania dokumentów
	const handleUploadSuccess = () => {
		showToast({
			type: "success",
			message: "Dokumenty przesłane"
		});
	};

	// Funkcja grupowania dokumentów po batchId
	const groupDocumentsByBatch = (documents: any[]) => {
		const batches: { [key: string]: any[] } = {};
		const singleDocs: any[] = [];

		documents.forEach(doc => {
			if (doc.batchId) {
				if (!batches[doc.batchId]) {
					batches[doc.batchId] = [];
				}
				batches[doc.batchId].push(doc);
			} else {
				singleDocs.push(doc);
			}
		});

		return { batches, singleDocs };
	};

	// Funkcja do usuwania całej paczki
	const handleDeleteBatch = (batchId: string) => {
		if (!selectedEstateId) return;
		
		showToast({
			type: "confirm",
			message: "Czy na pewno chcesz usunąć całą paczkę dokumentów?",
			onConfirm: async () => {
				try {
					await deleteBatch(batchId);
					fetchEstateDocuments(selectedEstateId);
					showToast({ type: "success", message: "Paczka dokumentów została usunięta." });
				} catch (err: any) {
					showToast({ type: "error", message: err.message || "Błąd usuwania paczki dokumentów." });
				}
			}
		});
	};

	// Funkcja renderowania pojedynczego dokumentu
	const renderDocument = (doc: any) => (
		<TableRow key={doc._id}>
			<Td style={{ maxWidth: 35, cursor: "pointer" }}>
				<div onClick={() => handleDownloadDocument(doc._id, doc.title)}>
					<img
						src={getDocumentIcon(doc.mimetype)}
						width={25}
						height={25}
						alt={doc.mimetype.replace("application/", "").toUpperCase()}
					/>
				</div>
			</Td>
			<Td>
				<div
					onClick={() => handleDownloadDocument(doc._id, doc.title)}
					style={{
						color: "#4D4D4D",
						textDecoration: "underline",
						cursor: "pointer",
					}}>
					{doc.title}
				</div>
			</Td>
			<Td>
				{doc.mimetype.replace("application/", "").toUpperCase()}
			</Td>
			<Td>{doc.originalName}</Td>
			<Td>
				{Math.round((doc.size || 0) / 1024)} KB
			</Td>
			<Td>
				{doc.createdAt
					? new Date(doc.createdAt).toLocaleDateString("pl-PL")
					: ""}
			</Td>
			<Td
				style={{
					display: "flex",
					gap: 10,
					justifyContent: "flex-end",
				}}>
				<EditButton
					style={{ background: "#E8AE9E" }}
					onClick={() => handleDeleteEstateDoc(doc._id)}>
					Usuń
				</EditButton>
			</Td>
		</TableRow>
	);

	// Obsługa kliknięcia poza dropdownem (zamykanie)
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
				setShowFilter(false);
			}
			if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
				setShowSort(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	// ładowanie danych
	useEffect(() => {
		if (!selectedEstateId) return;
		if (activeTab === 0) {
			fetchEstateDocuments(selectedEstateId);
		} else {
			fetchEstateDocuments(selectedEstateId);
			fetchResidents(selectedEstateId);
		}
	}, [activeTab, selectedEstateId]);

	// Funkcja do filtrowania dokumentów
	const filterDocuments = (docs: any[]) => {
		return docs.filter(doc => {
			// Filtrowanie po typie pliku
			if (filterStatus !== "all") {
				const mimeType = doc.mimetype.toLowerCase();
				if (filterStatus === "pdf" && !mimeType.includes('pdf')) return false;
				if (filterStatus === "word" && !mimeType.includes('word') && !mimeType.includes('docx') && !mimeType.includes('doc')) return false;
				if (filterStatus === "excel" && !mimeType.includes('excel') && !mimeType.includes('xlsx') && !mimeType.includes('xls')) return false;
				if (filterStatus === "other" && (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc') || mimeType.includes('excel') || mimeType.includes('xlsx') || mimeType.includes('xls'))) return false;
			}

			// Filtrowanie po wyszukiwaniu
			if (searchValue.trim()) {
				const searchLower = searchValue.toLowerCase();
				return doc.title.toLowerCase().includes(searchLower) ||
					   doc.originalName.toLowerCase().includes(searchLower);
			}

			return true;
		});
	};

	// Funkcja do sortowania dokumentów
	const sortDocuments = (docs: any[]) => {
		return [...docs].sort((a, b) => {
			switch (sortAZ) {
				case "name_az":
					return a.title.localeCompare(b.title);
				case "name_za":
					return b.title.localeCompare(a.title);
				case "date_new":
					return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
				case "date_old":
					return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
				case "size_big":
					return (b.size || 0) - (a.size || 0);
				case "size_small":
					return (a.size || 0) - (b.size || 0);
				default:
					return 0;
			}
		});
	};

	// filtrowanie:
	// - estate docs: brak pola resident
	// - resident docs: posiadają resident (dokumenty zbiorcze - ten sam dokument dla wielu mieszkańców)
	// - individual docs: posiadają resident (dokumenty indywidualne - różne dokumenty dla różnych mieszkańców)
	const filteredEstateDocs = sortDocuments(filterDocuments((estateDocuments || [])
		.filter(doc => !doc.resident)));
	
	// Grupowanie dokumentów osiedlowych po batchId
	const { batches: estateBatches, singleDocs: singleEstateDocs } = groupDocumentsByBatch(filteredEstateDocs);
	
	// Dokumenty zbiorcze - ten sam dokument przypisany do wielu mieszkańców
	const filteredResidentDocs = sortDocuments(filterDocuments((estateDocuments || [])
		.filter(doc => !!doc.resident)));
	
	// Dokumenty indywidualne - różne dokumenty dla różnych mieszkańców
	// (obecnie używamy tego samego filtru co dla dokumentów zbiorczych, 
	// ale w przyszłości możemy dodać logikę rozróżniającą)
	const filteredIndividualDocs = sortDocuments(filterDocuments((estateDocuments || [])
		.filter(doc => !!doc.resident)));

	const handleDeleteEstateDoc = (id: string) => {
		if (!selectedEstateId) return;
		
		showToast({
			type: "confirm",
			message: "Czy na pewno chcesz usunąć ten dokument?",
			onConfirm: async () => {
				try {
					await deleteDocument(id, "estate");
					fetchEstateDocuments(selectedEstateId);
					showToast({ type: "success", message: "Dokument został usunięty." });
				} catch (e: any) {
					showToast({ type: "error", message: e?.message || "Błąd usuwania dokumentu" });
				}
			}
		});
	};
	const handleDeleteResidentDoc = (id: string) => {
		if (!selectedEstateId) return;
		
		showToast({
			type: "confirm",
			message: "Czy na pewno chcesz usunąć ten dokument?",
			onConfirm: async () => {
				try {
					await deleteDocument(id, "estate");
					fetchEstateDocuments(selectedEstateId);
					showToast({ type: "success", message: "Dokument został usunięty." });
				} catch (e: any) {
					showToast({ type: "error", message: e?.message || "Błąd usuwania dokumentu" });
				}
			}
		});
	};

	return (
		<Container>
			<MainPanel>
				<Header>
					<Title>Dokumenty</Title>
					<SubTitle>
						Przegląd dokumentów osiedla lub wysyłaj zbiorczo/indywidualnie.
					</SubTitle>
				</Header>

				<TabsWrapper>
					<TabButton active={activeTab === 0} onClick={() => setActiveTab(0)}>
						<img
							src='/assets/documentsEstate/folder.png'
							width={15}
							height={15}
							alt=''
						/>
						Dokumenty dla osiedla
					</TabButton>
					<TabButton active={activeTab === 1} onClick={() => setActiveTab(1)}>
						<img
							src='/assets/documentsEstate/folder.png'
							width={15}
							height={15}
							alt=''
						/>
						Dokumenty indywidualne
					</TabButton>
					<TabButton active={activeTab === 2} onClick={() => setActiveTab(2)}>
						<img
							src='/assets/documentsEstate/folder.png'
							width={15}
							height={15}
							alt=''
						/>
						Dokumenty zbiorcze
					</TabButton>
				</TabsWrapper>

				<SearchContainer>
					{/* Przycisk dodawania */}
					<AddButton
						onClick={() =>
							activeTab === 0
								? setShowEstateModal(true)
								: activeTab === 1
								? setShowResidentModal(true)
								: setShowIndividualModal(true)
						}>
						<FiPlus size={15} />
						<span>Dodaj dokument</span>
					</AddButton>

					{/* Wyszukiwanie */}
					<SearchWrapper>
						<FiSearch size={15} color='#9d9d9d' />
						<SearchInput
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							placeholder='Wyszukaj dokument'
						/>
					</SearchWrapper>

					{/* Filtrowanie z dropdownem */}
					<Dropdown ref={filterRef}>
						<DropButton
							$active={showFilter}
							type='button'
							onClick={() => setShowFilter(v => !v)}>
							<FiFilter size={18} />
							Filtrowanie:{" "}
							{FILTER_OPTIONS.find(opt => opt.value === filterStatus)?.label}
							<FiChevronDown size={16} />
						</DropButton>
						{showFilter && (
							<DropList>
								{FILTER_OPTIONS.map(opt => (
									<DropItem
										key={opt.value}
										$selected={opt.value === filterStatus}
										onClick={() => {
											setFilterStatus(opt.value);
											setShowFilter(false);
										}}>
										{opt.label}
									</DropItem>
								))}
							</DropList>
						)}
					</Dropdown>

					{/* Sortowanie z dropdownem */}
					<Dropdown ref={sortRef}>
						<DropButton
							$active={showSort}
							type='button'
							onClick={() => setShowSort(v => !v)}>
							<FiAlignLeft size={17} />
							Sortowanie: {SORT_OPTIONS.find(opt => opt.value === sortAZ)?.label}
							<FiChevronDown size={16} />
						</DropButton>
						{showSort && (
							<DropList>
								{SORT_OPTIONS.map(opt => (
									<DropItem
										key={opt.value}
										$selected={opt.value === sortAZ}
										onClick={() => {
											setSortAZ(opt.value);
											setShowSort(false);
										}}>
										{opt.label}
									</DropItem>
								))}
							</DropList>
						)}
					</Dropdown>
				</SearchContainer>

				<TableWrapper>
					{activeTab === 0 ? (
						<Table>
							<TableHeader>
								<Th style={{ maxWidth: 35 }} />
								<Th>Nazwa</Th>
								<Th>Typ</Th>
								<Th>Oryginalna nazwa</Th>
								<Th>Rozmiar</Th>
								<Th>Data</Th>
								<Th style={{ width: 180, flex: "none" }} />
							</TableHeader>
							{loading ? (
								<TableRow>
									<Td style={{ textAlign: "center", width: "100%" }}>
										Ładowanie…
									</Td>
								</TableRow>
							) : filteredEstateDocs.length === 0 ? (
								<TableRow>
									<Td style={{ textAlign: "center", width: "100%" }}>
										Brak dokumentów.
									</Td>
								</TableRow>
							) : (
								<>
									{/* Renderowanie paczek dokumentów */}
									{Object.entries(estateBatches).map(([batchId, docs]) => (
										<React.Fragment key={batchId}>
											<tr>
												<td colSpan={7} style={{ padding: 0, border: 'none' }}>
													<BatchGroup>
														<BatchHeader>
															<BatchTitle>
																Paczka dokumentów ({docs.length} plików) - {new Date(docs[0]?.createdAt).toLocaleDateString("pl-PL")}
															</BatchTitle>
															<BatchDeleteButton onClick={() => handleDeleteBatch(batchId)}>
																Usuń całą paczkę
															</BatchDeleteButton>
														</BatchHeader>
														<BatchContent>
															{docs.map(doc => renderDocument(doc))}
														</BatchContent>
													</BatchGroup>
												</td>
											</tr>
										</React.Fragment>
									))}
									
									{/* Renderowanie pojedynczych dokumentów */}
									{singleEstateDocs.map(doc => renderDocument(doc))}
								</>
							)}
						</Table>
					) : activeTab === 1 ? (
						<Table>
							<TableHeader>
								<Th style={{ maxWidth: 35 }} />
								<Th>Nazwa</Th>
								<Th>Typ</Th>
								<Th>Oryginalna nazwa</Th>
								<Th>Przypisany do</Th>
								<Th>Rozmiar</Th>
								<Th>Data</Th>
								<Th style={{ width: 180, flex: "none" }} />
							</TableHeader>
							{loading ? (
								<TableRow>
									<Td style={{ textAlign: "center", width: "100%" }}>
										Ładowanie…
									</Td>
								</TableRow>
							) : filteredResidentDocs.length === 0 ? (
								<TableRow>
									<Td style={{ textAlign: "center", width: "100%" }}>
										Brak dokumentów.
									</Td>
								</TableRow>
							) : (
								filteredResidentDocs.map(doc => {
									const res = residents.find(r => r._id === doc.resident);
									return (
										<TableRow key={doc._id}>
											<Td style={{ maxWidth: 35, cursor: "pointer" }}>
												<div onClick={() => handleDownloadDocument(doc._id, doc.title)}>
													<img
														src={getDocumentIcon(doc.mimetype)}
														width={25}
														height={25}
														alt={doc.mimetype.replace("application/", "").toUpperCase()}
													/>
												</div>
											</Td>
											<Td>
												<div
													onClick={() => handleDownloadDocument(doc._id, doc.title)}
													style={{
														color: "#4D4D4D",
														textDecoration: "underline",
														cursor: "pointer",
													}}>
													{doc.title}
												</div>
											</Td>
											<Td>
												{doc.mimetype.replace("application/", "").toUpperCase()}
											</Td>
											<Td>{doc.originalName}</Td>
											<Td>{res ? `m.${res.flatNumber} – ${res.name}` : "-"}</Td>
											<Td>
												{Math.round((doc.size || 0) / 1024)} KB
											</Td>
											<Td>
												{doc.createdAt
													? new Date(doc.createdAt).toLocaleDateString("pl-PL")
													: ""}
											</Td>
											<Td
												style={{
													display: "flex",
													gap: 10,
													justifyContent: "flex-end",
												}}>
												<EditButton
													style={{ background: "#E8AE9E" }}
													onClick={() => handleDeleteResidentDoc(doc._id)}>
													Usuń dokument
												</EditButton>
											</Td>
										</TableRow>
									);
								})
							)}
						</Table>
					) : (
						<Table>
							<TableHeader>
								<Th style={{ maxWidth: 35 }} />
								<Th>Nazwa</Th>
								<Th>Typ</Th>
								<Th>Oryginalna nazwa</Th>
								<Th>Przypisany do</Th>
								<Th>Rozmiar</Th>
								<Th>Data</Th>
								<Th style={{ width: 180, flex: "none" }} />
							</TableHeader>
							{loading ? (
								<TableRow>
									<Td style={{ textAlign: "center", width: "100%" }}>
										Ładowanie…
									</Td>
								</TableRow>
							) : filteredIndividualDocs.length === 0 ? (
								<TableRow>
									<Td style={{ textAlign: "center", width: "100%" }}>
										Brak dokumentów indywidualnych.
									</Td>
								</TableRow>
							) : (
								filteredIndividualDocs.map(doc => {
									const res = residents.find(r => r._id === doc.resident);
									return (
										<TableRow key={doc._id}>
											<Td style={{ maxWidth: 35, cursor: "pointer" }}>
												<div onClick={() => handleDownloadDocument(doc._id, doc.title)}>
													<img
														src={getDocumentIcon(doc.mimetype)}
														width={25}
														height={25}
														alt={doc.mimetype.replace("application/", "").toUpperCase()}
													/>
												</div>
											</Td>
											<Td>
												<div
													onClick={() => handleDownloadDocument(doc._id, doc.title)}
													style={{
														color: "#4D4D4D",
														textDecoration: "underline",
														cursor: "pointer",
													}}>
													{doc.title}
												</div>
											</Td>
											<Td>
												{doc.mimetype.replace("application/", "").toUpperCase()}
											</Td>
											<Td>{doc.originalName}</Td>
											<Td>{res ? `m.${res.flatNumber} – ${res.name}` : "-"}</Td>
											<Td>
												{Math.round((doc.size || 0) / 1024)} KB
											</Td>
											<Td>
												{doc.createdAt
													? new Date(doc.createdAt).toLocaleDateString("pl-PL")
													: ""}
											</Td>
											<Td
												style={{
													display: "flex",
													gap: 10,
													justifyContent: "flex-end",
												}}>
												<EditButton
													style={{ background: "#E8AE9E" }}
													onClick={() => handleDeleteResidentDoc(doc._id)}>
													Usuń dokument
												</EditButton>
											</Td>
										</TableRow>
									);
								})
							)}
						</Table>
					)}
				</TableWrapper>

				{/* MODALS */}
				{showEstateModal && selectedEstateId && (
					<AddEstateDocumentModal
						open={showEstateModal}
						onClose={() => {
							setShowEstateModal(false);
							fetchEstateDocuments(selectedEstateId);
						}}
						onSuccess={() => {
							setShowEstateModal(false);
							fetchEstateDocuments(selectedEstateId);
							handleUploadSuccess();
						}}
					/>
				)}
				{showResidentModal && selectedEstateId && (
					<AddResidentDocumentModal
						open={showResidentModal}
						onClose={() => {
							setShowResidentModal(false);
							fetchEstateDocuments(selectedEstateId);
						}}
						onSuccess={() => {
							setShowResidentModal(false);
							fetchEstateDocuments(selectedEstateId);
							handleUploadSuccess();
						}}
						estateId={selectedEstateId}
						residents={residents}
						residentsLoading={false}
						residentsError={null}
					/>
				)}
				{showIndividualModal && selectedEstateId && (
					<AddIndividualDocumentModal
						open={showIndividualModal}
						onClose={() => {
							setShowIndividualModal(false);
							fetchEstateDocuments(selectedEstateId);
						}}
						onSuccess={() => {
							setShowIndividualModal(false);
							fetchEstateDocuments(selectedEstateId);
							handleUploadSuccess();
						}}
						estateId={selectedEstateId}
						residents={residents}
						residentsLoading={false}
						residentsError={null}
					/>
				)}
			</MainPanel>
		</Container>
	);
}
