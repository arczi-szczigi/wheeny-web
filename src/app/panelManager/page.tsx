// src/app/panelManager/page.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import styled from "styled-components";
import { CardOrganization } from "@/components/panelManager/CompanyCard";
import { HelloTop } from "@/components/top/HelloTop";
import SearchBarPanelOrganisation, { FilterStatus, SortValue } from "@/components/panelManager/SearchBarPanelOrganisation";
import ModalNewOrganisation, {
	NewOrgPayload,
} from "@/components/modal/ModalNewOragnisation";
import ModalEditOrganisation from "@/components/modal/ModalEditOrganisation";
import { useMain, Organisation } from "@/context/EstateContext";
import { useToastContext } from "@/components/toast/ToastContext";

// === STYLE ===
const PageWrapper = styled.div`
	display: flex;
	height: 100vh;
	width: 100vw;
	background: #e7e7e7;
`;
const SidebarWrapper = styled.div`
	flex-shrink: 0;
	height: 100vh;
	display: flex;
	flex-direction: column;
`;
const PageContent = styled.div`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #e7e7e7;
	height: 100vh;
	overflow-y: auto;
	position: relative;
`;
const StickyHeaderWrapper = styled.div`
	position: sticky;
	top: 0;
	width: 100%;
	z-index: 15;
	background: #e7e7e7;
	box-shadow: 0 6px 16px -12px #0002;
	transition: box-shadow 0.2s;
`;
const StickyInner = styled.div`
	max-width: 1300px;
	width: 100%;
	margin: 0 auto;
	padding: 28px 0 2px;
	background: #e7e7e7;
	display: flex;
	flex-direction: column;
`;
const StickySpacer = styled.div`
	height: 20px;
	width: 100%;
	background: transparent;
`;
const TopLine = styled.hr`
	width: 100%;
	border: none;
	border-bottom: 1.5px solid #dadada;
	margin: 18px 0 24px;
`;
const MainColumn = styled.div`
	width: 100%;
	max-width: 1300px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
`;
const CardsWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	padding-bottom: 30px;
`;

// === FILTR INFO BAR ===
const InfoBar = styled.div`
	margin: 16px 0 0 8px;
	font-size: 13px;
	color: #666;
	display: flex;
	gap: 18px;
