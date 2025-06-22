"use client";

import { Sidebar } from "@/components/Sidebar";
import { HelloTop } from "@/components/top/HelloTop";
import SelectedEstate from "@/components/selectedEstatePanel/SelectedEstate";
import EventsInfoBox from "@/components/selectedEstatePanel/EventsInfoBox";
import WidgetsBox from "@/components/selectedEstatePanel/Widgets";
import EstateCalendar from "@/components/selectedEstatePanel/Calendar";
import ContactsBox from "@/components/selectedEstatePanel/ContactsBox";
import { useEffect, useState } from "react";

const MAX_WIDTH = 1400; // szerokość całości
const GAP = 20; // odstęp między kolumnami
const LEFT_COL = 900; // lewa kolumna (nie więcej!)
const RIGHT_COL = 400; // prawa kolumna

export default function StartPage() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 900);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div style={{ display: "flex", minHeight: "100vh", background: "#F2F2F2" }}>
			<Sidebar />

			<div
				style={{
					flex: 1,
					background: "#F2F2F2",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				<div
					style={{
						width: "100%",
						maxWidth: MAX_WIDTH,
						margin: "0 auto",
						minHeight: "100vh",
						display: "flex",
						flexDirection: "column",
						padding: isMobile ? 8 : 20,
						boxSizing: "border-box",
					}}>
					{/* HelloTop */}
					<div style={{ paddingBottom: isMobile ? 8 : 16 }}>
						<HelloTop />
					</div>

					{/* Main Content Section */}
					<div
						style={{
							display: isMobile ? "block" : "grid",
							gridTemplateColumns: isMobile
								? undefined
								: `${LEFT_COL}px ${RIGHT_COL}px`,
							gap: isMobile ? 8 : GAP,
							width: "100%",
							alignItems: "start",
							boxSizing: "border-box",
						}}>
						{/* Lewa kolumna */}
						<div
							style={{
								width: "100%",
								maxWidth: isMobile ? "100%" : LEFT_COL,
								margin: "0 auto",
								display: "flex",
								flexDirection: "column",
								gap: isMobile ? 10 : 16,
							}}>
							<SelectedEstate />
							<EventsInfoBox />
							<WidgetsBox />
						</div>

						{/* Prawa kolumna */}
						<div
							style={{
								width: "100%",
								maxWidth: isMobile ? "100%" : RIGHT_COL,
								margin: "0 auto",
								display: "flex",
								flexDirection: "column",
								gap: isMobile ? 10 : 16,
							}}>
							<EstateCalendar />
							<ContactsBox />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
