"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import styled from "styled-components";
import { CardOrganization } from "@/components/panelManager/CompanyCard";
import { HelloTop } from "@/components/top/HelloTop";
import SearchBarPanelOrganisation from "@/components/panelManager/SearchBarPanelOrganisation";
import ModalNewOrganisation from "@/components/modal/ModalNewOragnisation";
import { useMain } from "@/context/EstateContext";

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

const MainColumn = styled.div`
	width: 100%;
	min-width: 1300px;
	max-width: 1300px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const TopBar = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

// Boks na środku ekranu (nad całością, tam gdzie modal)
const CenterSuccessBox = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #ffe066;
	color: #232323;
	font-size: 24px;
	font-weight: 700;
	padding: 36px 60px;
	border-radius: 20px;
	box-shadow: 0 0 32px rgba(0, 0, 0, 0.09);
	z-index: 2500;
	text-align: center;
	letter-spacing: 0.5px;
`;

export default function PanelOrganizationPage() {
	const [showModal, setShowModal] = useState(false);
	const [successBoxVisible, setSuccessBoxVisible] = useState(false);

	const {
		organisations,
		selectedOrganisationId,
		setSelectedOrganisationId,
		loading,
		error,
		createOrganisation,
	} = useMain();

	// --- Ładowanie / błąd
	if (loading) return <div>Ładowanie...</div>;
	if (error) return <div style={{ color: "red" }}>{error}</div>;

	// Callback, który przekazujesz do modala
	const handleSuccess = () => {
		setShowModal(false);
		setSuccessBoxVisible(true);
		setTimeout(() => setSuccessBoxVisible(false), 2000); // Box znika po 2s
	};

	return (
		<PageWrapper>
			<SidebarWrapper>
				<Sidebar />
			</SidebarWrapper>
			<PageContent>
				{successBoxVisible && (
					<CenterSuccessBox>
						✅ Organizacja dodana
						<br />
						Dziękujemy!
					</CenterSuccessBox>
				)}
				<MainColumn>
					<TopBar style={{ margin: "32px 0 0 0" }}>
						<HelloTop />
					</TopBar>
					{/* Pasek wyszukiwania i dodawania */}
					<SearchBarPanelOrganisation
						onAddClick={() => setShowModal(true)}
						onSearch={() => {}} // Dodaj obsługę jeśli chcesz
					/>

					<ModalNewOrganisation
						open={showModal}
						onClose={() => setShowModal(false)}
						createOrganisation={createOrganisation}
						onSuccess={handleSuccess}
					/>

					{/* Lista organizacji */}
					{organisations.length === 0 && (
						<div style={{ marginTop: 40, textAlign: "center", color: "#777" }}>
							Brak organizacji. Dodaj pierwszą firmę!
						</div>
					)}
					{organisations.map(org => (
						<div key={org._id} style={{ marginTop: 6 }}>
							<CardOrganization
								org={{
									id: org._id,
									name: org.companyName,
									address: `${org.address.street} ${org.address.buildingNumber}, ${org.address.zipCode} ${org.address.city}`,
									registrationDate: org.createdAt
										? org.createdAt.slice(0, 10).split("-").reverse().join(".")
										: "",
									estatesCount: org.estates?.length ?? 0,
									residentsCount:
										org.estates?.reduce(
											(sum, e) => sum + (e.numberOfFlats || 0),
											0
										) ?? 0,
								}}
								onSelect={() => setSelectedOrganisationId(org._id)}
								isSelected={selectedOrganisationId === org._id}
							/>
						</div>
					))}
				</MainColumn>
			</PageContent>
		</PageWrapper>
	);
}
