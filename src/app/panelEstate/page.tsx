"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import styled from "styled-components";
import SearchBarPanelEstate from "@/components/panelEstate/SearchBarPanelEstate";
import { CardEstate } from "@/components/panelEstate/CardEstate";
import { useMain } from "@/context/EstateContext";
import { HelloTop } from "@/components/top/HelloTop";
import TopPanelChooseEstate from "@/components/panelEstate/TopPanelChooseEstate";
import AddEstateModal from "@/components/modal/AddEstateModal";

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
	gap: 16px;
`;

// Sticky header – tylko górna sekcja!
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

// === OVERLAY PREMIUM LOADING ===
const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(255, 255, 255, 0.6);
	z-index: 3500;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(7px);
`;

const Loader = styled.div`
	margin-bottom: 18px;
	width: 48px;
	height: 48px;
	border: 6px solid #ffd100;
	border-top: 6px solid #fff;
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

export default function PanelEstatePage() {
	const {
		organisations,
		selectedOrganisationId,
		selectedEstateId,
		setSelectedEstateId,
		loading,
		error,
	} = useMain();

	const [modalOpen, setModalOpen] = useState(false);

	// Wybrana organizacja i jej osiedla
	const selectedOrganisation = organisations.find(
		org => org._id === selectedOrganisationId
	);
	const estates = selectedOrganisation?.estates ?? [];

	// Po sukcesie dodania zamykamy modal. Context automatycznie wywoła fetch.
	const handleEstateSuccess = () => setModalOpen(false);

	return (
		<PageWrapper>
			<SidebarWrapper>
				<Sidebar />
			</SidebarWrapper>
			<PageContent>
				{loading && (
					<Overlay>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}>
							<Loader />
							<OverlayText>Ładowanie...</OverlayText>
						</div>
					</Overlay>
				)}
				<MainColumn>
					<StickyHeader>
						<div style={{ marginBottom: 32 }}>
							<HelloTop />
						</div>
						<TopPanelChooseEstate />
						<SearchBarPanelEstate onAddClick={() => setModalOpen(true)} />
					</StickyHeader>

					<AddEstateModal
						open={modalOpen}
						onClose={() => setModalOpen(false)}
						onSuccess={handleEstateSuccess}
					/>
					{error && (
						<div style={{ color: "red", marginTop: 24, textAlign: "center" }}>
							{error}
						</div>
					)}
					{estates.length === 0 && (
						<div style={{ color: "#aaa", marginTop: 32, textAlign: "center" }}>
							Brak osiedli przypisanych do tej firmy.
						</div>
					)}
					{/* MAPUJESZ KARTY BEZPOŚREDNIO */}
					{estates.map(estate => (
						<CardEstate
							key={estate._id}
							estate={{
								id: estate._id,
								name: estate.name,
								city: estate.address.city,
								zipCode: estate.address.zipCode,
								street: estate.address.street,
								buildingNumber: estate.address.buildingNumber,
								residentsCount: estate.numberOfFlats,
								newMessages: 0,
								newTickets: 0,
								inProgress: 0,
							}}
							onSelect={() => setSelectedEstateId(estate._id)}
							isSelected={selectedEstateId === estate._id}
						/>
					))}
				</MainColumn>
			</PageContent>
		</PageWrapper>
	);
}
