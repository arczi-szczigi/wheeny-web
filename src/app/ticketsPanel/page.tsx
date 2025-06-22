"use client";

import { Sidebar } from "@/components/Sidebar";
import { HelloTop } from "@/components/top/HelloTop";
import MsgBox from "@/components/ticketsPanel/MsgBox";
import ConversationBox from "@/components/ticketsPanel/ConversationBox";
import ResidentInfo from "@/components/ticketsPanel/ResidentInfo";

const MAX_WIDTH = 1400; // Szerokość centralnego wrappera
const CENTER_GAP = 32; // Odstęp między boxami

export default function MsgPanelPage() {
	return (
		<div style={{ display: "flex", minHeight: "100vh", background: "#F2F2F2" }}>
			<Sidebar />

			{/* Centralny wrapper */}
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				{/* Top bar z powitaniem */}
				<div
					style={{
						width: "100%",
						maxWidth: MAX_WIDTH,
						margin: "0 auto",
						padding: "36px 0 0 0",
					}}>
					<HelloTop />
				</div>

				{/* Główna sekcja z nagłówkiem i trzema boxami */}
				<div
					style={{
						width: "100%",
						maxWidth: MAX_WIDTH,
						margin: "0 auto",
						display: "flex",
						flexDirection: "column",
						boxSizing: "border-box",
						minHeight: "calc(100vh - 110px)",
						gap: "0px",
					}}>
					{/* Nagłówek "Wiadomości" */}
					<div
						style={{
							fontSize: 28,
							fontWeight: 400, // <- pogrubiony, jak na screenie
							fontFamily: "Roboto, sans-serif",
							letterSpacing: "1px",
							margin: "28px 0 24px 6px",
						}}>
						Zgłoszenia
					</div>

					{/* Trzy boxy w jednym rzędzie */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							gap: `${CENTER_GAP}px`,
							alignItems: "flex-start",
							width: "100%",
							minWidth: 0,
							boxSizing: "border-box",
						}}>
						<MsgBox />
						<ConversationBox />
						<ResidentInfo />
					</div>
				</div>
			</div>
		</div>
	);
}
