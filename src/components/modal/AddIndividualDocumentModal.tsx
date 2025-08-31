// AddIndividualDocumentModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDocForResidents } from "@/context/DocForResidentsContext";
import { Resident } from "@/context/AnnouncementContext";
import AddIndividualDocumentAutomationModal from "./AddIndividualDocumentAutomationModal";

// Overlay backdrop
const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.23);
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
`;

// Modal container
const ModalBox = styled.div`
	width: 1100px;
	background: #f3f3f3;
	padding: 40px;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

// Header
const Header = styled.div`
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

const Title = styled.h2`
	font-family: Roboto;
	font-size: 16px;
	font-weight: 500;
	color: #202020;
	letter-spacing: 0.8px;
	margin: 0;
`;

const Step = styled.span`
	margin-left: auto;
	font-family: Roboto;
	font-size: 16px;
	font-weight: 500;
	color: #4d4d4d;
`;

const Subtitle = styled.p`
	font-family: Roboto;
	font-size: 14px;
	font-weight: 300;
	color: #9d9d9d;
	margin: 0;
`;

// Search + list wrapper
const SearchWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 10px;
`;

// Search bar full width
const SearchBar = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 30px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	padding: 0 22px;
	height: 40px;
	width: 100%;
`;

const SearchInput = styled.input`
	flex: 1;
	border: none;
	outline: none;
	font-family: Roboto;
	font-size: 12px;
	color: #202020;
	background: transparent;
`;

const AutomationButton = styled.button`
	background: #202020;
	color: #fff;
	border: none;
	border-radius: 8px;
	padding: 14px 28px;
	font-family: Roboto;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: background 0.2s;
	margin-left: auto;

	&:hover {
		background: #404040;
	}
`;

// Residents list below search
const ResidentsList = styled.div`
	background: #fff;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	max-height: 200px;
	overflow-y: auto;
	margin-bottom: 10px;
`;

const ResidentRow = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 20px;
	border-bottom: 1px solid #f0f0f0;
	cursor: pointer;
	transition: background 0.2s;

	&:hover {
		background: #f8f8f8;
	}

	&:last-child {
		border-bottom: none;
	}
`;

const Checkbox = styled.input`
	width: 16px;
	height: 16px;
	cursor: pointer;
`;

const ResidentName = styled.span`
	font-family: Roboto;
	font-size: 12px;
	color: #202020;
`;

// Upload area
const UploadArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 15px;
	margin-top: 20px;
`;

const FileInputLabel = styled.label`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 15px 20px;
	background: #fff;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	cursor: pointer;
	transition: background 0.2s;

	&:hover {
		background: #f8f8f8;
	}
`;

const FileName = styled.span`
	font-family: Roboto;
	font-size: 12px;
	color: #4d4d4d;
`;

const TitleInput = styled.input`
	padding: 12px 15px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	font-family: Roboto;
	font-size: 12px;
	color: #202020;
	background: #fff;
	outline: none;

	&:focus {
		border-color: #ffd100;
	}
`;

// Table styles
const Table = styled.div`
	background: #fff;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	overflow: hidden;
`;

const TableHeader = styled.div`
	display: flex;
	background: #f8f8f8;
	border-bottom: 1px solid #e0e0e0;
`;

const Th = styled.div<{ flex?: number }>`
	flex: ${({ flex }) => flex || 1};
	padding: 12px 15px;
	font-family: Roboto;
	font-size: 11px;
	font-weight: 600;
	color: #4d4d4d;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const TableRow = styled.div`
	display: flex;
	border-bottom: 1px solid #f0f0f0;

	&:last-child {
		border-bottom: none;
	}
`;

const Td = styled.div<{ flex?: number }>`
	flex: ${({ flex }) => flex || 1};
	padding: 12px 15px;
	font-family: Roboto;
	font-size: 12px;
	color: #202020;
	display: flex;
	align-items: center;
