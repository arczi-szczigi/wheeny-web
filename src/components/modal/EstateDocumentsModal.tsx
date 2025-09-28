"use client";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import { useToastContext } from "@/components/toast/ToastContext";
import {
	FiPlus,
	FiSearch,
	FiFilter,
	FiChevronDown,
	FiAlignLeft,
	FiX,
} from "react-icons/fi";

// ---------- TYPES ----------
type Document = {
	_id: string;
	title: string;
	filename: string;
	originalName: string;
	mimetype: string;
	size: number;
	estate: string;
	resident?: string;
	createdAt: string;
	batchId?: string;
};

type DocumentFilterStatus = "all" | "pdf" | "word" | "excel" | "other";
type DocumentSortValue = "name_az" | "name_za" | "date_new" | "date_old" | "size_big" | "size_small";

// ---------- STYLES ----------
const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.23);
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Modal = styled.div`
	width: 90vw;
	max-width: 1200px;
	height: 85vh;
	background: #fdfdfd;
	border-radius: 20px;
	box-shadow: 0 2px 24px rgba(40, 40, 40, 0.067);
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30px 30px 20px 30px;
	border-bottom: 1px solid #eee;
`;

const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 15px;
`;

const IconCircle = styled.div`
	width: 40px;
	height: 40px;
	background: #ffd100;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ModalTitle = styled.div`
	color: #202020;
	font-size: 24px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	letter-spacing: 1.2px;
`;

const CloseButton = styled.button`
	background: none;
	border: none;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #9d9d9d;
	transition: all 0.2s;
	
	&:hover {
		background: #f5f5f5;
		color: #202020;
	}
`;

const ModalContent = styled.div`
	flex: 1;
	padding: 20px 30px 30px 30px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const SearchContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 18px;
`;

const AddButton = styled.button`
	height: 40px;
	padding: 0 20px;
	background: white;
	border: 1px solid #202020;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 4px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	font-weight: 400;
	letter-spacing: 0.6px;
	color: #202020;
	cursor: pointer;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	transition: all 0.18s;
	
	&:hover {
		background: #f5f5f5;
	}
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
	flex: 1;
	background: #f3f3f3;
	border-radius: 10px;
	padding: 15px 10px;
	overflow-y: auto;
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

const TableRow = styled.div`
	display: flex;
	align-items: center;
	min-height: 44px;
	border-bottom: 0.5px solid #dadada;
	background: #fff;
	border-radius: 10px;
	padding: 0 8px;
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

const ActionButton = styled.button<{ variant?: 'download' | 'delete' }>`
	background: ${({ variant }) => variant === 'delete' ? 'white' : '#202020'};
	border: ${({ variant }) => variant === 'delete' ? '1px solid #202020' : 'none'};
	border-radius: 30px;
	color: ${({ variant }) => variant === 'delete' ? '#202020' : '#ffffff'};
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	padding: 9px 16px;
	cursor: pointer;
	white-space: nowrap;
	margin-left: 4px;
	transition: all 0.2s;
	
	&:hover {
		opacity: 0.8;
	}
`;

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

const LoadingMessage = styled.div`
	text-align: center;
	padding: 40px;
	color: #9d9d9d;
	font-family: Roboto, sans-serif;
	font-size: 14px;
`;

const EmptyMessage = styled.div`
	text-align: center;
	padding: 40px;
	color: #9d9d9d;
	font-family: Roboto, sans-serif;
	font-size: 14px;
`;

const FileInputLabel = styled.label`
	width: 100%;
	background: #fff;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 18px;
	cursor: pointer;
	transition: border 0.2s;
	margin-bottom: 10px;
`;

const FileName = styled.span`
	font-size: 12px;
	color: #202020;
`;

const Label = styled.label`
	color: #4d4d4d;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
	margin-bottom: 5px;
	display: block;
`;

const Input = styled.input`
	width: 100%;
	height: 40px;
	background: #fff;
	border-radius: 10px;
	border: none;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	padding: 0 18px;
	color: #202020;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
	margin-bottom: 15px;
	&::placeholder {
		color: #dadada;
		font-size: 10px;
	}
`;

const UploadSection = styled.div`
	padding: 20px;
	background: #f9f9f9;
	border-radius: 10px;
	margin-bottom: 20px;
