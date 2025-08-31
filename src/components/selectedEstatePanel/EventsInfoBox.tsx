"use client";

import React from "react";
import styled, { css } from "styled-components";
import { useMain, Ticket } from "@/context/EstateContext"; // <--- Import typ Ticket!

// Kolory dla statusów
const STATUS_COLORS = {
	open: "#FFD100",
	in_progress: "#52A2F9",
	closed: "#E56A6A",
};

const STATUS_LABELS: Record<string, string> = {
	open: "Otwarty",
	in_progress: "W trakcie",
	closed: "Zamknięty",
};

const Box = styled.div`
	width: 100%;
	background: white;
	border-radius: 10px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	padding: 24px 16px 16px 16px;
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 0;
	box-sizing: border-box;

	@media (max-width: 600px) {
		padding: 12px 4px 12px 4px;
	}
`;

const ScrollableTable = styled.div`
	width: 100%;
	max-height: 258px;
	overflow-y: auto;
`;

const Title = styled.div`
	font-size: 20px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	color: black;
	letter-spacing: 1px;
	margin-bottom: 8px;
`;

const Table = styled.div`
	width: 100%;
	margin-top: 12px;
`;

const HeaderRow = styled.div`
	display: grid;
	grid-template-columns: 50px 1.7fr 1.2fr 1fr 1fr;
	align-items: center;
	color: #dadada;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
	margin-bottom: 8px;
`;

const StyledUnderline = styled.div`
	width: 95%;
	height: 1px;
	background: #d9d9d9;
	margin: 2px 0 18px 0;
`;

const Row = styled.div<{ status: keyof typeof STATUS_COLORS }>`
	display: grid;
	grid-template-columns: 50px 1.7fr 1.2fr 1fr 1fr;
	align-items: center;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	letter-spacing: 0.7px;
	color: #4d4d4d;
	min-height: 56px;
	transition: opacity 0.18s;
	position: relative;

	${({ status }) =>
		status === "closed" &&
		css`
			opacity: 0.6;
		`}
`;

const EventIcon = styled.div<{ color: string }>`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: 2px solid ${({ color }) => color};
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	margin-left: 6px;
	margin-right: 4px;
`;

const IconSVG = styled.svg`
	width: 18px;
	height: 18px;
	display: block;
	opacity: 0.92;
`;

const EventTitle = styled.span`
	color: #4d4d4d;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
`;

const EventDate = styled.span`
	color: #868686;
	font-size: 11px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
`;

const EventStatus = styled.b<{ color: string }>`
	color: ${({ color }) => color};
	font-size: 13px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	letter-spacing: 0.5px;
`;

export default function EventsInfoBox() {
	const { tickets, selectedEstateId } = useMain();

	// Filtrowanie ticketów dla wybranego osiedla, sortowanie po dacie od najnowszego
	const filteredTickets = React.useMemo(() => {
		return tickets
			.filter((t: Ticket) => t.estate === selectedEstateId)
			.sort(
				(a: Ticket, b: Ticket) =>
					new Date(b.updatedAt || b.createdAt).getTime() -
					new Date(a.updatedAt || a.createdAt).getTime()
			);
	}, [tickets, selectedEstateId]);

	const formatDate = (iso: string) => {
		const date = new Date(iso);
		return date.toLocaleDateString("pl-PL", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	return (
		<Box>
			<Title>Ostatnie zdarzenia</Title>
			<Table>
				<HeaderRow>
					<span>Zdarzenie</span>
					<span>Opis</span>
					<span>Data zgłoszenia</span>
					<span>Status</span>
					<span>Email</span>
				</HeaderRow>
				<StyledUnderline />
				<ScrollableTable>
					{filteredTickets.length === 0 && (
						<Row status={"open"}>
							<EventTitle>Brak zgłoszeń dla tego osiedla.</EventTitle>
						</Row>
					)}
					{filteredTickets.map((ticket: Ticket, idx: number) => {
						const statusColor =
							STATUS_COLORS[ticket.status as keyof typeof STATUS_COLORS] ||
							"#868686";
						const statusLabel =
							STATUS_LABELS[ticket.status as keyof typeof STATUS_LABELS] ||
							ticket.status;

						return (
							<Row
								key={ticket._id || idx}
								status={ticket.status as keyof typeof STATUS_COLORS}>
								<EventIcon color={statusColor}>
									<IconSVG viewBox='0 0 18 18' fill='none'>
										<circle
											cx='9'
											cy='9'
											r='8'
											stroke={statusColor}
											strokeWidth='1.5'
										/>
										<rect
											x='5'
											y='7.5'
											width='8'
											height='1.5'
											rx='0.75'
											fill={statusColor}
										/>
										<rect
											x='5'
											y='10'
											width='5'
											height='1.5'
											rx='0.75'
											fill={statusColor}
										/>
									</IconSVG>
								</EventIcon>
								<EventTitle>{ticket.subject}</EventTitle>
								<EventDate>{formatDate(ticket.createdAt)}</EventDate>
								<EventStatus color={statusColor}>{statusLabel}</EventStatus>
								<span
									style={{
										fontSize: "11px",
										color: "#868686",
										wordBreak: "break-all",
									}}>
									{ticket.residentEmail}
								</span>
							</Row>
						);
					})}
				</ScrollableTable>
			</Table>
		</Box>
	);
}
