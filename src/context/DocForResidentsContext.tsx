"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type DocumentFile = {
	_id: string;
	title: string;
	filename: string;
	originalName: string;
	mimetype: string;
	size: number;
	estate: string;
	resident?: string;
	batchId?: string;
	createdAt?: string;
	updatedAt?: string;
};

// ==============================
//   Typy dla kontekstu
// ==============================
type DocForResidentsContextType = {
	// Stare pole
	documents: DocumentFile[];
	// Nowe - oddzielne listy
	estateDocuments: DocumentFile[];
	residentDocuments: DocumentFile[];
	loading: boolean;
	error: string | null;

	// --- Pobrania list
	fetchEstateDocuments: (estateId: string) => Promise<void>;
	fetchResidentDocuments: (residentId: string) => Promise<void>;
	fetchResidentAndEstateDocuments: (
		estateId: string,
		residentId: string
	) => Promise<void>;

	// Nowe:
	fetchResidentDocumentsForEstate: (estateId: string) => Promise<void>;

	// --- Upload
	uploadDocument: (data: {
		file: File;
		estateId: string;
		title: string;
		residentId?: string;
		batchId?: string;
	}) => Promise<void>;
	uploadEstateDocument: (data: {
		file: File;
		estateId: string;
		title: string;
	}) => Promise<void>;
	uploadResidentDocument: (data: {
		file: File;
		estateId: string;
		title: string;
		residentId: string;
	}) => Promise<void>;

	// --- Download
	downloadDocument: (id: string) => Promise<void>;

	// --- Usuwanie
	deleteDocument: (id: string, type?: "estate" | "resident") => Promise<void>;
	deleteBatch: (batchId: string) => Promise<void>;

	// --- Przypisz istniejący dokument do mieszkańca
	assignToResident: (docId: string, residentId: string) => Promise<void>;
};

