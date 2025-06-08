"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";

// Typy danych
export type Address = {
	city: string;
	zipCode: string;
	street: string;
	buildingNumber: string;
	_id: string;
};

export type Estate = {
	_id: string;
	name: string;
	address: Address;
	bankAccountNumber: string;
	rentDueDate: string;
	numberOfFlats: number;
	manager: string;
	createdAt: string;
	updatedAt: string;
};

export type Manager = {
	_id: string;
	companyName: string;
	address: Address;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	estates: string[]; // lista ID osiedli
	createdAt: string;
	updatedAt: string;
};

export type Resident = {
	_id: string;
	flatNumber: string;
	firstName: string;
	lastName: string;
	phone: string;
	area: number;
	hasGarage: boolean;
	hasStorage: boolean;
	appConsent: boolean;
	estate: string;
	createdAt: string;
	updatedAt: string;
};

export type TicketMessage = {
	sender: "resident" | "manager";
	content: string;
	_id: string;
	timestamp: string;
	id: string;
};

export type Ticket = {
	_id: string;
	subject: string;
	status: "open" | "in_progress" | "closed";
	estate: string;
	residentEmail: string;
	messages: TicketMessage[];
	createdAt: string;
	updatedAt: string;
	estateDetails?: Estate;
	id: string;
};

export type Announcement = {
	_id: string;
	title: string;
	content: string;
	publishedAt: string;
	recipients: string[];
	estate: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
};

type EstateContextType = {
	manager: Manager | null;
	estates: Estate[];
	residents: Resident[];
	tickets: Ticket[];
	announcements: Announcement[];
	selectedEstateId: string | null;
	setSelectedEstateId: (id: string | null) => void;
	loading: boolean;
	error: string | null;
	reload: () => void;
};

const EstateContext = createContext<EstateContextType>({
	manager: null,
	estates: [],
	residents: [],
	tickets: [],
	announcements: [],
	selectedEstateId: null,
	setSelectedEstateId: () => {},
	loading: false,
	error: null,
	reload: () => {},
});

export const EstateProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [manager, setManager] = useState<Manager | null>(null);
	const [estates, setEstates] = useState<Estate[]>([]);
	const [residents, setResidents] = useState<Resident[]>([]);
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [selectedEstateId, setSelectedEstateId] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Funkcja do pobrania tokena JWT
	const getToken = () => {
		return localStorage.getItem("token"); // lub z AuthContexta
	};

	// Pobieranie managera i osiedli
	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			if (!token) throw new Error("Brak tokena JWT!");

			// 1. Manager
			const managerRes = await fetch("http://localhost:8080/managers/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!managerRes.ok) throw new Error("Błąd pobierania managera");
			const managerData = await managerRes.json();
			setManager(managerData);

			// 2. Osiedla
			const estatesRes = await fetch("http://localhost:8080/estates/all", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!estatesRes.ok) throw new Error("Błąd pobierania osiedli");
			const estatesData = await estatesRes.json();
			setEstates(estatesData);

			// 3. Pobieranie danych zależnych od wybranego osiedla
			if (selectedEstateId) {
				// a) Mieszkańcy
				const residentsRes = await fetch(
					`http://localhost:8080/residents/estate/${selectedEstateId}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				if (!residentsRes.ok) throw new Error("Błąd pobierania mieszkańców");
				const residentsData = await residentsRes.json();
				setResidents(residentsData);

				// b) Zgłoszenia (Tickets)
				const ticketsRes = await fetch(
					`http://localhost:8080/tickets/estate/${selectedEstateId}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				if (!ticketsRes.ok) throw new Error("Błąd pobierania zgłoszeń");
				const ticketsData = await ticketsRes.json();
				setTickets(ticketsData);

				// c) Ogłoszenia
				const announcementsRes = await fetch(
					`http://localhost:8080/announcements/estate/${selectedEstateId}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				if (!announcementsRes.ok) throw new Error("Błąd pobierania ogłoszeń");
				const announcementsData = await announcementsRes.json();
				setAnnouncements(announcementsData);
			} else {
				setResidents([]);
				setTickets([]);
				setAnnouncements([]);
			}
		} catch (err: any) {
			setError(err.message || "Błąd ładowania danych");
		} finally {
			setLoading(false);
		}
	}, [selectedEstateId]);

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line
	}, [selectedEstateId]);

	const reload = () => fetchData();

	return (
		<EstateContext.Provider
			value={{
				manager,
				estates,
				residents,
				tickets,
				announcements,
				selectedEstateId,
				setSelectedEstateId,
				loading,
				error,
				reload,
			}}>
			{children}
		</EstateContext.Provider>
	);
};

export const useEstates = () => useContext(EstateContext);
