"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AddCoworkerModal from "../modal/AddCoworkerModal";
import EditCoworkerModal from "../modal/EditCoworkerModal";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import { useToastContext } from "@/components/toast/ToastContext";
import { FiPlus, FiSearch } from "react-icons/fi";

// --- STYLES ---
const Container = styled.div`
	width: 100%;
	max-width: 1400px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 40px;
`;

const StatsRow = styled.div`
	display: flex;
	gap: 24px;
	margin-bottom: 10px;
`;

const StatBox = styled.div`
	position: relative;
	background: white;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 18px;
	flex: 1;
	min-width: 260px;
	height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 32px;
	overflow: hidden;
`;

const QuarterCircleWrapper = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	width: 60px;
	height: 60px;
	pointer-events: none;
	z-index: 1;
`;

const QuarterSvg = styled.svg`
	width: 100%;
	height: 100%;
`;

const StatNumber = styled.div`
	color: #202020;
	font-size: 32px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	line-height: 38px;
	letter-spacing: 1.6px;
	position: relative;
	z-index: 2;
`;

const StatLabel = styled.div`
	color: #9d9d9d;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
	position: relative;
	z-index: 2;
`;

const DateBox = styled(StatBox)`
	align-items: flex-start;
	gap: 6px;
	background: #202020;
`;

const DateLabel = styled.div`
	color: #ffffff;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.6px;
`;

const DateValue = styled.div`
	color: #ffffff;
	font-size: 22px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1px;
`;

const Card = styled.div`
	background: white;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 20px;
	width: 100%;
	padding: 32px 36px;
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const CardTitle = styled.h2`
	color: #202020;
	font-size: 24px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.2px;
	margin: 0;
`;

const DateText = styled.div`
	color: #9d9d9d;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
	margin-bottom: 24px;
`;

const CalendarGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 6px;
	margin: 0 auto;
	max-width: 420px;
`;

const CalendarHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	color: #9d9d9d;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	letter-spacing: 0.5px;
`;

