"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar";
import { HelloTop } from "../../components/top/HelloTop";
import TopPanelChooseEstate from "../../components/panelEstate/TopPanelChooseEstate";
import SearchBarPanelEstate from "../../components/panelEstate/SearchBarPanelEstate";
import { CardEstate } from "../../components/allEstates/CardEstate";
import { useMain } from "@/context/EstateContext";
import { useToastContext } from "@/components/toast/ToastContext";
import type { Estate } from "@/context/EstateContext";
import AddEstateModal from "@/components/modal/AddEstateModal";

// --- STYLES ---
const PageContainer = styled.div`
	display: grid;
	grid-template-columns: 260px 1fr;
	height: 100vh;
	width: 100%;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	background: #e7e7e7;
	padding: 42px 40px 0 64px;
	gap: 32px;
	overflow-y: auto;
	align-items: center;
`;

const MainColumn = styled.div`
	width: 100%;
	min-width: 1300px;
	max-width: 1300px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const StickyHeader = styled.div`
	position: sticky;
	top: 0;
	z-index: 110;
	width: 100%;
	background: #e7e7e7;
	padding-top: 32px;
	padding-bottom: 8px;
	box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.01);
`;

const EstatesList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
`;

// === FILTR INFO BAR ===
const InfoBar = styled.div`
	display: flex;
	gap: 24px;
	font-size: 13px;
	color: #666;
	margin: 16px 0 0 8px;
`;

type FilterStatus = "all" | "verified" | "unverified" | "verifying";
type SortValue = "az" | "za";

export default function AllEstatePage() {
	const router = useRouter();
	const { showToast } = useToastContext();
	const [modalOpen, setModalOpen] = useState(false);

	// Context – pobranie wybranej organizacji i jej osiedli
	const { organisations, selectedOrganisationId, selectedEstateId, loading, error, updateEstate, deleteEstate, setSelectedEstateId } = useMain();
	const selectedOrg = useMemo(
		() => organisations.find(org => org._id === selectedOrganisationId),
		[organisations, selectedOrganisationId]
	);
	const estates: Estate[] = selectedOrg?.estates || [];

	// --- SEARCH / FILTER / SORT STATE ---
	const [searchValue, setSearchValue] = useState("");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
	const [sortAZ, setSortAZ] = useState<SortValue>("az");

	// --- FILTER/SORT/SEARCH LOGIC ---
	const filteredEstates = useMemo(() => {
		return estates
			.filter(est => {
				const s = searchValue.trim().toLowerCase();
				if (!s) return true;
				const fields = [
					est.name,
					est.address?.city,
					est.address?.street,
					est.address?.zipCode,
					est.address?.buildingNumber,
				]
					.filter(Boolean)
					.map(val => String(val).toLowerCase());

				return fields.some(field => field.includes(s));
			})
			.filter(est => {
				if (filterStatus === "all") return true;
				return est.status === filterStatus;
			})
			.sort((a, b) => {
				const cmp = a.name.localeCompare(b.name, "pl");
				return sortAZ === "az" ? cmp : -cmp;
			});
	}, [estates, searchValue, filterStatus, sortAZ]);

	// --- HANDLERS ---
	const handleEstateSuccess = () => setModalOpen(false);
	
	const handleSearch = (val: string) => setSearchValue(val);
	const handleFilterChange = (val: FilterStatus) => setFilterStatus(val);
	const handleSortChange = (val: SortValue) => setSortAZ(val);

	const handleSelectEstate = (estateId: string) => {
		setSelectedEstateId(estateId);
		router.push("/start");
	};

	const handleEditEstate = async (estateId: string) => {
		setSelectedEstateId(estateId);
		router.push("/estateInfo");
	};

	const handleDeleteEstate = async (estateId: string) => {
		showToast({
			type: "confirm",
			message: "Czy na pewno chcesz usunąć to osiedle?",
			onConfirm: async () => {
				try {
					await deleteEstate(estateId);
					showToast({
						type: "success",
						message: "Osiedle zostało usunięte",
					});
				} catch (error) {
					console.error("Błąd usuwania osiedla:", error);
					showToast({
						type: "error",
						message: "Błąd podczas usuwania osiedla",
					});
				}
			},
			onCancel: () => {
				// Użytkownik anulował
			},
		});
	};

	return (
		<PageContainer>
			<Sidebar />
			<ContentWrapper>
				<MainColumn>
					<StickyHeader>
						<div style={{ marginBottom: 32 }}>
							<HelloTop />
						</div>
						<TopPanelChooseEstate />
						<SearchBarPanelEstate
							onAddClick={() => setModalOpen(true)}
							onSearch={handleSearch}
							onFilterChange={handleFilterChange}
							onSortChange={handleSortChange}
							filterValue={filterStatus}
							sortValue={sortAZ}
							placeholder='Wyszukaj osiedle po nazwie, mieście lub ulicy'
						/>
						<InfoBar>
							<span>
								Filtr:{" "}
								<b>
									{
										{
											all: "Wszystkie",
											verified: "Zweryfikowane",
											unverified: "Niezweryfikowane",
											verifying: "W trakcie weryfikacji",
										}[filterStatus]
									}
								</b>
							</span>
							<span>
								Sort: <b>{sortAZ === "az" ? "A-Z" : "Z-A"}</b>
							</span>
							{searchValue && (
								<span>
									Szukasz: <b>{searchValue}</b>
								</span>
							)}
						</InfoBar>
					</StickyHeader>

					<AddEstateModal
						open={modalOpen}
						onClose={() => setModalOpen(false)}
						onSuccess={handleEstateSuccess}
					/>


					<EstatesList>
						{loading ? (
							<div>Ładowanie osiedli...</div>
						) : error ? (
							<div>Błąd: {error}</div>
						) : filteredEstates.length === 0 ? (
							<div>Brak osiedli spełniających kryteria.</div>
						) : (
							filteredEstates.map(estate => (
								<CardEstate
									key={estate._id}
									estate={{
										id: estate._id,
										name: estate.name,
										city: estate.address?.city ?? "",
										zipCode: estate.address?.zipCode ?? "",
										street: estate.address?.street ?? "",
										buildingNumber: estate.address?.buildingNumber ?? "",
										residentsCount:
											typeof estate.numberOfFlats === "number"
												? estate.numberOfFlats
												: 0,
										newMessages: 0,
										newTickets: 0,
										inProgress: 0,
									}}
									isSelected={selectedEstateId === estate._id}
									onSelect={() => handleSelectEstate(estate._id)}
									onEdit={() => handleEditEstate(estate._id)}
									onDelete={() => handleDeleteEstate(estate._id)}
								/>
							))
						)}
					</EstatesList>
				</MainColumn>
			</ContentWrapper>
		</PageContainer>
	);
}
