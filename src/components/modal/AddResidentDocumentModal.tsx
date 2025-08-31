// AddResidentDocumentModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDocForResidents } from "@/context/DocForResidentsContext";
import { Resident } from "@/context/AnnouncementContext";
import { useToastContext } from "@/components/toast/ToastContext";

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

// Residents list below search
const ResidentsList = styled.div`
	background: #fff;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	max-height: 200px;
	overflow-y: auto;
`;
const ResidentRow = styled.label`
	display: flex;
	align-items: center;
	padding: 8px 16px;
	border-bottom: 1px solid #ededed;
	cursor: pointer;
	&:last-child {
		border-bottom: none;
	}
`;
const Checkbox = styled.input`
	margin-right: 15px;
`;
const ResidentName = styled.span`
	font-family: Roboto;
	font-size: 12px;
	font-weight: 500;
	color: #202020;
`;

// Upload area and title input styled same, with margin-top
const UploadArea = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-top: 16px; /* separate from list */
`;
const FileInputLabel = styled.label`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 18px;
	background: #fff;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	cursor: pointer;
`;
const FileName = styled.span`
	font-family: Roboto;
	font-size: 12px;
	color: #202020;
`;
// Title input shares style
const TitleInput = styled.input`
	flex: 1;
	height: 40px;
	padding: 0 16px;
	background: #fff;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border: none;
	outline: none;
	font-family: Roboto;
	font-size: 12px;
	color: #202020;
`;

// Selected table
const Table = styled.div`
	margin-top: 10px;
`;
const TableHeader = styled.div`
	display: flex;
	background: #ebebeb;
	padding: 8px 16px;
	border-radius: 8px;
`;
const Th = styled.div<{ flex?: number }>`
	flex: ${props => props.flex ?? 1};
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: Roboto;
	font-size: 10px;
	font-weight: 500;
	color: #9d9d9d;
`;

const TableRow = styled.div`
	display: flex;
	align-items: center;
	padding: 8px 16px;
	border-bottom: 1px solid #ededed;
`;
const Td = styled.div<{ flex?: number }>`
	flex: ${props => props.flex ?? 1};
	display: flex;
	align-items: center;
	justify-content: center; /* center content under headers */
	font-family: Roboto;
	font-size: 12px;
	color: #202020;
`;

// Remove button larger
const RemoveBtn = styled.button`
	background: transparent;
	border: none;
	color: #ff3b30; /* saturated red */
	font-size: 24px; /* larger */
	font-weight: bold;
	line-height: 1;
	cursor: pointer;
	padding: 4px; /* clickable area */
	display: flex;
	align-items: center;
	justify-content: center;
`;

// Footer
const Footer = styled.div`
	display: flex;
	gap: 35px;
	margin-top: 20px;
`;
const Button = styled.button<{ variant?: "cancel" | "confirm" }>`
	flex: 1;
	height: 40px;
	border: none;
	border-radius: 30px;
	font-family: Roboto;
	font-size: 10px;
	font-weight: 600;
	letter-spacing: 0.5px;
	cursor: pointer;
	background: ${p => (p.variant === "confirm" ? "#ffd100" : "#d9d9d9")};
	color: #202020;
`;

// Component
interface Props {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
	estateId: string | null;
	residents: Resident[];
	residentsLoading: boolean;
	residentsError: string | null;
}
export default function AddResidentDocumentModal({
	open,
	onClose,
	onSuccess,
	estateId,
	residents,
	residentsLoading,
	residentsError,
}: Props) {
	const {
		uploadDocument,
		loading: uploading,
		error: uploadError,
	} = useDocForResidents();
	const { showToast } = useToastContext();
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<string[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [title, setTitle] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => console.log("Modal residents:", residents), [residents]);
	if (!open) return null;

	const filtered = residents.filter(r =>
		`${r.flatNumber} ${r.name}`.toLowerCase().includes(search.toLowerCase())
	);

	const toggle = (id: string) =>
		setSelected(prev =>
			prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
		);
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) setFile(e.target.files[0]);
	};
	const handleRemove = (id: string) =>
		setSelected(prev => prev.filter(i => i !== id));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !file || !estateId || selected.length === 0) {
			setError("Wypełnij wszystkie pola i wybierz mieszkańców!");
			return;
		}
		setError(null);
		try {
			for (const id of selected)
				await uploadDocument({ file, estateId, title, residentId: id });
			onSuccess?.();
			onClose();
			showToast({ type: "success", message: "Dokument dodany." });
		} catch (e: any) {
			setError(e.message);
			showToast({ type: "error", message: e?.message || "Błąd przesyłania dokumentu" });
		}
	};

	return (
		<Overlay>
			<ModalBox>
				<Header>
					<IconCircle>
						<img src='/assets/documentsEstate/folder.png' alt='folder' />
					</IconCircle>
					<Title>Dodaj dokument - indywidualnie</Title>
					<Step>1/1</Step>
				</Header>
				<Subtitle>
					Dodaj indywidualnie dokumenty dla wielu mieszkańców.
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
									<ResidentRow key={r._id}>
										<Checkbox
											type='checkbox'
											checked={selected.includes(r._id)}
											onChange={() => toggle(r._id)}
										/>
										<ResidentName>
											m.{r.flatNumber} - {r.name}
										</ResidentName>
									</ResidentRow>
								))
							)}
						</ResidentsList>
					</SearchWrapper>

					<UploadArea>
						<FileInputLabel>
							<img src='/assets/documentsEstate/folder.png' alt='upload' />
							<FileName>{file?.name || "Wybierz plik"}</FileName>
							<input type='file' hidden onChange={onFileChange} />
						</FileInputLabel>
						<TitleInput
							placeholder='Tytuł dokumentu'
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>
					</UploadArea>

					<Table>
						<TableHeader>
							<Th flex={2}>Nazwa dokumentu</Th>
							<Th>Przypisany do</Th>
							<Th flex={0}>Akcje</Th>
						</TableHeader>
						{selected.map(id => {
							const r = residents.find(r => r._id === id);
							return (
								<TableRow key={id}>
									<Td flex={2}>{title}</Td>
									<Td>
										m.{r?.flatNumber} – {r?.name}
									</Td>
									<Td flex={0}>
										<RemoveBtn onClick={() => handleRemove(id)}>×</RemoveBtn>
									</Td>
								</TableRow>
							);
						})}
					</Table>

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
		</Overlay>
	);
}
