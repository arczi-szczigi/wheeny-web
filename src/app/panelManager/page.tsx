"use client";
import { useEffect, useState } from "react";
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

// --- FINAL STICKY HEADER --- //
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
	padding-top: 28px;
	padding-bottom: 2px;
	background: #e7e7e7;
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const StickySpacer = styled.div`
	height: 20px;
	width: 100%;
	min-height: 20px; // WAŻNE
	display: block; // WAŻNE
	background: transparent;
`;

// --- RESZTA LAYOUTU --- //
const TopLine = styled.hr`
	width: 100%;
	border: none;
	border-bottom: 1.5px solid #dadada;
	margin: 18px 0 24px 0;
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

const LoaderOverlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(255, 255, 255, 0.6);
	z-index: 3500;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(6px);
`;

const Loader = styled.div`
	margin-bottom: 18px;
	width: 48px;
	height: 48px;
	border: 6px solid #ffd100;
	border-top: 6px solid #232323;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

const OverlayText = styled.div`
	font-size: 26px;
	font-weight: 700;
	color: #232323;
	text-align: center;
`;

export default function PanelOrganizationPage() {
	const [showModal, setShowModal] = useState(false);
	const [isCreatingOrganisation, setIsCreatingOrganisation] = useState(false);
	const [minDelayDone, setMinDelayDone] = useState(false);

	const {
		organisations,
		selectedOrganisationId,
		setSelectedOrganisationId,
		loading,
		error,
		createOrganisation,
	} = useMain();

	// Pokazuj overlay minimum 2s
	useEffect(() => {
		let timeout: NodeJS.Timeout | null = null;
		if (isCreatingOrganisation) {
			setMinDelayDone(false);
			timeout = setTimeout(() => setMinDelayDone(true), 2000);
		} else {
			setMinDelayDone(false);
			if (timeout) clearTimeout(timeout);
		}
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [isCreatingOrganisation]);

	// Overlay znika po dodaniu organizacji I po min. 2 sekundach
	useEffect(() => {
		if (isCreatingOrganisation && organisations.length > 0 && minDelayDone) {
			setIsCreatingOrganisation(false);
		}
	}, [organisations.length, isCreatingOrganisation, minDelayDone]);

	const handleSuccess = () => {
		setShowModal(false);
		setIsCreatingOrganisation(true);
	};

	// --- Ładowanie / błąd
	if (loading) return <div>Ładowanie...</div>;
	if (error) return <div style={{ color: "red" }}>{error}</div>;

	return (
		<PageWrapper>
			<SidebarWrapper>
				<Sidebar />
			</SidebarWrapper>
			<PageContent>
				{isCreatingOrganisation && (
					<LoaderOverlay>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}>
							<Loader />
							<OverlayText>Dodawanie organizacji...</OverlayText>
						</div>
					</LoaderOverlay>
				)}
				{/* STICKY HEADER */}
				<StickyHeaderWrapper>
					<StickyInner>
						<HelloTop />
						<TopLine />
						<SearchBarPanelOrganisation
							onAddClick={() => setShowModal(true)}
							onSearch={() => {}}
						/>
					</StickyInner>
				</StickyHeaderWrapper>
				<StickySpacer />
				<MainColumn>
					<ModalNewOrganisation
						open={showModal}
						onClose={() => setShowModal(false)}
						createOrganisation={createOrganisation}
						onSuccess={handleSuccess}
					/>
					<CardsWrapper>
						{organisations.length === 0 && (
							<div
								style={{ marginTop: 40, textAlign: "center", color: "#777" }}>
								Brak organizacji. Dodaj pierwszą firmę!
							</div>
						)}
						{organisations.map(org => (
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
									onSelect={() => setSelectedOrganisationId(org._id)}
									isSelected={selectedOrganisationId === org._id}
								/>
							</div>
						))}
					</CardsWrapper>
				</MainColumn>
			</PageContent>
		</PageWrapper>
	);
}
