"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	ReactNode,
} from "react";

// =======================
//      TYPY DANYCH
// =======================

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

// =======================
//     KONTEXT
// =======================

type MainContextType = {
	manager: Manager | null;
	organisations: Organisation[];
	selectedOrganisationId: string | null;
	setSelectedOrganisationId: (id: string | null) => void;
	selectedEstateId: string | null;
	setSelectedEstateId: (id: string | null) => void;
	loading: boolean;
	logout: () => void;
	error: string | null;
	reload: () => void;
	forceReload: () => void;
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
	tickets: Ticket[];
	payments: Payment[];
	balances: Balance[];
	documents: EstateDocument[];
	garbageCalendars: GarbageCalendar[];
	flatResidents: FlatResident[];
	importPaymentsFile: (file: File) => Promise<void>;
	importBalancesFile: (file: File) => Promise<void>;
	updatePayment: (id: string, data: Partial<Payment>) => Promise<void>;
	updateBalance: (id: string, data: Partial<Balance>) => Promise<void>;
	token: string | null;
	login: (token: string) => void;
};

const MainContext = createContext<MainContextType>({
	manager: null,
	organisations: [],
	selectedOrganisationId: null,
	setSelectedOrganisationId: () => {},
	selectedEstateId: null,
	setSelectedEstateId: () => {},
	loading: false,
	logout: () => {},
	error: null,
	reload: () => {},
	forceReload: () => {},
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
	token: null,
	login: () => {},
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const MainProvider = ({ children }: { children: ReactNode }) => {
	// ========================
	//  TOKEN + STANY
	// ========================
	const getToken = () =>
		typeof window !== "undefined" ? localStorage.getItem("token") : null;

	const [token, setToken] = useState<string | null>(getToken());
	useEffect(() => {
		console.log("[EC] Stan tokena (useState):", token);
	}, [token]);

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

	// ==========================
	// Synchronizacja tokena
	// ==========================
	useEffect(() => {
		const syncToken = () => {
			const localToken = getToken();
			console.log("[EC] [storage] token w localStorage:", localToken);
			if (localToken !== token) {
				setToken(localToken);
				clearAll();
			}
		};
		window.addEventListener("storage", syncToken);
		return () => window.removeEventListener("storage", syncToken);
		// eslint-disable-next-line
	}, [token]);

	// ==========================
	// LOGIN / LOGOUT / CLEAR
	// ==========================
	const login = (newToken: string) => {
		console.log("[EC] login() ustawia token:", newToken);
		localStorage.setItem("token", newToken);
		setToken(newToken);
		clearAll();
	};

	const logout = () => {
		console.log("[EC] logout – kasuję token i stany");
		localStorage.removeItem("token");
		localStorage.removeItem("selectedOrganisationId");
		localStorage.removeItem("selectedEstateId");
		setToken(null);
		clearAll();
	};

	const clearAll = useCallback(() => {
		console.log("[EC] clearAll – czyszczę wszystkie stany kontekstu");
		setManager(null);
		setOrganisations([]);
		setSelectedOrganisationId(null);
		setSelectedEstateId(null);
		setTickets([]);
		setPayments([]);
		setBalances([]);
		setDocuments([]);
		setGarbageCalendars([]);
		setFlatResidents([]);
		setError(null);
	}, []);

	// ==========================
	// FORCE RELOAD / RELOAD
	// ==========================
	const [forceReloadKey, setForceReloadKey] = useState(0);
	const forceReload = () => {
		console.log("[EC] forceReload!");
		setForceReloadKey(k => k + 1);
	};
	const reload = () => {
		console.log("[EC] reload() – ponowne pobranie danych");
		setToken(getToken());
	};

	// ==========================
	// GŁÓWNY FETCH (TOKEN/RELOAD)
	// ==========================
	useEffect(() => {
		console.log("[EC] useEffect token/forceReloadKey:", {
			token,
			forceReloadKey,
		});
		clearAll();
		if (!token) {
			setLoading(false);
			return;
		}
		const fetchData = async () => {
			setLoading(true);
			try {
				// MANAGER
				console.log("[EC] Fetch manager z tokenem:", token);
				const mgrRes = await fetch(`${API_URL}/managers/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!mgrRes.ok) throw new Error("Błąd autoryzacji managera");
				const mgr = await mgrRes.json();
				setManager(mgr);
				console.log("[EC] Ustawiam managera:", mgr);

				// ORGANISATIONS (tylko managera!)
				const orgRes = await fetch(`${API_URL}/organisations/my`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const orgs: Organisation[] = orgRes.ok ? await orgRes.json() : [];
				setOrganisations(orgs);
				console.log("[EC] Ustawiam organisations (tylko moje!):", orgs);

				// WYBÓR PIERWSZEGO
				if (orgs.length > 0) {
					setSelectedOrganisationId(orgs[0]._id);
					if (orgs[0].estates?.length > 0) {
						setSelectedEstateId(orgs[0].estates[0]._id);
						console.log(
							"[EC] Ustawiam selectedEstateId:",
							orgs[0].estates[0]._id
						);
					} else {
						setSelectedEstateId(null);
						console.log("[EC] Brak osiedli w pierwszej org");
					}
				}

				// TICKETS
				const tr = await fetch(`${API_URL}/tickets`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const ticketsData = tr.ok ? await tr.json() : [];
				setTickets(ticketsData);
				console.log("[EC] Tickets:", ticketsData);
			} catch (e: any) {
				setError(e.message || "Błąd ładowania danych");
				clearAll();
			} finally {
				setLoading(false);
			}
		};
		fetchData();
		// eslint-disable-next-line
	}, [token, forceReloadKey, clearAll]);

	// ==========================
	// FETCH ESTATE DATA
	// ==========================
	useEffect(() => {
		if (!token || !selectedEstateId) {
			setPayments([]);
			setBalances([]);
			setDocuments([]);
			setGarbageCalendars([]);
			setFlatResidents([]);
			console.log("[EC] estateId/token nie ma, czyścimy estate stany");
			return;
		}
		const fetchEstateData = async () => {
			setLoading(true);
			try {
				console.log(
					"[EC] Fetch estate data dla estateId:",
					selectedEstateId,
					"token:",
					token
				);
				const [pr, br, dr, gr, rr] = await Promise.all([
					fetch(`${API_URL}/payments/estate/${selectedEstateId}`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					fetch(`${API_URL}/balances/estate/${selectedEstateId}`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					fetch(`${API_URL}/documents?estateId=${selectedEstateId}`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					fetch(`${API_URL}/garbage/estate/${selectedEstateId}`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					fetch(`${API_URL}/flatResidents/estate/${selectedEstateId}`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
				]);
				setPayments(pr.ok ? await pr.json() : []);
				setBalances(br.ok ? await br.json() : []);
				setDocuments(dr.ok ? await dr.json() : []);
				setGarbageCalendars(gr.ok ? await gr.json() : []);
				setFlatResidents(rr.ok ? await rr.json() : []);
				console.log("[EC] Ustawiam estate dane:", {
					payments: pr.ok ? await pr.clone().json() : [],
					balances: br.ok ? await br.clone().json() : [],
					documents: dr.ok ? await dr.clone().json() : [],
					garbageCalendars: gr.ok ? await gr.clone().json() : [],
					flatResidents: rr.ok ? await rr.clone().json() : [],
				});
			} catch (e) {
				setPayments([]);
				setBalances([]);
				setDocuments([]);
				setGarbageCalendars([]);
				setFlatResidents([]);
				console.log("[EC] Błąd estate fetch:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchEstateData();
		// eslint-disable-next-line
	}, [selectedEstateId, token]);

	// ==========================
	// save selection to localStorage
	// ==========================
	useEffect(() => {
		if (selectedOrganisationId) {
			localStorage.setItem("selectedOrganisationId", selectedOrganisationId);
			console.log(
				"[EC] Zapisuję selectedOrganisationId:",
				selectedOrganisationId
			);
		}
	}, [selectedOrganisationId]);
	useEffect(() => {
		if (selectedEstateId) {
			localStorage.setItem("selectedEstateId", selectedEstateId);
			console.log("[EC] Zapisuję selectedEstateId:", selectedEstateId);
		}
	}, [selectedEstateId]);

	// ==========================
	//     DODATKOWE METODY
	// ==========================

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
			forceReload(); // <- NAJWAŻNIEJSZE!
		} catch (e: any) {
			setError(e.message || "Błąd tworzenia organizacji");
		} finally {
			setLoading(false);
		}
	};

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
			forceReload();
		} catch (e: any) {
			setError(e.message || "Błąd tworzenia osiedla");
			setLoading(false); // tylko jeśli błąd
		}
	};

	const getEstateById = (id: string) => {
		for (const org of organisations) {
			const est = org.estates.find(e => e._id === id);
			if (est) return est;
		}
		return undefined;
	};

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
					headers: { Authorization: `Bearer ${token}` },
					body: formData,
				}
			);
			if (!res.ok) throw new Error("Błąd importu pliku z zaliczkami");
			forceReload();
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
					headers: { Authorization: `Bearer ${token}` },
					body: formData,
				}
			);
			if (!res.ok) throw new Error("Błąd importu pliku z saldami");
			forceReload();
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
			forceReload();
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
			forceReload();
		} catch (e: any) {
			setError(e.message || "Błąd zapisu zmian w saldzie");
		} finally {
			setLoading(false);
		}
	};

	// ==========================
	//      PROVIDER
	// ==========================
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
				logout,
				error,
				reload,
				forceReload,
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
				token,
				login,
			}}>
			{children}
		</MainContext.Provider>
	);
};

export const useMain = () => {
	const ctx = useContext(MainContext);
	console.log("[EC] useMain() daje context:", ctx);
	return ctx;
};