`;

const RemoveBtn = styled.button`
	width: 24px;
	height: 24px;
	border: none;
	background: #e8ae9e;
	color: #fff;
	border-radius: 50%;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.2s;

	&:hover {
		background: #d89a8a;
	}
`;

// Footer
const Footer = styled.div`
	display: flex;
	gap: 15px;
	justify-content: flex-end;
	margin-top: 20px;
`;

const Button = styled.button<{ variant: "cancel" | "confirm" }>`
	padding: 12px 24px;
	border: none;
	border-radius: 8px;
	font-family: Roboto;
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;

	background: ${({ variant }) =>
		variant === "cancel" ? "#f0f0f0" : "#ffd100"};
	color: ${({ variant }) => (variant === "cancel" ? "#4d4d4d" : "#202020")};

	&:hover {
		background: ${({ variant }) =>
			variant === "cancel" ? "#e0e0e0" : "#e6c200"};
	}
`;

// Error message
const ErrorMessage = styled.div`
	color: #e74c3c;
	font-family: Roboto;
	font-size: 12px;
	text-align: center;
	padding: 10px;
	background: #fdf2f2;
	border-radius: 8px;
	border: 1px solid #fecaca;
`;

interface Props {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
	estateId: string | null;
	residents: Resident[];
	residentsLoading: boolean;
	residentsError: string | null;
}

export default function AddIndividualDocumentModal({
	open,
	onClose,
	onSuccess,
	estateId,
	residents,
	residentsLoading,
	residentsError,
}: Props) {
	const { uploadDocument } = useDocForResidents();
	const [search, setSearch] = useState("");
	const [selectedResident, setSelectedResident] = useState<string | null>(null);
	const [documents, setDocuments] = useState<Array<{ title: string; file: File | null }>>([{ title: "", file: null }]);
	const [error, setError] = useState<string | null>(null);
	const [showAutomationModal, setShowAutomationModal] = useState(false);

	// Filtruj mieszkańców na podstawie wyszukiwania
	const filtered = residents.filter(r =>
		`m.${r.flatNumber} - ${r.name}`
			.toLowerCase()
			.includes(search.toLowerCase())
	);

	const handleResidentSelect = (residentId: string) => {
		setSelectedResident(residentId);
	};

	const addDocument = () => {
		setDocuments(prev => [...prev, { title: "", file: null }]);
	};

	const removeDocument = (index: number) => {
		setDocuments(prev => prev.filter((_, i) => i !== index));
	};

	const updateDocument = (index: number, field: "title" | "file", value: string | File | null) => {
		setDocuments(prev =>
			prev.map((doc, i) =>
				i === index ? { ...doc, [field]: value } : doc
			)
		);
	};

	const onFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			updateDocument(index, "file", e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!selectedResident) {
			setError("Wybierz mieszkańca!");
			return;
		}

		const validDocuments = documents.filter(doc => doc.title && doc.file);
		if (validDocuments.length === 0) {
			setError("Dodaj przynajmniej jeden dokument!");
			return;
		}

		setError(null);
		try {
			for (const doc of validDocuments) {
				if (doc.file && doc.title) {
					await uploadDocument({
						file: doc.file,
						estateId: estateId!,
						title: doc.title,
						residentId: selectedResident,
					});
				}
			}
			onSuccess?.();
			onClose();
		} catch (e: any) {
			setError(e.message);
		}
	};

	if (!open) return null;

	// Po otwarciu modala (dodawanie zbiorcze po zamianie nazw) od razu pokaż automatyzację
	useEffect(() => {
		if (open) {
			setShowAutomationModal(true);
		}
	}, [open]);

	return (
		<Overlay>
			<ModalBox>
				<Header>
					<IconCircle>
						<img src='/assets/documentsEstate/folder.png' alt='folder' />
					</IconCircle>
					<Title>Dodaj dokumenty zbiorcze</Title>
					<AutomationButton
						type="button"
						onClick={() => setShowAutomationModal(true)}
					>
						Użyj automatyzacji
					</AutomationButton>
				</Header>
				<Subtitle>
					Wybierz mieszkańca i dodaj dla niego dokumenty zbiorczo.
				</Subtitle>
				<form onSubmit={handleSubmit}>
					<SearchWrapper>
						<SearchBar>
							<img src='/assets/documentsEstate/search.png' alt='search' />
							<SearchInput
								placeholder='Wyszukaj mieszkańca'
								value={search}
								onChange={e => setSearch(e.target.value)}
							/>
						</SearchBar>
						<ResidentsList>
							{residentsLoading ? (
								<div>Ładowanie mieszkańców...</div>
							) : residentsError ? (
								<div style={{ color: "crimson" }}>
									Błąd pobierania mieszkańców!
								</div>
							) : filtered.length === 0 ? (
								<div style={{ color: "#dadada" }}>Brak mieszkańców...</div>
							) : (
								filtered.map(r => (
									<ResidentRow 
										key={r._id}
										onClick={() => handleResidentSelect(r._id)}
										style={{
											background: selectedResident === r._id ? "#f0f8ff" : "transparent"
										}}
									>
										<Checkbox
											type='radio'
											name='resident'
											checked={selectedResident === r._id}
											onChange={() => handleResidentSelect(r._id)}
										/>
										<ResidentName>
											m.{r.flatNumber} - {r.name}
										</ResidentName>
									</ResidentRow>
								))
							)}
						</ResidentsList>
					</SearchWrapper>

					{selectedResident && (
						<>
							<UploadArea>
								{documents.map((doc, index) => (
									<div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
										<FileInputLabel>
											<img src='/assets/documentsEstate/folder.png' alt='upload' />
											<FileName>{doc.file?.name || "Wybierz plik"}</FileName>
											<input 
												type='file' 
												hidden 
												onChange={(e) => onFileChange(index, e)} 
											/>
										</FileInputLabel>
										<TitleInput
											placeholder='Tytuł dokumentu'
											value={doc.title}
											onChange={e => updateDocument(index, "title", e.target.value)}
										/>
										{documents.length > 1 && (
											<RemoveBtn 
												type="button"
												onClick={() => removeDocument(index)}
											>
												×
											</RemoveBtn>
										)}
									</div>
								))}
								<Button 
									type="button" 
									variant="cancel"
									onClick={addDocument}
									style={{ alignSelf: "flex-start" }}
								>
									+ Dodaj kolejny dokument
								</Button>
							</UploadArea>

							<Table>
								<TableHeader>
									<Th flex={2}>Nazwa dokumentu</Th>
									<Th>Przypisany do</Th>
									<Th flex={0}>Akcje</Th>
								</TableHeader>
								{documents.map((doc, index) => {
									const r = residents.find(r => r._id === selectedResident);
									return (
										<TableRow key={index}>
											<Td flex={2}>{doc.title || "Brak tytułu"}</Td>
											<Td>
												m.{r?.flatNumber} – {r?.name}
											</Td>
											<Td flex={0}>
												<RemoveBtn 
													type="button"
													onClick={() => removeDocument(index)}
												>
													×
												</RemoveBtn>
											</Td>
										</TableRow>
									);
								})}
							</Table>
						</>
					)}

					{error && <ErrorMessage>{error}</ErrorMessage>}

					<Footer>
						<Button type='button' variant='cancel' onClick={onClose}>
							Anuluj
						</Button>
						<Button type='submit' variant='confirm'>
							Potwierdź i wyślij
						</Button>
					</Footer>
				</form>
			</ModalBox>
			
			{/* Modal automatyzacji */}
			<AddIndividualDocumentAutomationModal
				open={showAutomationModal}
				onClose={() => setShowAutomationModal(false)}
				onSuccess={() => {
					setShowAutomationModal(false);
					onSuccess?.();
				}}
				estateId={estateId}
				residents={residents}
				residentsLoading={residentsLoading}
				residentsError={residentsError}
			/>
		</Overlay>
	);
} 