`;

// ==== PAGE LOGIC ====
export default function PanelOrganizationPage() {
	const [showNewModal, setShowNewModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingOrg, setEditingOrg] = useState<Organisation | null>(null);

	// --- SEARCH / FILTER / SORT STATE ---
	const [searchValue, setSearchValue] = useState("");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
	const [sortValue, setSortValue] = useState<SortValue>("az");

	const {
		organisations,
		selectedOrganisationId,
		setSelectedOrganisationId,
		loading,
		createOrganisation: contextCreateOrg,
		deleteOrganisation,
	} = useMain();

	const { showToast } = useToastContext();

	// --- FILTER/SORT/SEARCH LOGIC ---
	const filteredOrganisations = organisations
		.filter(org => {
			const s = searchValue.trim().toLowerCase();
			if (!s) return true;
			const fields = [
				org.companyName,
				org.address?.city,
				org.address?.street,
				org.address?.zipCode,
				org.address?.buildingNumber,
				org.email,
			]
				.filter(Boolean)
				.map(val => String(val).toLowerCase());

			return fields.some(field => field.includes(s));
		})
		.filter(org => {
			if (filterStatus === "all") return true;
			return org.accountStatus === filterStatus;
		})
		.sort((a, b) => {
			switch (sortValue) {
				case "az":
					return a.companyName.localeCompare(b.companyName, "pl");
				case "za":
					return b.companyName.localeCompare(a.companyName, "pl");
				case "newest":
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case "oldest":
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case "mostEstates":
					return (b.estates?.length ?? 0) - (a.estates?.length ?? 0);
				case "leastEstates":
					return (a.estates?.length ?? 0) - (b.estates?.length ?? 0);
				default:
					return 0;
			}
		});

	// Usuń organizację
	const handleDeleteOrg = (orgId: string, orgName: string) => {
		showToast({
			type: "confirm",
			message: `Czy na pewno chcesz usunąć organizację „${orgName}"?`,
			onConfirm: async () => {
				try {
					await deleteOrganisation(orgId);
					showToast({ type: "success", message: "Organizacja usunięta." });
				} catch (err: any) {
					showToast({
						type: "error",
						message: err.message || "Błąd usuwania.",
					});
				}
			},
			onCancel: () => {
				showToast({
					type: "success",
					message: "Anulowano usuwanie organizacji.",
				});
			},
		});
	};

	// Edytuj organizację
	const handleEditOrg = (org: Organisation) => {
		setEditingOrg(org);
		setShowEditModal(true);
	};

	// --- HANDLERS ---
	const handleSearch = (val: string) => setSearchValue(val);
	const handleFilterChange = (val: FilterStatus) => setFilterStatus(val);
	const handleSortChange = (val: SortValue) => setSortValue(val);

	if (loading) {
		return (
			<div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
				Ładowanie...
			</div>
		);
	}

	return (
		<PageWrapper>
			<SidebarWrapper>
				<Sidebar />
			</SidebarWrapper>
			<PageContent>
				<StickyHeaderWrapper>
					<StickyInner>
						<HelloTop />
						<TopLine />
						<SearchBarPanelOrganisation
							onAddClick={() => setShowNewModal(true)}
							onSearch={handleSearch}
							onFilterChange={handleFilterChange}
							onSortChange={handleSortChange}
							filterValue={filterStatus}
							sortValue={sortValue}
							placeholder='Wyszukaj organizację po nazwie, mieście lub ulicy'
						/>
						<InfoBar>
							<span>
								Filtr:{" "}
								<b>
									{
										{
											all: "Wszystkie",
											confirmed: "Potwierdzone",
											unconfirmed: "Niepotwierdzone",
										}[filterStatus]
									}
								</b>
							</span>
							<span>
								Sort: <b>
									{
										{
											az: "A-Z",
											za: "Z-A",
											newest: "Najnowsze",
											oldest: "Najstarsze",
											mostEstates: "Najwięcej osiedli",
											leastEstates: "Najmniej osiedli",
										}[sortValue]
									}
								</b>
							</span>
							{searchValue && (
								<span>
									Szukasz: <b>{searchValue}</b>
								</span>
							)}
						</InfoBar>
					</StickyInner>
				</StickyHeaderWrapper>
				<StickySpacer />

				<MainColumn>
					{/* Modal tworzenia */}
					<ModalNewOrganisation
						open={showNewModal}
						onClose={() => setShowNewModal(false)}
						createOrganisation={async (p: NewOrgPayload) => {
							try {
								await contextCreateOrg({
									companyName: p.companyName,
									email: p.email,
									phone: p.phone,
									accountStatus: "unconfirmed",
									manager: p.manager,
									address: {
										city: p.city,
										zipCode: p.zipCode,
										street: p.street,
										buildingNumber: p.buildingNumber,
									},
								});
								setShowNewModal(false);
								showToast({
									type: "success",
									message: "Organizacja została dodana.",
								});
							} catch (err: any) {
								setShowNewModal(false);
								showToast({
									type: "error",
									message: err.message || "Błąd dodawania.",
								});
							}
						}}
					/>

					{/* Modal edycji */}
					{editingOrg && (
						<ModalEditOrganisation
							open={showEditModal}
							onClose={() => setShowEditModal(false)}
							organisation={editingOrg}
						/>
					)}

					<CardsWrapper>
						{filteredOrganisations.length === 0 && (
							<div
								style={{
									marginTop: 40,
									textAlign: "center",
									color: "#777",
									fontSize: 18,
								}}>
								{searchValue || filterStatus !== "all" 
									? "Brak organizacji spełniających kryteria."
									: "Brak organizacji. Dodaj pierwszą firmę!"
								}
							</div>
						)}
						{filteredOrganisations.map(org => (
							<div
								key={org._id}
								style={{
									width: "100%",
									display: "flex",
									justifyContent: "center",
								}}>
								<CardOrganization
									org={{
										id: org._id,
										name: org.companyName,
										address: `${org.address.street} ${org.address.buildingNumber}, ${org.address.zipCode} ${org.address.city}`,
										registrationDate: org.createdAt
											? org.createdAt
													.slice(0, 10)
													.split("-")
													.reverse()
													.join(".")
											: "",
										estatesCount: org.estates?.length ?? 0,
										residentsCount:
											org.estates?.reduce(
												(sum, e) => sum + (e.numberOfFlats || 0),
												0
											) ?? 0,
									}}
									isSelected={selectedOrganisationId === org._id}
									onSelect={() => setSelectedOrganisationId(org._id)}
									onDeleteClick={() =>
										handleDeleteOrg(org._id, org.companyName)
									}
									onEditClick={() => handleEditOrg(org)}
								/>
							</div>
						))}
					</CardsWrapper>
				</MainColumn>
			</PageContent>
		</PageWrapper>
	);
}
