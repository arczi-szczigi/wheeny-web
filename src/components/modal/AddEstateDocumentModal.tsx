"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import { useToastContext } from "@/components/toast/ToastContext";

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
	width: 1300px;
	padding: 40px;
	background: #f3f3f3;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const ModalHeader = styled.div`
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
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.8px;
`;

const ModalStep = styled.div`
	color: #4d4d4d;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.8px;
	margin-left: 8px;
`;

const ModalSubtitle = styled.div`
	color: #9d9d9d;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 0.7px;
	margin-top: 10px;
`;

const Fields = styled.div`
	display: flex;
	flex-direction: column;
	gap: 22px;
	margin: 10px 0 0 0;
`;

const FieldGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 7px;
`;

const Label = styled.label`
	color: #4d4d4d;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
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
	&::placeholder {
		color: #dadada;
		font-size: 10px;
	}
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
`;

const FileName = styled.span`
	font-size: 12px;
	color: #202020;
`;

const Footer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 35px;
	margin-top: 20px;
`;

const CancelBtn = styled.button`
	flex: 1;
	background: #d9d9d9;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	border-radius: 30px;
	border: none;
	height: 40px;
	cursor: pointer;
	letter-spacing: 0.5px;
`;

const ActionBtn = styled.button`
	flex: 1;
	background: #ffd100;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	border-radius: 30px;
	border: none;
	height: 40px;
	cursor: pointer;
	letter-spacing: 0.5px;
	transition: background 0.18s;
`;

export default function AddEstateDocumentModal({
	open,
	onClose,
	onSuccess,
}: {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}) {
	const { selectedEstateId, reload } = useMain();
	const { showToast } = useToastContext();

	const [title, setTitle] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!open) return null;

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			setError("Wprowadź nazwę dokumentu!");
			return;
		}
		if (!file) {
			setError("Wybierz plik dokumentu!");
			return;
		}
		if (!selectedEstateId) {
			setError("Brak identyfikatora osiedla!");
			return;
		}
		setError(null);
		setLoading(true);

		try {
			const token = localStorage.getItem("token");
			const formData = new FormData();
			formData.append("file", file);
			formData.append("estateId", selectedEstateId);
			formData.append("title", title.trim());

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
				{
					method: "POST",
					headers: { Authorization: `Bearer ${token || ""}` },
					body: formData,
				}
			);
			if (!res.ok) throw new Error("Błąd wysyłki dokumentu");

			setTitle("");
			setFile(null);
			reload();
			onSuccess && onSuccess();
			onClose();
			showToast({ type: "success", message: "Dokument dodany." });
		} catch (e: any) {
			setError(e.message || "Błąd serwera");
			showToast({ type: "error", message: e?.message || "Błąd przesyłania dokumentu" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Overlay>
			<Modal>
				<ModalHeader>
					<IconCircle>
						<img
							src='/assets/documentsEstate/folder.png'
							width={22}
							height={22}
							alt='folder'
						/>
					</IconCircle>
					<ModalTitle>Dodaj dokument - indywidualnie</ModalTitle>
					
				</ModalHeader>
				<ModalSubtitle>
					Dodaj zbiorczo indywidualne dokumenty dla mieszkańców lub dla
					wybranego mieszkańca.
				</ModalSubtitle>
				<form onSubmit={handleSubmit}>
					<Fields>
						<FieldGroup>
							<Label>Wpisz nazwę dokumentu</Label>
							<Input
								type='text'
								placeholder='Wpisz nazwę'
								value={title}
								onChange={e => setTitle(e.target.value)}
							/>
						</FieldGroup>
						<FieldGroup>
							<Label>Dodaj dokument/dokumenty</Label>
							<FileInputLabel>
								<input
									type='file'
									style={{ display: "none" }}
									onChange={handleFileChange}
								/>
								<span style={{ color: "#dadada", fontSize: 10 }}>
									{file ? (
										<FileName>{file.name}</FileName>
									) : (
										"Prześlij dokument"
									)}
								</span>
							</FileInputLabel>
						</FieldGroup>
					</Fields>
					<Footer>
						<CancelBtn type='button' onClick={onClose} disabled={loading}>
							Anuluj
						</CancelBtn>
						<ActionBtn type='submit' disabled={loading}>
							{loading ? "Wysyłanie..." : "Wybierz odbiorcę/odbiorców"}
						</ActionBtn>
					</Footer>
					{error && (
						<div style={{ color: "crimson", fontSize: 13, marginTop: 10 }}>
							{error}
						</div>
					)}
				</form>
			</Modal>
		</Overlay>
	);
}