`;

const UploadTitle = styled.div`
	color: #202020;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	margin-bottom: 15px;
`;

const UploadButton = styled.button`
	background: white;
	color: #202020;
	border: 1px solid #202020;
	border-radius: 30px;
	padding: 10px 20px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
	
	&:hover {
		background: #f5f5f5;
	}
	
	&:disabled {
		background: #cccccc;
		border-color: #cccccc;
		color: #666666;
		cursor: not-allowed;
	}
`;

// ---------- HELPER FUNCTIONS ----------
const getDocumentIcon = (mimetype: string): string => {
	const mimeType = mimetype.toLowerCase();
	
	if (mimeType.includes('pdf')) {
		return '/assets/documentsEstate/pdf.png';
	} else if (mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc')) {
		return '/assets/documentsEstate/word.png';
	} else if (mimeType.includes('doc')) {
		return '/assets/documentsEstate/doc.png';
	} else if (mimeType.includes('excel') || mimeType.includes('xlsx') || mimeType.includes('xls')) {
		return '/assets/documentsEstate/doc.png';
	} else if (mimeType.includes('powerpoint') || mimeType.includes('pptx') || mimeType.includes('ppt')) {
		return '/assets/documentsEstate/doc.png';
	} else {
		return '/assets/documentsEstate/doc.png';
	}
};

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

// ---------- COMPONENT ----------
interface EstateDocumentsModalProps {
	open: boolean;
	onClose: () => void;
	estateId: string;
}

export default function EstateDocumentsModal({ open, onClose, estateId }: EstateDocumentsModalProps) {
	const { showToast } = useToastContext();
	
	// State
	const [documents, setDocuments] = useState<Document[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [filterStatus, setFilterStatus] = useState<DocumentFilterStatus>("all");
	const [sortValue, setSortValue] = useState<DocumentSortValue>("name_az");
	const [showUpload, setShowUpload] = useState(false);
	const [uploadTitle, setUploadTitle] = useState("");
	const [uploadFile, setUploadFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	// Refs for dropdowns
	const filterRef = useRef<HTMLDivElement>(null);
	const sortRef = useRef<HTMLDivElement>(null);
	const [showFilter, setShowFilter] = useState(false);
	const [showSort, setShowSort] = useState(false);

	// Cleanup missing files
	const cleanupMissingFiles = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/documents/cleanup`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			
			if (!response.ok) throw new Error("Błąd czyszczenia dokumentów");
			
			const data = await response.json();
			if (data.deletedIds && data.deletedIds.length > 0) {
				showToast({
					type: "success",
					message: `Usunięto ${data.deletedIds.length} nieistniejących rekordów`,
				});
				await fetchDocuments();
			}
		} catch (error: any) {
			console.error('Cleanup error:', error);
		}
	};

	// Fetch documents
	const fetchDocuments = async () => {
		if (!estateId) return;
		
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/documents/estate/${estateId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			
			if (!response.ok) throw new Error("Błąd pobierania dokumentów");
			
			const data = await response.json();
			setDocuments(data);
		} catch (error: any) {
			showToast({
				type: "error",
				message: error.message || "Błąd pobierania dokumentów",
			});
		} finally {
			setLoading(false);
		}
	};

	// Download document
	const handleDownload = async (documentId: string, title: string) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/download`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				if (response.status === 404) {
					// Plik nie istnieje, odśwież listę dokumentów
					await fetchDocuments();
					throw new Error(errorData.message || "Plik nie istnieje i został usunięty z listy");
				}
				throw new Error(errorData.message || "Błąd pobierania dokumentu");
			}
			
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = title;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			
			showToast({
				type: "success",
				message: `Pobrano dokument: ${title}`,
			});
		} catch (error: any) {
			console.error('Download error:', error);
			showToast({
				type: "error",
				message: error.message || "Błąd pobierania dokumentu",
			});
		}
	};

	// Delete document
	const handleDelete = async (documentId: string) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Błąd usuwania dokumentu");
			}
			
			await fetchDocuments();
			showToast({
				type: "success",
				message: "Dokument został usunięty",
			});
		} catch (error: any) {
			console.error('Delete error:', error);
			showToast({
				type: "error",
				message: error.message || "Błąd usuwania dokumentu",
			});
		}
	};

	// Delete batch
	const handleDeleteBatch = async (batchId: string) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/documents/batch/${batchId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			
			if (!response.ok) throw new Error("Błąd usuwania paczki dokumentów");
			
			await fetchDocuments();
			showToast({
				type: "success",
				message: "Paczka dokumentów została usunięta",
			});
		} catch (error: any) {
			showToast({
				type: "error",
				message: error.message || "Błąd usuwania paczki dokumentów",
			});
		}
	};

	// Upload document
	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!uploadTitle.trim()) {
			showToast({
				type: "error",
				message: "Wprowadź nazwę dokumentu!",
			});
			return;
		}
		if (!uploadFile) {
			showToast({
				type: "error",
				message: "Wybierz plik dokumentu!",
			});
			return;
		}
		if (!estateId) {
			showToast({
				type: "error",
				message: "Brak identyfikatora osiedla!",
			});
			return;
		}

		setUploading(true);
		try {
			const token = localStorage.getItem("token");
			const formData = new FormData();
			formData.append("file", uploadFile);
			formData.append("estateId", estateId);
			formData.append("title", uploadTitle.trim());

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
				{
					method: "POST",
					headers: { Authorization: `Bearer ${token}` },
					body: formData,
				}
			);
			
			if (!response.ok) throw new Error("Błąd wysyłki dokumentu");

			setUploadTitle("");
			setUploadFile(null);
			setShowUpload(false);
			await fetchDocuments();
			showToast({ type: "success", message: "Dokument dodany." });
		} catch (error: any) {
			showToast({
				type: "error",
				message: error.message || "Błąd przesyłania dokumentu",
			});
		} finally {
			setUploading(false);
		}
	};

	// Filter and sort documents
	const filterDocuments = (docs: Document[]) => {
		return docs.filter(doc => {
			// Filter by file type
			if (filterStatus !== "all") {
				const mimeType = doc.mimetype.toLowerCase();
				if (filterStatus === "pdf" && !mimeType.includes('pdf')) return false;
				if (filterStatus === "word" && !mimeType.includes('word') && !mimeType.includes('docx') && !mimeType.includes('doc')) return false;
				if (filterStatus === "excel" && !mimeType.includes('excel') && !mimeType.includes('xlsx') && !mimeType.includes('xls')) return false;
				if (filterStatus === "other" && (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc') || mimeType.includes('excel') || mimeType.includes('xlsx') || mimeType.includes('xls'))) return false;
			}

			// Filter by search
			if (searchValue.trim()) {
				const searchLower = searchValue.toLowerCase();
				return doc.title.toLowerCase().includes(searchLower) ||
					   doc.originalName.toLowerCase().includes(searchLower);
			}

			return true;
		});
	};

	const sortDocuments = (docs: Document[]) => {
		return [...docs].sort((a, b) => {
			switch (sortValue) {
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

	// Group documents by batch
	const groupDocumentsByBatch = (docs: Document[]) => {
		const batches: { [key: string]: Document[] } = {};
		const singleDocs: Document[] = [];

		docs.forEach(doc => {
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

	// Render document row
	const renderDocument = (doc: Document) => (
		<TableRow key={doc._id}>
			<Td style={{ maxWidth: 35, cursor: "pointer" }}>
				<div onClick={() => handleDownload(doc._id, doc.title)}>
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
					onClick={() => handleDownload(doc._id, doc.title)}
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
				{doc.resident ? "Przypisany do mieszkańca" : "Dokument osiedla"}
			</Td>
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
					gap: 4,
					justifyContent: "flex-end",
				}}>
				<ActionButton
					variant="download"
					onClick={() => handleDownload(doc._id, doc.title)}>
					Pobierz
				</ActionButton>
				<ActionButton
					variant="delete"
					onClick={() => handleDelete(doc._id)}>
					Usuń
				</ActionButton>
			</Td>
		</TableRow>
	);

	// Handle clicks outside dropdowns
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

	// Fetch documents when modal opens
	useEffect(() => {
		if (open && estateId) {
			fetchDocuments();
		}
	}, [open, estateId]);

	if (!open) return null;

	const filteredDocs = sortDocuments(filterDocuments(documents));
	const { batches, singleDocs } = groupDocumentsByBatch(filteredDocs);

	return (
		<Overlay>
			<Modal>
				<ModalHeader>
					<HeaderLeft>
						<IconCircle>
							<img
								src='/assets/documentsEstate/folder.png'
								width={22}
								height={22}
								alt='folder'
							/>
						</IconCircle>
						<ModalTitle>Dokumenty Osiedla</ModalTitle>
					</HeaderLeft>
					<CloseButton onClick={onClose}>
						<FiX size={20} />
					</CloseButton>
				</ModalHeader>

				<ModalContent>
					{showUpload && (
						<UploadSection>
							<UploadTitle>Dodaj nowy dokument</UploadTitle>
							<form onSubmit={handleUpload}>
								<Label>Nazwa dokumentu</Label>
								<Input
									type="text"
									placeholder="Wpisz nazwę dokumentu"
									value={uploadTitle}
									onChange={(e) => setUploadTitle(e.target.value)}
								/>
								
								<Label>Wybierz plik</Label>
								<FileInputLabel>
									<input
										type="file"
										style={{ display: "none" }}
										onChange={(e) => {
											if (e.target.files && e.target.files.length > 0) {
												setUploadFile(e.target.files[0]);
											}
										}}
									/>
									<span style={{ color: uploadFile ? "#202020" : "#dadada", fontSize: 12 }}>
										{uploadFile ? (
											<FileName>{uploadFile.name}</FileName>
										) : (
											"Prześlij dokument"
										)}
									</span>
								</FileInputLabel>
								
								<div style={{ display: 'flex', gap: '10px' }}>
									<UploadButton type="submit" disabled={uploading}>
										{uploading ? "Przesyłanie..." : "Dodaj dokument"}
									</UploadButton>
									<UploadButton 
										type="button" 
										style={{ background: '#cccccc', color: '#202020' }}
										onClick={() => {
											setShowUpload(false);
											setUploadTitle("");
											setUploadFile(null);
										}}>
										Anuluj
									</UploadButton>
								</div>
							</form>
						</UploadSection>
					)}

					<SearchContainer>
						<AddButton onClick={() => setShowUpload(!showUpload)}>
							<FiPlus size={15} />
							<span>Dodaj dokument</span>
						</AddButton>
						
						<AddButton 
							onClick={cleanupMissingFiles}
							style={{ background: '#e74c3c', color: 'white', border: 'none' }}>
							<span>Wyczyść nieistniejące</span>
						</AddButton>

						<SearchWrapper>
							<FiSearch size={15} color='#9d9d9d' />
							<SearchInput
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								placeholder='Wyszukaj dokument'
							/>
						</SearchWrapper>

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

						<Dropdown ref={sortRef}>
							<DropButton
								$active={showSort}
								type='button'
								onClick={() => setShowSort(v => !v)}>
								<FiAlignLeft size={17} />
								Sortowanie: {SORT_OPTIONS.find(opt => opt.value === sortValue)?.label}
								<FiChevronDown size={16} />
							</DropButton>
							{showSort && (
								<DropList>
									{SORT_OPTIONS.map(opt => (
										<DropItem
											key={opt.value}
											$selected={opt.value === sortValue}
											onClick={() => {
												setSortValue(opt.value);
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
						<Table>
							<TableHeader>
								<Th style={{ maxWidth: 35 }} />
								<Th>Nazwa</Th>
								<Th>Typ</Th>
								<Th>Oryginalna nazwa</Th>
								<Th>Przypisany do</Th>
								<Th>Rozmiar</Th>
								<Th>Data</Th>
								<Th style={{ width: 200, flex: "none" }} />
							</TableHeader>
							{loading ? (
								<LoadingMessage>Ładowanie dokumentów...</LoadingMessage>
							) : filteredDocs.length === 0 ? (
								<EmptyMessage>Brak dokumentów.</EmptyMessage>
							) : (
								<>
									{/* Render batches */}
									{Object.entries(batches).map(([batchId, docs]) => (
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
									
									{/* Render single documents */}
									{singleDocs.map(doc => renderDocument(doc))}
								</>
							)}
						</Table>
					</TableWrapper>
				</ModalContent>
			</Modal>
		</Overlay>
	);
}
