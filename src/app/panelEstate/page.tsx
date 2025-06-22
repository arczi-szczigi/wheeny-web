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
	gap: 12px;
`;

const TopBar = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

const CenterSuccessBox = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #ffd100;
	color: #232323;
	font-size: 22px;
	font-weight: 700;
	padding: 38px 56px;
	border-radius: 20px;
	box-shadow: 0 0 24px rgba(255, 209, 0, 0.17);
	z-index: 3000;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	animation: fadeIn 0.2s;
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translate(-50%, -48%);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}
`;

export default function PanelEstatePage() {
	const {
		organisations,
		selectedOrganisationId,
		selectedEstateId,
		setSelectedEstateId,
		loading,
		error,
		reload,
	} = useMain();

	const [modalOpen, setModalOpen] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [pendingListUpdate, setPendingListUpdate] = useState(false);

	const token =
		typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

	const selectedOrganisation = organisations.find(
		org => org._id === selectedOrganisationId
	);

	const estates = selectedOrganisation?.estates ?? [];

	const handleEstateSuccess = async () => {
		setModalOpen(false);
		setShowSuccess(true);
		setPendingListUpdate(true);
		await reload();
		setTimeout(() => {
			setShowSuccess(false);
			setPendingListUpdate(false);
		}, 1500);
	};

	return (
		<PageWrapper>
			<SidebarWrapper>
				<Sidebar />
			</SidebarWrapper>
			<PageContent>
				<MainColumn>
					<TopBar style={{ margin: "32px 0 0 0" }}>
						<HelloTop />
					</TopBar>
					<TopBar style={{ margin: "8px 0" }}>
						<TopPanelChooseEstate />
					</TopBar>
					<TopBar style={{ margin: "8px 0 8px 0" }}>
						<SearchBarPanelEstate onAddClick={() => setModalOpen(true)} />
					</TopBar>
					<AddEstateModal
						open={modalOpen}
						onClose={() => setModalOpen(false)}
						token={token}
						onSuccess={handleEstateSuccess}
					/>
					{showSuccess && (
						<CenterSuccessBox>
							✅ Osiedle zostało dodane
							<br />
							Dziękujemy!
						</CenterSuccessBox>
					)}
					{pendingListUpdate ? (
						<div
							style={{
								marginTop: 70,
								textAlign: "center",
								fontSize: 18,
								color: "#888",
							}}>
							Odświeżam listę osiedli...
						</div>
					) : (
						<>
							{loading && <div>Ładowanie osiedli...</div>}
							{error && <div style={{ color: "red" }}>Błąd: {error}</div>}
							{estates.length === 0 && (
								<div
									style={{ color: "#aaa", marginTop: 32, textAlign: "center" }}>
									Brak osiedli przypisanych do tej firmy.
								</div>
							)}
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
						</>
					)}
				</MainColumn>
			</PageContent>
		</PageWrapper>
	);
}
