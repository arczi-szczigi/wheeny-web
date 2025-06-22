"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { GarbageCalendar } from "@/context/AnnouncementContext";

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
	z-index: 2147483647; /* MAX INT w JS :) */
`;

const Modal = styled.div`
	background: #fff;
	border-radius: 20px;
	width: 900px;
	max-width: 98vw;
	padding: 40px 40px 40px 40px;
	box-shadow: 0 6px 40px #1a1a1a12;
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const Title = styled.div`
	font-size: 24px;
	font-weight: 700;
	font-family: Roboto, sans-serif;
	margin-bottom: 6px;
	display: flex;
	align-items: center;
	gap: 10px;
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

const ButtonRow = styled.div`
	display: flex;
	gap: 20px;
	margin-top: 24px;
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
	max-width: 300px;
	cursor: pointer;
	transition: background 0.18s;
	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

const DaysInput = styled(Input)`
	letter-spacing: 0.04em;
`;

type WasteModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (data: { year: string; days: string[] }) => void;
	onEdit?: (id: string, data: { year: string; days: string[] }) => void;
	calendar?: GarbageCalendar | null;
	selectedEstateId?: string;
};

export default function WasteModal({
	isOpen,
	onClose,
	onCreate,
	onEdit,
	calendar,
}: WasteModalProps) {
	// Jeśli przekazany calendar, to tryb edycji
	const isEditMode = !!calendar;

	const [year, setYear] = useState("");
	const [days, setDays] = useState("");
	const [error, setError] = useState<string | null>(null);

	// Po otwarciu modala ustaw pola do edycji
	useEffect(() => {
		if (isEditMode && calendar) {
			setYear(calendar.year?.toString() ?? "");
			setDays(calendar.dates?.join(",") ?? "");
		} else {
			setYear("");
			setDays("");
		}
	}, [isOpen, isEditMode, calendar]);

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

		// Rozdziel dni po przecinku i usuń nadmiarowe spacje
		const daysArr = days
			.split(",")
			.map(x => x.trim())
			.filter(Boolean);

		if (daysArr.length === 0) {
			setError("Musisz podać przynajmniej jeden termin.");
			return;
		}

		if (isEditMode && calendar && onEdit) {
			onEdit(calendar._id, { year, days: daysArr });
		} else {
			onCreate({ year, days: daysArr });
		}
	};

	if (!isOpen) return null;

	return (
		<Overlay>
			<Modal>
				<form onSubmit={handleSubmit} autoComplete='off'>
					<Title>
						{isEditMode
							? "Edytuj kalendarz wywozu odpadów gabarytowych"
							: "Utwórz kalendarz wywozu odpadów gabarytowych"}
					</Title>
					<SubTitle>
						{isEditMode
							? "Możesz edytować rok oraz terminy wywozu. Zmiany będą widoczne w aplikacji mieszkańca."
							: "Utworzony kalendarz wywozu odpadów gabarytowych będzie wyświetlany mieszkańcom w aplikacji mobilnej. Możesz go edytować w dowolnym momencie."}
					</SubTitle>
					<FormRow>
						<div style={{ flex: 1 }}>
							<label
								style={{
									fontSize: 15,
									marginBottom: 5,
									display: "block",
								}}>
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
					{error && (
						<div style={{ color: "red", marginTop: 12, fontSize: 15 }}>
							{error}
						</div>
					)}
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
