"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAnnouncement } from "@/context/AnnouncementContext";
import { useMain } from "@/context/EstateContext";
import { useToastContext } from "@/components/toast/ToastContext";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

// === STYLES ===
const Overlay = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(30, 30, 30, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
`;

const Modal = styled.div`
	background: #fff;
	border-radius: 24px;
	width: 1220px;
	max-width: 98vw;
	padding: 38px 44px 34px 44px;
	box-shadow: 0 6px 44px #1a1a1a20;
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const ModalTitle = styled.div`
	font-size: 22px;
	font-weight: 700;
	margin-bottom: 7px;
	font-family: Roboto, sans-serif;
`;

const ModalDesc = styled.div`
	font-size: 15px;
	color: #606060;
	margin-bottom: 30px;
`;

const FormGroup = styled.div`
	margin-bottom: 18px;
	width: 100%;
`;

const Label = styled.label`
	display: block;
	font-size: 15px;
	color: #3a3a3a;
	margin-bottom: 7px;
	font-weight: 500;
`;

const Input = styled.input`
	width: 100%;
	padding: 14px 20px;
	border-radius: 10px;
	border: 1.5px solid #e6e6e6;
	background: #fafafa;
	font-size: 17px;
	margin-bottom: 0;
	outline: none;
	font-family: inherit;
	transition: border 0.15s;
	&:focus {
		border-color: #ffd100;
		background: #fff;
	}
`;

const InputsRow = styled.div`
	display: flex;
	gap: 18px;
	width: 100%;
	margin-bottom: 0;
`;

const DateInput = styled(Input).attrs({ type: "date" })`
	padding-right: 18px;
	min-width: 200px;
`;

const FileUploadWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;

const FileButton = styled.label`
	display: flex;
	align-items: center;
	gap: 14px;
	background: #f4f4f4;
	color: #222;
	font-weight: 500;
	font-size: 16px;
	padding: 14px 22px;
	border-radius: 10px;
	border: 1.5px dashed #dadada;
	cursor: pointer;
	transition: border 0.13s;
	margin-bottom: 0;
	&:hover {
		border-color: #ffd100;
		background: #fffae0;
	}
	input {
		display: none;
	}
`;

const FileInfo = styled.div`
	font-size: 14px;
	color: #666;
	margin-left: 5px;
	margin-top: 7px;
	margin-bottom: 0;
`;

const ImagePreview = styled.img`
	max-width: 155px;
	max-height: 95px;
	border-radius: 8px;
	margin: 10px 0 14px 0;
	border: 1px solid #e0e0e0;
	object-fit: cover;
	box-shadow: 0 2px 12px #eee;
`;

const EditorBlock = styled.div`
	border: 1.4px solid #e3e3e3;
	border-radius: 12px;
	background: #f9f9f9;
	min-height: 130px;
	margin-bottom: 0;
	margin-top: 0;
	overflow: hidden;
`;

const Toolbar = styled.div`
	display: flex;
	gap: 7px;
	margin-top: 10px;
	margin-bottom: 8px;
	button {
		border: none;
		background: #ededed;
		padding: 8px 16px;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		font-size: 16px;
		&.active {
			background: #ffd100;
			color: #232323;
		}
		&:hover {
			background: #fff6b0;
		}
	}
`;

const ModalActions = styled.div`
	display: flex;
	gap: 18px;
	margin-top: 38px;
	justify-content: stretch;
`;

const WideButton = styled.button<{ $yellow?: boolean }>`
	flex: 1;
	background: ${p => (p.$yellow ? "#FFD100" : "#F3F3F3")};
	color: ${p => (p.$yellow ? "#202020" : "#888")};
	border: none;
	border-radius: 32px;
	padding: 16px 0;
	font-size: 17px;
	font-weight: 700;
	cursor: pointer;
	transition: background 0.15s;
	margin-top: 0;
	&:disabled {
		opacity: 0.64;
		cursor: default;
	}
`;

const ErrorMsg = styled.div`
	color: #f44336;
	font-size: 15px;
	margin: 13px 0 0 0;
	min-height: 19px;
`;

export default function AddAnnouncementModal({
	isOpen,
	onClose,
	selectedEstateId,
}: {
	isOpen: boolean;
	onClose: () => void;
	selectedEstateId?: string;
}) {
	const { addAnnouncement, loading } = useAnnouncement();
	const { selectedEstateId: estateIdFromContext } = useMain();
	const { showToast } = useToastContext();

	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const [title, setTitle] = useState("");
	const [publishedAt, setPublishedAt] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const estateId = selectedEstateId || estateIdFromContext;

	// --- TIPTAP Z SSR FIXEM! ---
	const editor = useEditor({
		extensions: [StarterKit, Underline],
		content: "",
		editorProps: { attributes: {} },
		autofocus: false,
		immediatelyRender: false,
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImageFile(e.target.files[0]);
			setImagePreview(URL.createObjectURL(e.target.files[0]));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!estateId) {
			setError("Nie wybrano osiedla!");
			return;
		}
		const content = editor?.getHTML() || "";

		try {
			await addAnnouncement({
				title,
				content,
				publishedAt,
				estateId,
				image: imageFile,
			});
			showToast({
				type: "success",
				message: "Ogłoszenie zostało dodane",
			});
			setTitle("");
			setPublishedAt("");
			setImageFile(null);
			setImagePreview(null);
			editor?.commands.setContent("");
			onClose();
		} catch (err: any) {
			setError(err?.message || "Nie udało się dodać ogłoszenia");
		}
	};

	if (!isOpen) return null;
	if (!mounted) return null; // SSR FIX!

	return (
		<Overlay>
			<Modal>
				<ModalTitle>
					<img
						src='/assets/announcmentPanel/addAnnouncment.png'
						alt='Ikona notesu'
						style={{ width: 34, height: 34, marginRight: 8 }}
					/>
					Dodaj ogłoszenie
				</ModalTitle>
				<ModalDesc>Dodaj ogłoszenie dla wszystkich mieszkańców.</ModalDesc>
				<form onSubmit={handleSubmit} autoComplete='off'>
					<FormGroup>
						<Label>
							<img
								src='/assets/announcmentPanel/title.png'
								alt='Ikona tytuł'
								style={{ width: 13, height: 13, marginRight: 8 }}
							/>
							Wpisz tytuł ogłoszenia
						</Label>
						<Input
							placeholder='Wpisz tytuł'
							value={title}
							onChange={e => setTitle(e.target.value)}
							required
							autoFocus
						/>
					</FormGroup>

					<InputsRow>
						<FormGroup style={{ flex: 2 }}>
							<Label>
								<img
									src='/assets/announcmentPanel/img.png'
									alt='Ikona grafika'
									style={{ width: 13, height: 13, marginRight: 8 }}
								/>
								Wybierz obrazek wyróżniający
							</Label>
							<FileUploadWrapper>
								<FileButton>
									<span>Dodaj zdjęcie</span>
									<input
										type='file'
										accept='image/*'
										onChange={handleImageChange}
									/>
								</FileButton>
								<FileInfo>
									{imageFile ? imageFile.name : "Nie wybrano pliku"}
								</FileInfo>
								{imagePreview && (
									<ImagePreview src={imagePreview} alt='Podgląd' />
								)}
							</FileUploadWrapper>
						</FormGroup>

						<FormGroup style={{ flex: 1 }}>
							<Label>
								<img
									src='/assets/announcmentPanel/date.png'
									alt='Ikona kalendraz'
									style={{ width: 13, height: 13, marginRight: 8 }}
								/>
								Wybierz datę publikacji
							</Label>
							<DateInput
								type='date'
								value={publishedAt}
								onChange={e => setPublishedAt(e.target.value)}
								required
							/>
						</FormGroup>
					</InputsRow>

					<FormGroup>
						<Label>
							<img
								src='/assets/announcmentPanel/text.png'
								alt='Ikona tekst'
								style={{ width: 13, height: 13, marginRight: 8 }}
							/>
							Dodaj treść ogłoszenia
						</Label>
						<EditorBlock>
							<EditorContent
								editor={editor}
								style={{ padding: 16, minHeight: 120, background: "none" }}
							/>
						</EditorBlock>
						<Toolbar>
							<button
								type='button'
								className={editor?.isActive("bold") ? "active" : ""}
								onClick={() => editor?.chain().focus().toggleBold().run()}>
								<b>B</b>
							</button>
							<button
								type='button'
								className={editor?.isActive("italic") ? "active" : ""}
								onClick={() => editor?.chain().focus().toggleItalic().run()}>
								<i>I</i>
							</button>
							<button
								type='button'
								className={editor?.isActive("underline") ? "active" : ""}
								onClick={() => editor?.chain().focus().toggleUnderline().run()}>
								<u>U</u>
							</button>
							<button
								type='button'
								className={editor?.isActive("bulletList") ? "active" : ""}
								onClick={() =>
									editor?.chain().focus().toggleBulletList().run()
								}>
								• Lista
							</button>
							<button
								type='button'
								className={editor?.isActive("orderedList") ? "active" : ""}
								onClick={() =>
									editor?.chain().focus().toggleOrderedList().run()
								}>
								1. Lista
							</button>
							<button
								type='button'
								className={
									editor?.isActive("heading", { level: 1 }) ? "active" : ""
								}
								onClick={() =>
									editor?.chain().focus().toggleHeading({ level: 1 }).run()
								}>
								H1
							</button>
							<button
								type='button'
								className={
									editor?.isActive("heading", { level: 2 }) ? "active" : ""
								}
								onClick={() =>
									editor?.chain().focus().toggleHeading({ level: 2 }).run()
								}>
								H2
							</button>
							<button
								type='button'
								onClick={() =>
									editor?.chain().focus().unsetAllMarks().clearNodes().run()
								}>
								Wyczyść
							</button>
						</Toolbar>
					</FormGroup>

					<ErrorMsg>{error || ""}</ErrorMsg>
					<ModalActions>
						<WideButton type='button' onClick={onClose} disabled={loading}>
							Anuluj
						</WideButton>
						<WideButton type='submit' $yellow disabled={loading}>
							{loading ? "Dodawanie..." : "Dodaj ogłoszenie"}
						</WideButton>
					</ModalActions>
				</form>
			</Modal>
		</Overlay>
	);
}
