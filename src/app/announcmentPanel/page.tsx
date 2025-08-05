//app/anouncmentPanel/page.tsx

"use client";

import { Sidebar } from "@/components/Sidebar";
import { HelloTop } from "@/components/top/HelloTop";
import AnnouncmentsListBox from "@/components/announcementsPanel/AnnouncementsListBox";

const MAX_WIDTH = 1400;
const CENTER_GAP = 32;

export default function AnnouncmentPanelPage() {
	return (
		<div
			style={{
				display: "flex",
				minHeight: "100vh",
				background: "#F5F5F5",
			}}>
			<Sidebar />

			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				{/* Górny pasek powitania */}
				<div
					style={{
						width: "100%",
						maxWidth: MAX_WIDTH,
						margin: "0 auto",
						padding: "36px 0 0 0",
					}}>
					<HelloTop />
				</div>

				{/* Główna sekcja ogłoszeń */}
				<div
					style={{
						width: "100%",
						maxWidth: MAX_WIDTH,
						margin: "0 auto",
						display: "flex",
						flexDirection: "row",
						gap: `${CENTER_GAP}px`,
						padding: "28px 0 32px 0",
						alignItems: "flex-start",
						boxSizing: "border-box",
						minHeight: "calc(100vh - 110px)",
					}}>
					<AnnouncmentsListBox />
				</div>
			</div>
		</div>
	);
}
