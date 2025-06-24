"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// === OGŁOSZENIA (Announcement) ===
export type Announcement = {
	_id: string;
	title: string;
	content: string;
	publishedAt: string;
	estate?: string;
	estateId?: string;
	createdBy?: string;
	author?: string;
};

// === ODPADY (Garbage) ===
export type GarbageCalendar = {
	_id: string;
	estateId: string;
	year: number;
	dates: string[];
};

// === MIESZKAŃCY (Residents) ===
export type Resident = {
	_id: string;
	estateId: string;
	flatNumber: string;
	name: string;
	email: string;
	phone: string;
	area: number;
	garage: string;
	storage: string;
	appConsent: string;
	[key: string]: any;
};

type AnnouncementContextType = {
	// --- OGŁOSZENIA ---
	announcements: Announcement[];
	loading: boolean;
	error: string | null;
	fetchAnnouncements: (estateId: string) => Promise<void>;
	addAnnouncement: (data: {
		title: string;
		content: string;
		publishedAt: string;
		estateId: string;
	}) => Promise<void>;
	deleteAnnouncement: (id: string, estateId: string) => Promise<void>;
	editAnnouncement: (
		id: string,
		data: Partial<Announcement>,
		estateId: string
	) => Promise<void>;
	// --- ODPADY ---
	garbageCalendars: GarbageCalendar[];
	fetchGarbageCalendars: (estateId: string) => Promise<void>;
	addGarbageCalendar: (data: {
		estateId: string;
		year: number;
		dates: string[];
	}) => Promise<void>;
	editGarbageCalendar: (
		id: string,
		data: Partial<GarbageCalendar>,
		estateId: string
	) => Promise<void>;
	deleteGarbageCalendar: (id: string, estateId: string) => Promise<void>;
	// --- MIESZKAŃCY ---
	residents: Resident[];
	fetchResidents: (estateId: string) => Promise<void>;
	addResidentsFromFile: (estateId: string, file: File) => Promise<void>;
	editResident: (
		id: string,
		data: Partial<Resident>,
		estateId: string
	) => Promise<void>;
	deleteResident: (id: string, estateId: string) => Promise<void>;
};

