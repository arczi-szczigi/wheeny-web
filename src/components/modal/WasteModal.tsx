"use client";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import type { GarbageCalendar } from "@/context/AnnouncementContext";
import { useToast } from "@/components/toast/useToast";

// --- STYLE ---
const Overlay = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2147483647;
`;
const Modal = styled.div`
	background: #fff;
	border-radius: 20px;
	width: 900px;
	max-width: 98vw;
	padding: 40px;
	box-shadow: 0 6px 40px #1a1a1a12;
	display: flex;
	flex-direction: column;
	gap: 24px;
`;
const TitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 18px;
`;
const MainIcon = styled.img`
	width: 44px;
	height: 44px;
	background: #ffd100;
	border-radius: 12px;
	padding: 8px;
`;
const Title = styled.div`
	font-size: 24px;
	font-weight: 700;
	font-family: Roboto, sans-serif;
`;
const SubTitle = styled.div`
	color: #818181;
	font-size: 16px;
	margin-bottom: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
`;
const FormRow = styled.div`
	display: flex;
	gap: 20px;
	align-items: flex-end;
`;
const Input = styled.input`
	width: 100%;
	padding: 14px 18px;
	border-radius: 10px;
	border: 1px solid #eee;
	background: #f5f5f5;
	font-size: 16px;
	margin-bottom: 0px;
	outline: none;
	font-family: Roboto, sans-serif;
`;
const DaysInput = styled(Input)`
	letter-spacing: 0.04em;
`;
const FileRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-top: 8px;
`;
const FileInputWrap = styled.label`
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 10px;
	padding: 10px 16px;
	gap: 12px;
	border: 1px solid #eee;
	cursor: pointer;
	transition: border 0.2s;
	&:hover {
		border: 1.5px solid #ffd100;
	}
`;
const AttachIcon = styled.img`
	width: 23px;
	height: 23px;
`;
const HiddenFileInput = styled.input`
	display: none;
`;
const FileList = styled.div`
	margin-top: 3px;
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
`;
const FileItem = styled.a`
	display: flex;
	align-items: center;
	gap: 7px;
	padding: 6px 13px 6px 8px;
	background: #f9f9f9;
	border-radius: 7px;
	font-size: 15px;
	font-family: Roboto;
	color: #0066cc;
	text-decoration: underline;
	border: 1px solid #f1f1f1;
	cursor: pointer;
	transition: background 0.17s;
	&:hover {
		background: #f6f5ee;
		text-decoration: underline;
	}
`;
const DownloadExistingFile = styled.a`
	display: flex;
	align-items: center;
	gap: 7px;
	margin-top: 6px;
	font-size: 15px;
	color: #16770a;
	text-decoration: underline;
	cursor: pointer;
	transition: color 0.18s;
	&:hover {
		color: #005500;
	}
`;
const ErrorText = styled.div`
	color: #f44336;
	margin-top: 12px;
	font-size: 15px;
`;
const ButtonRow = styled.div`
	display: flex;
	gap: 20px;
	margin-top: 30px;
	width: 100%;
`;
const Button = styled.button<{ yellow?: boolean }>`
	background: ${p => (p.yellow ? "#FFD100" : "#E3E3E3")};
	color: ${p => (p.yellow ? "#202020" : "#818181")};
	border: none;
	border-radius: 30px;
	padding: 14px 0;
	font-size: 18px;
	font-weight: 600;
	font-family: Roboto, sans-serif;
	width: 100%;
	cursor: pointer;
	transition: background 0.18s;
	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

// --- MODAL ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type WasteModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (data: {
		estateId: string;
		year: number;
		dates: string[];
		file?: File | null;
	}) => void;
	onEdit?: (
		id: string,
		data: {
			estateId: string;
			year: number;
			dates: string[];
			file?: File | null;
		}
	) => void;
	calendar?: GarbageCalendar | null;
	selectedEstateId?: string;
};

