import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAnnouncement } from "@/context/AnnouncementContext";

const Overlay = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
`;

const Modal = styled.div`
	background: #fff;
	border-radius: 20px;
	width: 650px;
	max-width: 95vw;
	padding: 36px 32px 30px 32px;
	box-shadow: 0 6px 40px #1a1a1a1a;
	display: flex;
	flex-direction: column;
	gap: 28px;
`;

const Title = styled.div`
	font-size: 22px;
	font-weight: bold;
	margin-bottom: 2px;
	font-family: Roboto, sans-serif;
`;

const Input = styled.input`
	width: 100%;
	padding: 12px 18px;
	border-radius: 10px;
	border: 1px solid #eee;
	background: #f5f5f5;
	font-size: 16px;
	margin-bottom: 12px;
	outline: none;
`;

const DateInput = styled.input`
	width: 220px;
	padding: 12px 18px;
	border-radius: 10px;
	border: 1.2px solid #d6d6d6;
	background: #fff;
	font-size: 16px;
	margin-bottom: 12px;
`;

const TextArea = styled.textarea`
	width: 100%;
	padding: 14px 18px;
	border-radius: 10px;
	border: 1px solid #eee;
	background: #f5f5f5;
	font-size: 16px;
	min-height: 120px;
	margin-bottom: 8px;
	outline: none;
	resize: vertical;
`;

const Row = styled.div`
	display: flex;
	gap: 24px;
	align-items: center;
`;

const Button = styled.button<{ yellow?: boolean }>`
	background: ${p => (p.yellow ? "#FFD100" : "#F3F3F3")};
	color: ${p => (p.yellow ? "#202020" : "#888")};
	border: none;
	border-radius: 30px;
	padding: 12px 32px;
	font-size: 16px;
	font-weight: 600;
	margin-top: 0;
	cursor: pointer;
	transition: background 0.15s;
	&:disabled {
		opacity: 0.65;
		cursor: default;
	}
`;

type EditAnnouncementModalProps = {
	isOpen: boolean;
	onClose: () => void;
	announcement: {
		_id: string;
		title: string;
		content: string;
		publishedAt: string;
		estateId: string;
	};
};

export default function EditAnnouncementModal({
	isOpen,
	onClose,
	announcement,
}: EditAnnouncementModalProps) {
	const { editAnnouncement, loading } = useAnnouncement();

	const [title, setTitle] = useState(announcement.title);
	const [content, setContent] = useState(announcement.content);
	const [publishedAt, setPublishedAt] = useState(
		announcement.publishedAt.slice(0, 10)
	); // yyyy-mm-dd
	const [error, setError] = useState<string | null>(null);

	// Przy zmianie ogłoszenia w props - przepisz dane do stanu (gdy user zmieni edytowane ogłoszenie bez zamknięcia modala)
	useEffect(() => {
		setTitle(announcement.title);
		setContent(announcement.content);
		setPublishedAt(announcement.publishedAt.slice(0, 10));
	}, [announcement]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!title.trim() || !content.trim()) {
			setError("Uzupełnij wszystkie pola!");
			return;
		}
		try {
			await editAnnouncement(
				announcement._id,
				{
					title,
					content,
					publishedAt: new Date(publishedAt).toISOString(),
				},
				announcement.estateId
			);
			onClose();
		} catch (err: any) {
			setError(err?.message || "Błąd edycji ogłoszenia");
		}
	};

	if (!isOpen) return null;

	return (
		<Overlay>
			<Modal>
				<Title>Edytuj ogłoszenie</Title>
				<form onSubmit={handleSubmit} autoComplete='off'>
					<Input
						placeholder='Wpisz tytuł ogłoszenia'
						value={title}
						onChange={e => setTitle(e.target.value)}
						required
						autoFocus
					/>
					<DateInput
						type='date'
						value={publishedAt}
						onChange={e => setPublishedAt(e.target.value)}
						required
					/>
					<TextArea
						placeholder='Dodaj treść ogłoszenia'
						value={content}
						onChange={e => setContent(e.target.value)}
						required
					/>
					{error && (
						<div style={{ color: "red", margin: "10px 0 0 0", fontSize: 15 }}>
							{error}
						</div>
					)}
					<Row style={{ marginTop: 8 }}>
						<Button type='button' onClick={onClose} disabled={loading}>
							Anuluj
						</Button>
						<Button type='submit' yellow disabled={loading}>
							{loading ? "Zapisywanie..." : "Zapisz zmiany"}
						</Button>
					</Row>
				</form>
			</Modal>
		</Overlay>
	);
}