const AnnouncementContext = createContext<AnnouncementContextType>({
	announcements: [],
	loading: false,
	error: null,
	fetchAnnouncements: async () => {},
	addAnnouncement: async () => {},
	deleteAnnouncement: async () => {},
	editAnnouncement: async () => {},
	garbageCalendars: [],
	fetchGarbageCalendars: async () => {},
	addGarbageCalendar: async () => {},
	editGarbageCalendar: async () => {},
	deleteGarbageCalendar: async () => {},
	// Residents defaults:
	residents: [],
	fetchResidents: async () => {},
	addResidentsFromFile: async () => {},
	editResident: async () => {},
	deleteResident: async () => {},
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// --- Ogłoszenia ---
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// --- Odpady ---
	const [garbageCalendars, setGarbageCalendars] = useState<GarbageCalendar[]>(
		[]
	);
	// --- Mieszkańcy ---
	const [residents, setResidents] = useState<Resident[]>([]);

	// OGŁOSZENIA
	const fetchAnnouncements = useCallback(async (estateId: string) => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			const url = `${API_URL}/announcements/estate/${estateId}`;
			const res = await fetch(url, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Błąd pobierania ogłoszeń!");
			const data = await res.json();
			const mapped = data.map((a: any) => ({
				...a,
				estateId: a.estate,
			}));
			setAnnouncements(mapped);
		} catch (e: any) {
			setError(e.message || "Błąd pobierania ogłoszeń");
			setAnnouncements([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const addAnnouncement = useCallback(
		async (data: {
			title: string;
			content: string;
			publishedAt: string;
			estateId: string;
		}) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Brak tokena JWT!");
				const res = await fetch(`${API_URL}/announcements`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(data),
				});
				if (!res.ok) {
					const errText = await res.text();
					throw new Error("Błąd dodawania ogłoszenia: " + errText);
				}
				await fetchAnnouncements(data.estateId);
			} catch (e: any) {
				setError(e.message || "Błąd dodawania ogłoszenia");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchAnnouncements]
	);

	const deleteAnnouncement = useCallback(
		async (id: string, estateId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Brak tokena JWT!");
				const res = await fetch(`${API_URL}/announcements/${id}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Błąd usuwania ogłoszenia");
				await fetchAnnouncements(estateId);
			} catch (e: any) {
				setError(e.message || "Błąd usuwania ogłoszenia");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchAnnouncements]
	);

	const editAnnouncement = useCallback(
		async (id: string, data: Partial<Announcement>, estateId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Brak tokena JWT!");
				const res = await fetch(`${API_URL}/announcements/${id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(data),
				});
				if (!res.ok) throw new Error("Błąd edycji ogłoszenia");
				await fetchAnnouncements(estateId);
			} catch (e: any) {
				setError(e.message || "Błąd edycji ogłoszenia");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchAnnouncements]
	);

	// =====================
	//     GARBAGE - ODPADY
	// =====================
	const fetchGarbageCalendars = useCallback(async (estateId: string) => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			const url = `${API_URL}/garbage/estate/${estateId}`;
			const res = await fetch(url, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Błąd pobierania harmonogramu odpadów!");
			const data = await res.json();
			setGarbageCalendars(data || []);
		} catch (e: any) {
			setError(e.message || "Błąd pobierania harmonogramu odpadów");
			setGarbageCalendars([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const addGarbageCalendar = useCallback(
		async (data: { estateId: string; year: number; dates: string[] }) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Brak tokena JWT!");
				const res = await fetch(`${API_URL}/garbage`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(data),
				});
				if (!res.ok) {
					const errText = await res.text();
					throw new Error("Błąd dodawania harmonogramu: " + errText);
				}
				await fetchGarbageCalendars(data.estateId);
			} catch (e: any) {
				setError(e.message || "Błąd dodawania harmonogramu odpadów");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchGarbageCalendars]
	);

	const editGarbageCalendar = useCallback(
		async (id: string, data: Partial<GarbageCalendar>, estateId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Brak tokena JWT!");
				const res = await fetch(`${API_URL}/garbage/${id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(data),
				});
				if (!res.ok) throw new Error("Błąd edycji harmonogramu");
				await fetchGarbageCalendars(estateId);
			} catch (e: any) {
				setError(e.message || "Błąd edycji harmonogramu odpadów");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchGarbageCalendars]
	);

	const deleteGarbageCalendar = useCallback(
		async (id: string, estateId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Brak tokena JWT!");
				const res = await fetch(`${API_URL}/garbage/${id}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Błąd usuwania harmonogramu odpadów");
				await fetchGarbageCalendars(estateId);
			} catch (e: any) {
				setError(e.message || "Błąd usuwania harmonogramu odpadów");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchGarbageCalendars]
	);

	// =====================
	//     MIESZKAŃCY
	// =====================

	// AnnouncementContext.tsx
	const fetchResidents = useCallback(async (estateId: string) => {
		setLoading(true);
		setError(null);
		try {
			console.log(">>> FETCHUJĘ residents dla estateId:", estateId);
			const token = localStorage.getItem("token");
			if (!token) throw new Error("Brak tokena JWT!");
			const url = `${API_URL}/flatResidents/estate/${estateId}`;
			console.log(">>> Token:", `Bearer ${token}`);
			console.log(">>> EstateId:", `${estateId}`);
			const res = await fetch(url, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(">>> response.status", res.status);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			console.log(">>> Data:", data);
			setResidents(data || []);
		} catch (e: any) {
			setError(e.message || "Błąd pobierania mieszkańców");
			setResidents([]);
			console.log(">>> BŁĄD POBIERANIA:", e);
		} finally {
			setLoading(false);
		}
	}, []);

	const addResidentsFromFile = useCallback(
		async (estateId: string, file: File) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const url = `${API_URL}/flatResidents/import/${estateId}`;
				const formData = new FormData();
				formData.append("file", file);

				const res = await fetch(url, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				});
				if (!res.ok) {
					const errText = await res.text();
					throw new Error("Błąd importu mieszkańców: " + errText);
				}
				await fetchResidents(estateId);
			} catch (e: any) {
				setError(e.message || "Błąd importu mieszkańców");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchResidents]
	);

	const editResident = useCallback(
		async (id: string, data: Partial<Resident>, estateId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Brak tokena JWT!");
				const url = `${API_URL}/flatResidents/${id}`;
				const res = await fetch(url, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(data),
				});
				if (!res.ok) throw new Error("Błąd edycji mieszkańca");
				await fetchResidents(estateId);
			} catch (e: any) {
				setError(e.message || "Błąd edycji mieszkańca");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchResidents]
	);

	const deleteResident = useCallback(
		async (id: string, estateId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Brak tokena JWT!");
				const url = `${API_URL}/flatResidents/${id}`;
				const res = await fetch(url, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Błąd usuwania mieszkańca");
				await fetchResidents(estateId);
			} catch (e: any) {
				setError(e.message || "Błąd usuwania mieszkańca");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchResidents]
	);

	return (
		<AnnouncementContext.Provider
			value={{
				announcements,
				loading,
				error,
				fetchAnnouncements,
				addAnnouncement,
				deleteAnnouncement,
				editAnnouncement,
				garbageCalendars,
				fetchGarbageCalendars,
				addGarbageCalendar,
				editGarbageCalendar,
				deleteGarbageCalendar,
				residents,
				fetchResidents,
				addResidentsFromFile,
				editResident,
				deleteResident,
			}}>
			{children}
		</AnnouncementContext.Provider>
	);
};

// NAZWY EKSPORTÓW NIEZMIENIONE!
export const useAnnouncement = () => useContext(AnnouncementContext);
