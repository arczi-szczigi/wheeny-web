// context/EstateContext.tsx

"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";

// ===== TYPY DANYCH =====
export type Address = {
	city: string;
	zipCode: string;
	street: string;
	buildingNumber: string;
	_id?: string;
};

export type Estate = {
	_id: string;
	name: string;
	address: Address;
	bankAccountNumber: string;
	rentDueDate: string;
	numberOfFlats: number;
	organisation: string;
	createdAt: string;
	updatedAt: string;
};

export type Organisation = {
	_id: string;
	companyName: string;
	address: Address;
	email: string;
	phone: string;
	accountStatus: "unconfirmed" | "confirmed";
	estates: Estate[];
	manager: string;
	createdAt: string;
	updatedAt: string;
};

export type Manager = {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
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

export type TicketCounts = {
	open: number;
	in_progress: number;
	closed: number;
	total: number;
};

export type TicketsSummary = {
	byEstate: Record<string, TicketCounts>;
	global: TicketCounts;
};

export type Payment = {
	_id: string;
	estateId: string;
	flatNumber: string;
	amount: number;
	bankAccount: string;
};

export type Balance = {
	_id: string;
	estateId: string;
	flatNumber: string;
	amount: number;
};

export type FlatResident = {
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
	__v?: number;
};

export type GarbageCalendar = {
	_id: string;
	estateId: string;
	year: number;
	dates: string[];
};

export type EstateDocument = {
	_id: string;
	title: string;
	filename: string;
	originalName: string;
	mimetype: string;
	size: number;
	estate: string;
	createdAt: string;
	updatedAt: string;
};

// ===== KONTEXT =====

type MainContextType = {
	manager: Manager | null;
	organisations: Organisation[];
	selectedOrganisationId: string | null;
	setSelectedOrganisationId: (id: string | null) => void;
	selectedEstateId: string | null;
	setSelectedEstateId: (id: string | null) => void;
	loading: boolean;
	error: string | null;
	reload: () => void;
	createOrganisation: (
		data: Omit<
			Organisation,
			"_id" | "estates" | "createdAt" | "updatedAt" | "manager"
		>
	) => Promise<void>;
	createEstate: (
		data: Omit<Estate, "_id" | "createdAt" | "updatedAt"> & {
			organisation: string;
		}
	) => Promise<void>;
	getEstateById: (id: string) => Estate | undefined;

	// TICKETS!
	tickets: Ticket[];
	// Płatności, salda, DOKUMENTY
	payments: Payment[];
	balances: Balance[];
	documents: EstateDocument[];
	garbageCalendars: GarbageCalendar[];
	flatResidents: FlatResident[];

	// NOWE FUNKCJE!
	importPaymentsFile: (file: File) => Promise<void>;
	importBalancesFile: (file: File) => Promise<void>;
	updatePayment: (id: string, data: Partial<Payment>) => Promise<void>;
	updateBalance: (id: string, data: Partial<Balance>) => Promise<void>;
};

const MainContext = createContext<MainContextType>({
	manager: null,
	organisations: [],
	selectedOrganisationId: null,
	setSelectedOrganisationId: () => {},
	selectedEstateId: null,
	setSelectedEstateId: () => {},
	loading: false,
	error: null,
	reload: () => {},
	createOrganisation: async () => {},
	createEstate: async () => {},
	getEstateById: () => undefined,
	tickets: [],
	payments: [],
	balances: [],
	documents: [],
	garbageCalendars: [],
	flatResidents: [],
	importPaymentsFile: async () => {},
	importBalancesFile: async () => {},
	updatePayment: async () => {},
	updateBalance: async () => {},
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [manager, setManager] = useState<Manager | null>(null);
	const [organisations, setOrganisations] = useState<Organisation[]>([]);
	const [selectedOrganisationId, setSelectedOrganisationId] = useState<
		string | null
	>(null);
	const [selectedEstateId, setSelectedEstateId] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [balances, setBalances] = useState<Balance[]>([]);
	const [documents, setDocuments] = useState<EstateDocument[]>([]);
	const [garbageCalendars, setGarbageCalendars] = useState<GarbageCalendar[]>(
		[]
	);
	const [flatResidents, setFlatResidents] = useState<FlatResident[]>([]);

	// ======= Pomocnicze =======
	const getToken = () =>
		typeof window !== "undefined" ? localStorage.getItem("token") : null;

	// ---- Wybor org/osiedla z localStorage ----
	useEffect(() => {
		const orgId =
			typeof window !== "undefined"
				? localStorage.getItem("selectedOrganisationId")
				: null;
		if (orgId) setSelectedOrganisationId(orgId);
		const estateId =
			typeof window !== "undefined"
				? localStorage.getItem("selectedEstateId")
				: null;
		if (estateId) setSelectedEstateId(estateId);
	}, []);

	useEffect(() => {
		if (selectedOrganisationId && typeof window !== "undefined") {
			localStorage.setItem("selectedOrganisationId", selectedOrganisationId);
		}
	}, [selectedOrganisationId]);

	useEffect(() => {
		if (selectedEstateId && typeof window !== "undefined") {
			localStorage.setItem("selectedEstateId", selectedEstateId);
		}
	}, [selectedEstateId]);

	// ====== Pobieranie danych ======
	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			if (!token) throw new Error("Brak tokena JWT!");

			// --- Manager
			try {
				const res = await fetch(`${API_URL}/managers/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.ok) {
					setManager(await res.json());
				}
			} catch {
				setManager(null);
			}

			// --- Organizacje (z osiedlami)
			const orgRes = await fetch(`${API_URL}/organisations`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!orgRes.ok) throw new Error("Błąd pobierania organizacji");
			const orgs: Organisation[] = await orgRes.json();
			setOrganisations(orgs);

			// --- TICKETS
			try {
				const ticketsRes = await fetch(`${API_URL}/tickets`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (ticketsRes.ok) {
					setTickets(await ticketsRes.json());
				} else {
					setTickets([]);
				}
			} catch {
				setTickets([]);
			}

			// --- PAYMENTS (POPRWAIONE NA /payments/estate/:id)
			if (selectedEstateId) {
				try {
					const paymentsRes = await fetch(
						`${API_URL}/payments/estate/${selectedEstateId}`,
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					if (paymentsRes.ok) {
						setPayments(await paymentsRes.json());
					} else {
						setPayments([]);
					}
				} catch {
					setPayments([]);
				}
			} else {
				setPayments([]);
			}

			// --- BALANCES (POPRWAIONE NA /balances/estate/:id)
			if (selectedEstateId) {
				try {
					const balancesRes = await fetch(
						`${API_URL}/balances/estate/${selectedEstateId}`,
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					if (balancesRes.ok) {
						setBalances(await balancesRes.json());
					} else {
						setBalances([]);
					}
				} catch {
					setBalances([]);
				}
			} else {
				setBalances([]);
			}

			// --- DOKUMENTY
			if (selectedEstateId) {
				try {
					const docsRes = await fetch(
						`${API_URL}/documents?estateId=${selectedEstateId}`,
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					if (docsRes.ok) {
						setDocuments(await docsRes.json());
					} else {
						setDocuments([]);
					}
				} catch {
					setDocuments([]);
				}
			} else {
				setDocuments([]);
			}

			// --- GARBAGE KALENDARZE
			if (selectedEstateId) {
				try {
					const garbageRes = await fetch(
						`${API_URL}/garbage/estate/${selectedEstateId}`,
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					if (garbageRes.ok) {
						setGarbageCalendars(await garbageRes.json());
					} else {
						setGarbageCalendars([]);
					}
				} catch {
					setGarbageCalendars([]);
				}
			} else {
				setGarbageCalendars([]);
			}

			// --- MIESZKAŃCY
			if (selectedEstateId) {
				try {
					const residentsRes = await fetch(
						`${API_URL}/residents?estateId=${selectedEstateId}`,
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					if (residentsRes.ok) {
						setFlatResidents(await residentsRes.json());
					} else {
						setFlatResidents([]);
					}
				} catch {
					setFlatResidents([]);
				}
			} else {
				setFlatResidents([]);
			}

			// --- Automatyczny wybór pierwszej organizacji & osiedla
			if (!selectedOrganisationId && orgs.length > 0) {
				setSelectedOrganisationId(orgs[0]._id);
			}
			if (
				(!selectedEstateId ||
					!orgs.some(org =>
						org.estates.some(e => e._id === selectedEstateId)
					)) &&
				orgs.length > 0 &&
				orgs[0].estates.length > 0
			) {
				setSelectedEstateId(orgs[0].estates[0]._id);
			}
		} catch (e: any) {
			setError(e.message || "Błąd ładowania danych");
		} finally {
			setLoading(false);
		}
	}, [selectedOrganisationId, selectedEstateId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const reload = () => fetchData();

	// ======= Tworzenie organizacji =======
	const createOrganisation = async (
		data: Omit<
			Organisation,
			"_id" | "estates" | "createdAt" | "updatedAt" | "manager"
		>
	) => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			if (!token) throw new Error("Brak tokena JWT!");
			const res = await fetch(`${API_URL}/organisations`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Błąd tworzenia organizacji");
			await fetchData();
		} catch (e: any) {
			setError(e.message || "Błąd tworzenia organizacji");
		} finally {
			setLoading(false);
		}
	};

	// ======= Tworzenie osiedla =======
	const createEstate = async (
		data: Omit<Estate, "_id" | "createdAt" | "updatedAt"> & {
			organisation: string;
		}
	) => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			if (!token) throw new Error("Brak tokena JWT!");
			const res = await fetch(`${API_URL}/estates`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Błąd tworzenia osiedla");
			await fetchData();
		} catch (e: any) {
			setError(e.message || "Błąd tworzenia osiedla");
		} finally {
			setLoading(false);
		}
	};

	const getEstateById = (id: string) => {
		for (const org of organisations) {
			const estate = org.estates.find(e => e._id === id);
			if (estate) return estate;
		}
		return undefined;
	};

	// ============ NOWE FUNKCJE: import & update payments/balances ============

	const importPaymentsFile = async (file: File) => {
		if (!selectedEstateId) {
			setError("Wybierz osiedle!");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			if (!token) throw new Error("Brak tokena JWT!");

			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch(
				`${API_URL}/payments/import/${selectedEstateId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			if (!res.ok) throw new Error("Błąd importu pliku z zaliczkami");

			await fetchData();
		} catch (e: any) {
			setError(e.message || "Błąd importu pliku z zaliczkami");
		} finally {
			setLoading(false);
		}
	};

	const importBalancesFile = async (file: File) => {
		if (!selectedEstateId) {
			setError("Wybierz osiedle!");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			if (!token) throw new Error("Brak tokena JWT!");

			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch(
				`${API_URL}/balances/import/${selectedEstateId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			if (!res.ok) throw new Error("Błąd importu pliku z saldami");

			await fetchData();
		} catch (e: any) {
			setError(e.message || "Błąd importu pliku z saldami");
		} finally {
			setLoading(false);
		}
	};

	const updatePayment = async (id: string, data: Partial<Payment>) => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			if (!token) throw new Error("Brak tokena JWT!");
			const res = await fetch(`${API_URL}/payments/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Błąd zapisu zmian w zaliczce");

			await fetchData();
		} catch (e: any) {
			setError(e.message || "Błąd zapisu zmian w zaliczce");
		} finally {
			setLoading(false);
		}
	};

	const updateBalance = async (id: string, data: Partial<Balance>) => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			if (!token) throw new Error("Brak tokena JWT!");
			const res = await fetch(`${API_URL}/balance/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Błąd zapisu zmian w saldzie");

			await fetchData();
		} catch (e: any) {
			setError(e.message || "Błąd zapisu zmian w saldzie");
		} finally {
			setLoading(false);
		}
	};

	// ===== RETURN PROVIDER =====
	return (
		<MainContext.Provider
			value={{
				manager,
				organisations,
				selectedOrganisationId,
				setSelectedOrganisationId,
				selectedEstateId,
				setSelectedEstateId,
				loading,
				error,
				reload,
				createOrganisation,
				createEstate,
				getEstateById,
				tickets,
				payments,
				balances,
				documents,
				garbageCalendars,
				flatResidents,
				importPaymentsFile,
				importBalancesFile,
				updatePayment,
				updateBalance,
			}}>
			{children}
		</MainContext.Provider>
	);
};

// HOOK
export const useMain = () => useContext(MainContext);
