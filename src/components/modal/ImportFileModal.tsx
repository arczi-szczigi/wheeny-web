"use client";

import React, { useState, useRef } from "react";
import styled from "styled-components";

type Props = {
	isOpen: boolean;
	title: string;
	templateLabel: string;
	templateHref?: string;
	onImport: (file: File) => Promise<void>;
	onClose: () => void;
};

export const ImportFileModal: React.FC<Props> = ({
	isOpen,
	title,
	templateLabel,
	templateHref,
	onImport,
	onClose,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const fileInput = useRef<HTMLInputElement | null>(null);

	if (!isOpen) return null;

	const handleSend = async () => {
		if (!file) return;
		setSubmitting(true);
		await onImport(file);
		setSubmitting(false);
		setFile(null);
		onClose();
	};

	return (
		<Overlay>
			<Content>
				<Header>{title}</Header>

				<Instructions>
					<p>INSTRUKCJA DODAWANIA:</p>
					<ol>
						<li>Pobierz formatkę pliku Excel.</li>
						<li>Przygotuj plik zgodnie z danymi w Excelu.</li>
						<li>Dodaj gotowy plik Excel poniżej.</li>
					</ol>
					<a href={templateHref} download>
						<TemplateButton>{templateLabel}</TemplateButton>
					</a>
				</Instructions>

				<FileField
					onClick={() => fileInput.current?.click()}
					hasFile={Boolean(file)}>
					{file ? file.name : "Wybierz plik Excel"}
					<input
						ref={fileInput}
						type='file'
						accept='.xlsx,.xls'
						style={{ display: "none" }}
						onChange={e =>
							setFile(
								e.target.files && e.target.files.length
									? e.target.files[0]
									: null
							)
						}
					/>
				</FileField>

				<Buttons>
					<Cancel onClick={onClose}>Anuluj</Cancel>
					<Confirm disabled={!file || submitting} onClick={handleSend}>
						{SubmittingLabel(submitting)}
					</Confirm>
				</Buttons>
			</Content>
		</Overlay>
	);
};

/* ---------- styled ---------- */

const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

const Content = styled.div`
	width: 670px;
	max-width: 95%;
	background: #fff;
	border-radius: 20px;
	padding: 40px 50px 32px;
	display: flex;
	flex-direction: column;
	gap: 26px;
	box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.08);
`;

const Header = styled.h2`
	font-size: 24px;
	font-weight: 600;
	color: #202020;
	display: flex;
	align-items: center;
	gap: 10px;

	&::before {
		content: "📄";
		font-size: 28px;
	}
`;

const Instructions = styled.div`
	font-size: 12px;
	color: #202020;
	line-height: 1.5;

	p {
		font-weight: 600;
		margin-bottom: 6px;
	}

	ol {
		margin: 0 0 14px 18px;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	li {
		list-style: decimal;
	}

	a {
		text-decoration: none;
	}
`;

const TemplateButton = styled.button`
	background: #7fc680;
	color: #fff;
	border: none;
	border-radius: 30px;
	padding: 10px 24px;
	font-size: 12px;
	cursor: pointer;
`;

const FileField = styled.div<{ hasFile: boolean }>`
	height: 44px;
	border: 1px dashed #d9d9d9;
	border-radius: 10px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	font-size: 12px;
	color: ${({ hasFile }) => (hasFile ? "#202020" : "#9d9d9d")};
	cursor: pointer;
`;

const Buttons = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 18px;
`;

const sharedBtn = `
	height: 44px;
	border-radius: 30px;
	border: none;
	font-size: 14px;
	cursor: pointer;
`;

const Cancel = styled.button`
	${sharedBtn}
	background: #d9d9d9;
	color: #202020;
`;

const Confirm = styled.button.attrs({ type: "button" })`
	${sharedBtn}
	background: #ffd100;
	color: #202020;
	opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
	cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
`;

/* ---------- helpers ---------- */
const SubmittingLabel = (submitting: boolean) =>
	submitting ? "Dodawanie…" : "Dodaj";