const DocForResidentsContext = createContext<DocForResidentsContextType>({
	documents: [],
	estateDocuments: [],
	residentDocuments: [],
	loading: false,
	error: null,
	fetchEstateDocuments: async () => {},
	fetchResidentDocuments: async () => {},
	fetchResidentAndEstateDocuments: async () => {},
	fetchResidentDocumentsForEstate: async () => {},
	uploadDocument: async () => {},
	uploadEstateDocument: async () => {},
	uploadResidentDocument: async () => {},
	downloadDocument: async () => {},
	deleteDocument: async () => {},
	deleteBatch: async () => {},
	assignToResident: async () => {},
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const DocForResidentsProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	// Jeden "stary" state (do fetchEstateDocuments/fetchResidentDocuments/fetchResidentAndEstateDocuments)
	const [documents, setDocuments] = useState<DocumentFile[]>([]);
	// Oddzielnie dla trybu rozdzielonego:
	const [estateDocuments, setEstateDocuments] = useState<DocumentFile[]>([]);
	const [residentDocuments, setResidentDocuments] = useState<DocumentFile[]>(
		[]
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// =========================
	//  FETCH DOKUMENTY (STARY MODEL)
	// =========================

	// Tylko osiedlowe (dla wszystkich)
	const fetchEstateDocuments = useCallback(async (estateId: string) => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${API_URL}/documents/estate/${estateId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Błąd pobierania dokumentów dla osiedla!");
			const data = await res.json();
			setDocuments(data || []);
			setEstateDocuments(data || []);
		} catch (e: any) {
			setError(e.message || "Błąd pobierania dokumentów osiedla");
			setDocuments([]);
			setEstateDocuments([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// Tylko przypisane do mieszkańca (prywatne, stare API)
	const fetchResidentDocuments = useCallback(async (residentId: string) => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${API_URL}/documents/resident/${residentId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Błąd pobierania dokumentów mieszkańca!");
			const data = await res.json();
			setDocuments(data || []);
			setResidentDocuments(data || []);
		} catch (e: any) {
			setError(e.message || "Błąd pobierania dokumentów mieszkańca");
			setDocuments([]);
			setResidentDocuments([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// Dokumenty dla mieszkańca – dostępne globalne + jego własne (stare API)
	const fetchResidentAndEstateDocuments = useCallback(
		async (estateId: string, residentId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(
					`${API_URL}/documents/estate/${estateId}/resident/${residentId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				if (!res.ok)
					throw new Error("Błąd pobierania wszystkich dokumentów mieszkańca!");
				const data = await res.json();
				setDocuments(data || []);
				// Możesz rozbić tu na 2 osobne stany jeśli struktura pozwala
			} catch (e: any) {
				setError(
					e.message || "Błąd pobierania wszystkich dokumentów mieszkańca"
				);
				setDocuments([]);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// NOWE: Dla całego osiedla — lista wszystkich dokumentów mieszkańców tego osiedla
	const fetchResidentDocumentsForEstate = useCallback(
		async (estateId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${API_URL}/documents/residents/${estateId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Błąd pobierania dokumentów mieszkańców!");
				const data = await res.json();
				setResidentDocuments(data || []);
			} catch (e: any) {
				setError(e.message || "Błąd pobierania dokumentów mieszkańców");
				setResidentDocuments([]);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// =========================
	//  UPLOAD DOKUMENTU (STARY MODEL)
	// =========================
	const uploadDocument = useCallback(
		async ({
			file,
			estateId,
			title,
			residentId,
			batchId,
		}: {
			file: File;
			estateId: string;
			title: string;
			residentId?: string;
			batchId?: string;
		}) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const formData = new FormData();
				formData.append("file", file);
				formData.append("estateId", estateId);
				formData.append("title", title);
				if (residentId) formData.append("residentId", residentId);
				if (batchId) formData.append("batchId", batchId);

				const res = await fetch(`${API_URL}/documents/upload`, {
					method: "POST",
					headers: { Authorization: `Bearer ${token}` },
					body: formData,
				});

				if (!res.ok) {
					const errText = await res.text();
					throw new Error("Błąd uploadu dokumentu: " + errText);
				}

				// Po uploadzie pobierz ponownie dokumenty (np. z ostatniego fetchu)
				if (residentId) {
					await fetchResidentAndEstateDocuments(estateId, residentId);
				} else {
					await fetchEstateDocuments(estateId);
				}
			} catch (e: any) {
				setError(e.message || "Błąd uploadu dokumentu");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchEstateDocuments, fetchResidentAndEstateDocuments]
	);

	// NOWE: UPLOAD OGÓLNY
	const uploadEstateDocument = useCallback(
		async ({
			file,
			estateId,
			title,
		}: {
			file: File;
			estateId: string;
			title: string;
		}) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const formData = new FormData();
				formData.append("file", file);
				formData.append("estateId", estateId);
				formData.append("title", title);

				const res = await fetch(`${API_URL}/documents/upload`, {
					method: "POST",
					headers: { Authorization: `Bearer ${token}` },
					body: formData,
				});

				if (!res.ok) throw new Error("Błąd uploadu dokumentu ogólnego!");

				await fetchEstateDocuments(estateId); // odśwież po wysłaniu!
			} catch (e: any) {
				setError(e.message || "Błąd uploadu dokumentu ogólnego");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchEstateDocuments]
	);

	// NOWE: UPLOAD mieszkańca
	const uploadResidentDocument = useCallback(
		async ({
			file,
			estateId,
			title,
			residentId,
		}: {
			file: File;
			estateId: string;
			title: string;
			residentId: string;
		}) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const formData = new FormData();
				formData.append("file", file);
				formData.append("estateId", estateId);
				formData.append("title", title);
				formData.append("residentId", residentId);

				const res = await fetch(`${API_URL}/documents/upload`, {
					method: "POST",
					headers: { Authorization: `Bearer ${token}` },
					body: formData,
				});

				if (!res.ok) throw new Error("Błąd uploadu dokumentu mieszkańca!");

				await fetchResidentDocumentsForEstate(estateId); // odśwież po wysłaniu!
			} catch (e: any) {
				setError(e.message || "Błąd uploadu dokumentu mieszkańca");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fetchResidentDocumentsForEstate]
	);

	// =========================
	//  DOWNLOAD DOKUMENTU (fizyczny plik)
	// =========================
	const downloadDocument = useCallback(async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${API_URL}/documents/${id}/download`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Błąd pobierania pliku!");

			// Pobierz meta (nazwa pliku)
			const contentDisp = res.headers.get("Content-Disposition");
			let filename = "plik";
			if (contentDisp) {
				const match = contentDisp.match(/filename="?([^"]+)"?/);
				if (match) filename = decodeURIComponent(match[1]);
			}
			const blob = await res.blob();
			// Pobierz plik przez przeglądarkę
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			a.remove();
		} catch (e: any) {
			setError(e.message || "Błąd pobierania pliku");
			throw e;
		} finally {
			setLoading(false);
		}
	}, []);

	// =========================
	//  USUWANIE DOKUMENTU
	// =========================
	const deleteDocument = useCallback(
		async (id: string, type?: "estate" | "resident") => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${API_URL}/documents/${id}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Błąd usuwania dokumentu!");

				// Usuwa z obu tablic naraz
				setDocuments(prev => prev.filter(d => d._id !== id));
				setEstateDocuments(prev => prev.filter(d => d._id !== id));
				setResidentDocuments(prev => prev.filter(d => d._id !== id));
			} catch (e: any) {
				setError(e.message || "Błąd usuwania dokumentu");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// =========================
	//  USUWANIE PACZKI DOKUMENTÓW
	// =========================
	const deleteBatch = useCallback(
		async (batchId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${API_URL}/documents/batch/${batchId}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Błąd usuwania paczki dokumentów!");
			} catch (e: any) {
				setError(e.message || "Błąd usuwania paczki dokumentów");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// =========================
	//  PRZYPISANIE DOKUMENTU DO MIESZKAŃCA (assign)
	// =========================
	const assignToResident = useCallback(
		async (docId: string, residentId: string) => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${API_URL}/documents/${docId}/assign`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ residentId }),
				});
				if (!res.ok) throw new Error("Błąd przypisywania dokumentu!");
				// Po przypisaniu możesz odświeżyć residentDocuments jeśli trzeba
			} catch (e: any) {
				setError(e.message || "Błąd przypisywania dokumentu");
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	return (
		<DocForResidentsContext.Provider
			value={{
				documents,
				estateDocuments,
				residentDocuments,
				loading,
				error,
				fetchEstateDocuments,
				fetchResidentDocuments,
				fetchResidentAndEstateDocuments,
				fetchResidentDocumentsForEstate,
				uploadDocument,
				uploadEstateDocument,
				uploadResidentDocument,
				downloadDocument,
				deleteDocument,
				deleteBatch,
				assignToResident,
			}}>
			{children}
		</DocForResidentsContext.Provider>
	);
};

// Eksport do użycia w komponentach
export const useDocForResidents = () => useContext(DocForResidentsContext);

export default DocForResidentsContext;
