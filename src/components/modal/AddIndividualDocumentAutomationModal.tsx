// AddIndividualDocumentAutomationModal.tsx
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

const WarningBox = styled.div`
	background: #fff3cd;
	border: 1px solid #ffeaa7;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 20px;
`;

const WarningText = styled.p`
	font-family: Roboto;
	font-size: 12px;
	color: #856404;
	margin: 0;
	line-height: 1.4;
`;

const WarningExample = styled.code`
	background: #f8f9fa;
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 11px;
	color: #e83e8c;
`;

// File upload area
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

const TableRow = styled.div<{ error?: boolean }>`
	display: flex;
	border-bottom: 1px solid #f0f0f0;
	background: ${({ error }) => error ? "#fff5f5" : "#fff"};

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

const ErrorBadge = styled.span`
	background: #e74c3c;
	color: #fff;
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 4px;
	margin-left: 8px;
`;

const SuccessBadge = styled.span`
	background: #27ae60;
	color: #fff;
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 4px;
	margin-left: 8px;
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

type MappedFile = {
	file: File;
	title: string;
	resident: Resident | null;
	error?: string;
};

export default function AddIndividualDocumentAutomationModal({
	open,
	onClose,
	onSuccess,
	estateId,
	residents,
	residentsLoading,
	residentsError,
}: Props) {
	const { uploadDocument } = useDocForResidents();
	const { showToast } = useToastContext();
	const [files, setFiles] = useState<File[]>([]);
	const [mappedFiles, setMappedFiles] = useState<MappedFile[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// Funkcja do wyciągania numeru mieszkania z nazwy pliku
	const extractFlatNumber = (filename: string): string | null => {
		// Szukamy wzorca m{liczba}.{rozszerzenie} na końcu nazwy pliku
		const matchWithDot = filename.match(/m(\d+)\.[^.]+$/);
		if (matchWithDot) return `m.${matchWithDot[1]}`;

		// Jeśli nie ma kropki, szukamy m{liczba} na końcu
		const matchWithoutDot = filename.match(/m(\d+)$/);
		if (matchWithoutDot) return `m.${matchWithoutDot[1]}`;

		return null;
	};

	// Automatyczne mapowanie plików do mieszkańców
	useEffect(() => {
		const mapped = files.map(file => {
			const flatNumber = extractFlatNumber(file.name);
			const resident = residents.find(r => `m.${r.flatNumber}` === flatNumber);
			
			return {
				file,
				title: file.name.replace(/\.[^/.]+$/, ""), // Usuwamy rozszerzenie
				resident: resident || null,
				error: !flatNumber ? "Brak numeru mieszkania w nazwie" : 
					   !resident ? "Nie znaleziono mieszkańca" : undefined
			};
		});
		
		setMappedFiles(mapped);
	}, [files, residents]);

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const fileList = Array.from(e.target.files);
			setFiles(fileList);
		}
	};

	const removeFile = (index: number) => {
		setFiles(prev => prev.filter((_, i) => i !== index));
	};

	const updateTitle = (index: number, title: string) => {
		setMappedFiles(prev =>
			prev.map((item, i) =>
				i === index ? { ...item, title } : item
			)
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (submitting) return;
		
		const validFiles = mappedFiles.filter(item => item.resident && !item.error);
		if (validFiles.length === 0) {
			setError("Brak poprawnie zmapowanych plików!");
			return;
		}

		setError(null);
		setSubmitting(true);
		
		// Generuj unikalne batchId dla tej paczki
		const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		
		try {
			for (const item of validFiles) {
				if (item.resident) {
					await uploadDocument({
						file: item.file,
						estateId: estateId!,
						title: item.title,
						residentId: item.resident._id,
						batchId,
					});
				}
			}
			showToast({
				type: "success",
				message: "Dokumenty przesłane"
			});
			onSuccess?.();
			onClose();
		} catch (e: any) {
			setError(e.message);
		} finally {
			setSubmitting(false);
		}
	};

	if (!open) return null;

	return (
		<Overlay>
			<ModalBox>
				<Header>
					<IconCircle>
						<img src='/assets/documentsEstate/folder.png' alt='folder' />
					</IconCircle>
					<Title>Automatyczne dodawanie dokumentów - indywidualne</Title>
					<Step>1/1</Step>
				</Header>
				<Subtitle>
					Pamiętaj aby twoje dokumenty na końcu nazwy 4 ostatnie pola były zarezerwowane dla numeru mieszkania
				</Subtitle>
				
				<WarningBox>
					<WarningText>
						<strong>Przykład:</strong> <WarningExample>726473_hh94589_00m1.pdf</WarningExample><br/>
						W innym wypadku system nie przydzieli odpowiednich plików do numerów mieszkań
					</WarningText>
				</WarningBox>

				<form onSubmit={handleSubmit}>
					<UploadArea>
						<FileInputLabel>
							<img src='/assets/documentsEstate/folder.png' alt='upload' />
							<FileName>
								{files.length > 0 
									? `Wybrano ${files.length} plików` 
									: "Wybierz pliki (można wybrać wiele)"
								}
							</FileName>
							<input 
								type='file' 
								multiple
								hidden 
								onChange={onFileChange} 
							/>
						</FileInputLabel>
					</UploadArea>

					{files.length > 0 && (
						<Table>
							<TableHeader>
								<Th flex={2}>Nazwa pliku</Th>
								<Th flex={1}>Tytuł dokumentu</Th>
								<Th flex={1}>Przypisany do</Th>
								<Th flex={0}>Status</Th>
								<Th flex={0}>Akcje</Th>
							</TableHeader>
							{mappedFiles.map((item, index) => (
								<TableRow key={index} error={!!item.error}>
									<Td flex={2}>{item.file.name}</Td>
									<Td flex={1}>
										<input
											type="text"
											value={item.title}
											onChange={(e) => updateTitle(index, e.target.value)}
											style={{
												width: "100%",
												padding: "4px 8px",
												border: "1px solid #e0e0e0",
												borderRadius: "4px",
												fontSize: "11px"
											}}
										/>
									</Td>
									<Td flex={1}>
										{item.resident 
											? `m.${item.resident.flatNumber} - ${item.resident.name}`
											: "Nie przypisano"
										}
									</Td>
									<Td flex={0}>
										{item.error ? (
											<ErrorBadge>Błąd</ErrorBadge>
										) : (
											<SuccessBadge>OK</SuccessBadge>
										)}
									</Td>
									<Td flex={0}>
										<RemoveBtn 
											type="button"
											onClick={() => removeFile(index)}
										>
											×
										</RemoveBtn>
									</Td>
								</TableRow>
							))}
						</Table>
					)}

					{error && <ErrorMessage>{error}</ErrorMessage>}

					<Footer>
						<Button type='button' variant='cancel' onClick={onClose} disabled={submitting}>
							Anuluj
						</Button>
						<Button type='submit' variant='confirm' disabled={submitting}>
							{submitting ? "Wysyłanie..." : "Potwierdź i wyślij"}
						</Button>
					</Footer>
				</form>
			</ModalBox>
		</Overlay>
	);
} 