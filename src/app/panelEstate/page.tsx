"use client";
import { Sidebar } from "@/components/Sidebar";
import styled from "styled-components";
import SearchBarPanelEstate from "@/components/panelEstate/SearchBarPanelEstate";
import { CardEstate } from "@/components/panelEstate/CardEstate";
import { useEstates } from "@/context/EstateContext";
import { HelloTop } from "@/components/top/HelloTop";
import TopPanelChooseEstate from "@/components/panelEstate/TopPanelChooseEstate"; // <--- importujesz!

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

export default function PanelEstatePage() {
	const {
		estates,
		tickets,
		selectedEstateId,
		setSelectedEstateId,
		loading,
		error,
	} = useEstates();

	const getTicketsCount = (estateId: string) =>
		tickets.filter(t => t.estate === estateId).length;

	const getInProgressCount = (estateId: string) =>
		tickets.filter(t => t.estate === estateId && t.status === "in_progress")
			.length;

	return (
		<PageWrapper>
			<SidebarWrapper>
				<Sidebar />
			</SidebarWrapper>
			<PageContent>
				<MainColumn>
					{/* HelloTop */}
					<TopBar style={{ margin: "32px 0 0 0" }}>
						<HelloTop />
					</TopBar>
					{/* TopPanelChooseEstate */}
					<TopBar style={{ margin: "8px 0" }}>
						<TopPanelChooseEstate />
					</TopBar>
					{/* SearchBarPanelEstate */}
					<TopBar style={{ margin: "8px 0 8px 0" }}>
						<SearchBarPanelEstate />
					</TopBar>
					{loading && <div>Ładowanie osiedli...</div>}
					{error && <div style={{ color: "red" }}>Błąd: {error}</div>}
					{estates.map(estate => (
						<CardEstate
							key={estate._id}
							estate={{
								name: estate.name,
								city: estate.address.city,
								zipCode: estate.address.zipCode,
								street: estate.address.street,
								buildingNumber: estate.address.buildingNumber,
								residentsCount: estate.numberOfFlats,
								newMessages: 12,
								newTickets: getTicketsCount(estate._id),
								inProgress: getInProgressCount(estate._id),
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