export default function WasteModal({
	isOpen,
	onClose,
	onCreate,
	onEdit,
	calendar,
	selectedEstateId,
}: WasteModalProps) {
	const isEditMode = !!calendar;
	const [year, setYear] = useState("");
	const [days, setDays] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

	const { showToast } = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Ładowanie danych do edycji
	useEffect(() => {
		if (isEditMode && calendar) {
			setYear(calendar.year?.toString() ?? "");
			setDays(calendar.dates?.join(",") ?? "");
			setFile(null);
			setUploadedFileUrl(null);
		} else {
			setYear("");
			setDays("");
			setFile(null);
			setUploadedFileUrl(null);
		}
	}, [isOpen, isEditMode, calendar]);

	// --- HANDLER ---
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!year) {
			setError("Wybierz rok kalendarzowy.");
			return;
		}
		if (!days) {
			setError("Wpisz dni odbioru odpadów.");
			return;
		}
		// WALIDACJA estateId!
		const estateId =
			isEditMode && calendar ? calendar.estateId : selectedEstateId;
		if (!estateId) {
			setError("Nie wybrano osiedla!");
			return;
		}

		const daysArr = days
			.split(",")
			.map(x => x.trim())
			.filter(Boolean);

		if (daysArr.length === 0) {
			setError("Musisz podać przynajmniej jeden termin.");
			return;
		}

		if (isEditMode && calendar && onEdit) {
			onEdit(calendar._id, {
				estateId,
				year: Number(year),
				dates: daysArr,
				file,
			});
		} else {
			onCreate({
				estateId,
				year: Number(year),
				dates: daysArr,
				file,
			});
		}
	};

	// Obsługa pliku
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0] ?? null;
		setFile(f);
		if (f) {
			setUploadedFileUrl(URL.createObjectURL(f));
			showToast({ type: "success", message: "Plik został dodany!" });
		} else {
			setUploadedFileUrl(null);
		}
	};

	if (!isOpen) return null;

	return (
		<Overlay>
			<Modal>
				<form onSubmit={handleSubmit} autoComplete='off'>
					<TitleRow>
						<MainIcon src='/assets/trash/calendar_main.svg' alt='' />
						<Title>
							{isEditMode
								? "Edytuj kalendarz wywozu odpadów gabarytowych"
								: "Utwórz kalendarz wywozu odpadów gabarytowych"}
						</Title>
					</TitleRow>
					<SubTitle>
						{isEditMode
							? "Możesz edytować rok oraz terminy wywozu. Zmiany będą widoczne w aplikacji mieszkańca."
							: "Utworzony kalendarz wywozu odpadów gabarytowych będzie wyświetlany mieszkańcom w aplikacji mobilnej. Możesz go edytować w dowolnym momencie."}
					</SubTitle>
					<FormRow>
						<div style={{ flex: 1 }}>
							<label
								style={{ fontSize: 15, marginBottom: 5, display: "block" }}>
								Wybierz rok kalendarzowy
							</label>
							<Input
								placeholder='Wybierz rok kalendarzowy'
								type='number'
								value={year}
								min='2024'
								max='2100'
								onChange={e => setYear(e.target.value)}
								required
							/>
						</div>
					</FormRow>
					<div style={{ marginTop: 18 }}>
						<label style={{ fontSize: 15, marginBottom: 5, display: "block" }}>
							Wypisz wszystkie dni w roku odbioru odpadów gabarytowych np.
							21.01,22.02,13.03 itd.
						</label>
						<DaysInput
							placeholder='Wpisz dni i miesiące po przecinku'
							value={days}
							onChange={e => setDays(e.target.value)}
							required
						/>
					</div>
					<FileRow>
						<label style={{ fontSize: 15, marginBottom: 5, display: "block" }}>
							Dodaj plik informacyjny o sortowaniu (opcjonalnie, tylko Excel)
						</label>
						<FileInputWrap>
							<AttachIcon src='/assets/trash/attach.svg' alt='attach' />
							<span style={{ color: "#999", fontSize: 15, flex: 1 }}>
								{file ? file.name : "Dodaj plik Excel (.xls, .xlsx)"}
							</span>
							<HiddenFileInput
								ref={fileInputRef}
								type='file'
								accept='.xls,.xlsx'
								onChange={handleFileChange}
							/>
							<button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								style={{
									background: "#FFD100",
									border: "none",
									borderRadius: 25,
									padding: "7px 18px",
									fontWeight: 500,
									fontFamily: "Roboto, sans-serif",
									fontSize: 14,
									color: "#202020",
									cursor: "pointer",
									marginLeft: 12,
								}}>
								{file ? "Zmień" : "Dodaj"}
							</button>
						</FileInputWrap>
						{/* Nowy plik (po zmianie) */}
						{uploadedFileUrl && file && (
							<FileList>
								<FileItem
									href={uploadedFileUrl}
									target='_blank'
									rel='noopener noreferrer'
									download={file.name}>
									{file.name}
								</FileItem>
							</FileList>
						)}
						{/* Istniejący plik na backendzie (tylko w trybie edycji, jeśli nie wybrano nowego pliku) */}
						{isEditMode && calendar?.infoFileUrl && !file && (
							<DownloadExistingFile
								href={`${API_URL}${calendar.infoFileUrl}`}
								target='_blank'
								rel='noopener noreferrer'
								download={calendar.infoFileOriginalName || true}>
								<img
									src='/assets/trash/excel.svg'
									alt='excel'
									style={{ width: 19, height: 19 }}
								/>
								{calendar.infoFileOriginalName
									? calendar.infoFileOriginalName
									: "Pobierz obecny plik informacyjny"}
							</DownloadExistingFile>
						)}
					</FileRow>
					{error && <ErrorText>{error}</ErrorText>}
					<ButtonRow>
						<Button type='button' onClick={onClose}>
							Anuluj
						</Button>
						<Button type='submit' yellow>
							{isEditMode ? "Zapisz zmiany" : "Utwórz kalendarz"}
						</Button>
					</ButtonRow>
				</form>
			</Modal>
		</Overlay>
	);
}