const CalendarDay = styled.div<{ isToday?: boolean; hasEvent?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	border-radius: 8px;
	color: ${({ isToday }) => (isToday ? "#202020" : "#4d4d4d")};
	background: ${({ isToday, hasEvent }) =>
		isToday ? "#FFD100" : hasEvent ? "#ffea80" : "transparent"};
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: ${({ isToday }) => (isToday ? "700" : "400")};
	letter-spacing: 0.5px;
	transition: background 0.2s;
	cursor: ${({ hasEvent }) => (hasEvent ? "pointer" : "default")};

	&:hover {
		background: ${({ isToday, hasEvent }) =>
			isToday ? "#FFD100" : hasEvent ? "#ffea80" : "#f5f5f5"};
	}
`;

// Lista współpracowników
const CoworkersList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const CoworkerItem = styled.div`
	background: #f8f9fa;
	border-radius: 12px;
	padding: 20px 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const CoworkerInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const CoworkerName = styled.div`
	color: #202020;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	letter-spacing: 0.8px;
`;

const CoworkerDetails = styled.div`
	color: #666;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
`;

const CoworkerActions = styled.div`
	display: flex;
	gap: 12px;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
	background: ${({ variant }) => 
		variant === 'delete' ? '#e74c3c' : '#ffd100'};
	color: ${({ variant }) => 
		variant === 'delete' ? '#fff' : '#202020'};
	border: none;
	border-radius: 8px;
	padding: 8px 16px;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 0.5px;
	cursor: pointer;
	transition: background 0.2s;

	&:hover {
		background: ${({ variant }) => 
			variant === 'delete' ? '#c0392b' : '#e6c200'};
	}
`;

const AddButton = styled.button`
	height: 40px;
	padding: 0 20px;
	background: #ffd100;
	border: none;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 6px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	font-weight: 400;
	letter-spacing: 0.6px;
	color: #202020;
	cursor: pointer;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	transition: background 0.2s;
	margin-bottom: 0;

	&:hover {
		background: #e6c200;
	}
`;

const TopActionsRow = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;
`;

const SearchWrapper = styled.div`
	flex: 1 1 0;
	height: 40px;
	padding: 0 20px;
	background: #ffffff;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 6px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const SearchInput = styled.input`
	flex: 1 1 0;
	border: none;
	outline: none;
	font-family: Roboto, sans-serif;
	font-size: 14px;
	color: #202020;
	min-width: 260px;
	&::placeholder { color: #9d9d9d; }
`;

const EmptyState = styled.div`
	text-align: center;
	padding: 40px 20px;
	color: #9d9d9d;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
`;

// --- COMPONENT ---
export default function YourCoworkers() {
	const { showToast } = useToastContext();
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedCoworker, setSelectedCoworker] = useState<any>(null);
	const [coworkers, setCoworkers] = useState<any[]>([]);
	const [coworkersCount, setCoworkersCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [query, setQuery] = useState("");

	const today = new Date();
	const monthsPL = [
		"stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
		"lipca", "sierpnia", "września", "października", "listopada", "grudnia",
	];
	const formattedDate = `${today.getDate()} ${monthsPL[today.getMonth()]} ${today.getFullYear()}`;

	// Pobierz współpracowników przy załadowaniu komponentu
	useEffect(() => {
		fetchCoworkers();
		fetchCoworkersCount();
	}, []);

	const fetchCoworkers = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coworkers`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error("Błąd pobierania współpracowników");

			const data = await response.json();
			setCoworkers(data);
		} catch (error: any) {
			console.error("Błąd pobierania współpracowników:", error);
			showToast({
				type: "error",
				message: "Błąd pobierania listy współpracowników"
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchCoworkersCount = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coworkers/count`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error("Błąd pobierania liczby współpracowników");

			const data = await response.json();
			setCoworkersCount(data.count);
		} catch (error: any) {
			console.error("Błąd pobierania liczby współpracowników:", error);
		}
	};

	// Kalendarz - prosty grid na aktualny miesiąc
	const generateCalendar = () => {
		const year = today.getFullYear();
		const month = today.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());

		const days = [];
		const dayNames = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"];

		// Nagłówki dni tygodnia
		dayNames.forEach(day => {
			days.push(
				<CalendarHeader key={day}>{day}</CalendarHeader>
			);
		});

		// Dni miesiąca
		for (let i = 0; i < 42; i++) {
			const currentDate = new Date(startDate);
			currentDate.setDate(startDate.getDate() + i);
			
			const isToday = 
				currentDate.getDate() === today.getDate() &&
				currentDate.getMonth() === today.getMonth() &&
				currentDate.getFullYear() === today.getFullYear();

			days.push(
				<CalendarDay key={i} isToday={isToday}>
					{currentDate.getDate()}
				</CalendarDay>
			);
		}

		return days;
	};

	const handleAddCoworker = (newCoworker: any) => {
		setCoworkers(prev => [...prev, newCoworker]);
		setCoworkersCount(prev => prev + 1);
		setShowAddModal(false);
	};

	const handleEditCoworker = (coworkerId: string) => {
		const coworker = coworkers.find(c => c._id === coworkerId);
		if (coworker) {
			setSelectedCoworker(coworker);
			setShowEditModal(true);
		}
	};

	const handleEditSuccess = (updatedCoworker: any) => {
		// Update coworker in local list
		setCoworkers(prev => prev.map(c => 
			c._id === updatedCoworker._id ? updatedCoworker : c
		));
		setShowEditModal(false);
		setSelectedCoworker(null);
	};

	const handleDeleteCoworker = (coworkerId: string) => {
		const coworker = coworkers.find(c => c._id === coworkerId);
		if (coworker) {
			setSelectedCoworker(coworker);
			setShowDeleteModal(true);
		}
	};

	const handleDeleteConfirm = async () => {
		if (!selectedCoworker) return;

		setDeleteLoading(true);
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coworkers/${selectedCoworker._id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error("Błąd usuwania współpracownika");

			// Remove from local list
			setCoworkers(prev => prev.filter(c => c._id !== selectedCoworker._id));
			setCoworkersCount(prev => prev - 1);

			showToast({
				type: "success",
				message: "Współpracownik został usunięty"
			});

			setShowDeleteModal(false);
			setSelectedCoworker(null);
		} catch (error: any) {
			console.error("Błąd usuwania współpracownika:", error);
			showToast({
				type: "error",
				message: "Błąd podczas usuwania współpracownika"
			});
		} finally {
			setDeleteLoading(false);
		}
	};

	const filteredCoworkers = coworkers.filter(cw => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return (
			`${cw.firstName} ${cw.lastName}`.toLowerCase().includes(q) ||
			(cw.email || "").toLowerCase().includes(q) ||
			(cw.phone || "").toLowerCase().includes(q) ||
			(cw.position || "").toLowerCase().includes(q)
		);
	});

	return (
		<Container>
			{/* Statystyki */}
			<StatsRow>
				<StatBox>
					<QuarterCircleWrapper>
						<QuarterSvg viewBox="0 0 60 60">
							<path
								d="M 60 60 L 60 0 A 60 60 0 0 0 0 60 Z"
								fill="#FFD100"
							/>
						</QuarterSvg>
					</QuarterCircleWrapper>
					<StatNumber>{coworkersCount}</StatNumber>
					<StatLabel>Współpracowników</StatLabel>
				</StatBox>
				<DateBox>
					<DateLabel>Dziś mamy:</DateLabel>
					<DateValue>{formattedDate}</DateValue>
				</DateBox>
			</StatsRow>

			{/* Lista współpracowników */}
			<Card>
				<CardTitle>Współpracownicy</CardTitle>
				<TopActionsRow>
					<AddButton onClick={() => setShowAddModal(true)}>
						<FiPlus size={15} />
						<span>Dodaj współpracownika</span>
					</AddButton>
					<SearchWrapper>
						<FiSearch size={15} color="#9d9d9d" />
						<SearchInput
							type="text"
							placeholder="Wyszukaj współpracownika"
							value={query}
							onChange={e => setQuery(e.target.value)}
						/>
					</SearchWrapper>
				</TopActionsRow>
				
				{loading ? (
					<EmptyState>
						Ładowanie współpracowników...
					</EmptyState>
				) : filteredCoworkers.length === 0 ? (
					<EmptyState>
						Brak wyników dla podanego wyszukiwania.
					</EmptyState>
				) : (
					<CoworkersList>
						{filteredCoworkers.map((coworker) => (
							<CoworkerItem key={coworker._id}>
								<CoworkerInfo>
									<CoworkerName>
										{coworker.firstName} {coworker.lastName}
									</CoworkerName>
									<CoworkerDetails>
										{coworker.email} • {coworker.phone} • {coworker.position}
									</CoworkerDetails>
								</CoworkerInfo>
								<CoworkerActions>
									<ActionButton 
										onClick={() => handleEditCoworker(coworker._id)}
									>
										Edytuj dane
									</ActionButton>
									<ActionButton 
										variant="delete"
										onClick={() => handleDeleteCoworker(coworker._id)}
									>
										Usuń
									</ActionButton>
								</CoworkerActions>
							</CoworkerItem>
						))}
					</CoworkersList>
				)}
			</Card>

			{/* Modal dodawania współpracownika */}
			<AddCoworkerModal 
				open={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSuccess={handleAddCoworker}
			/>

			{/* Modal edycji współpracownika */}
			<EditCoworkerModal
				open={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setSelectedCoworker(null);
				}}
				onSuccess={handleEditSuccess}
				coworker={selectedCoworker}
			/>

			{/* Modal potwierdzenia usunięcia */}
			<ConfirmDeleteModal
				open={showDeleteModal}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedCoworker(null);
				}}
				onConfirm={handleDeleteConfirm}
				title="Usuń współpracownika"
				message={`Czy na pewno chcesz usunąć współpracownika <strong>${selectedCoworker?.firstName} ${selectedCoworker?.lastName}</strong>?<br><br>Ta akcja jest nieodwracalna.`}
				confirmText="Usuń współpracownika"
				isLoading={deleteLoading}
			/>
		</Container>
	);
}
