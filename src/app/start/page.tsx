"use client";

import { Sidebar } from "@/components/Sidebar";
import { HelloTop } from "@/components/top/HelloTop";
import SelectedEstate from "@/components/selectedEstatePanel/SelectedEstate";
import EventsInfoBox from "@/components/selectedEstatePanel/EventsInfoBox";
import WidgetsBox from "@/components/selectedEstatePanel/Widgets";
import EstateCalendar from "@/components/selectedEstatePanel/Calendar";
import ContactsBox from "@/components/selectedEstatePanel/ContactsBox";
import { useEffect, useState } from "react";

const MAX_WIDTH = 1080;
const RIGHT_COL_WIDTH = 240;
const GAP = 16;
const WIDGETS_GAP = 12;

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
						maxWidth: `${MAX_WIDTH}px`,
						margin: "0 auto",
						minHeight: "100vh",
						display: "flex",
						flexDirection: "column",
						paddingTop: isMobile ? 10 : 16,
						paddingBottom: isMobile ? 10 : 16,
					}}>
					{/* HelloTop */}
					<div style={{ padding: isMobile ? "0 0 8px 0" : "0 0 12px 0" }}>
						<HelloTop />
					</div>

					{/* Sekcje główne */}
					<div
						style={{
							display: "flex",
							flexDirection: isMobile ? "column" : "row",
							gap: isMobile ? 8 : GAP,
							width: "100%",
							alignItems: "flex-start",
							minWidth: 0,
							boxSizing: "border-box",
						}}>
						{/* Lewa kolumna */}
						<div
							style={{
								flex: 1,
								minWidth: 0,
								display: "flex",
								flexDirection: "column",
								gap: isMobile ? 8 : GAP,
							}}>
							<div
								style={{
									width: "100%",
									minHeight: 70,
									padding: "14px 18px",
									fontSize: 15,
									background: "transparent",
									boxSizing: "border-box",
								}}>
								<SelectedEstate />
							</div>
							<div
								style={{
									width: "100%",
									minHeight: 70,
									maxHeight: 170,
									padding: "14px 18px",
									fontSize: 14,
									background: "transparent",
									boxSizing: "border-box",
								}}>
								<EventsInfoBox />
							</div>
							<div
								style={{
									width: "100%",
									minHeight: 70,
									padding: "10px 14px",
									fontSize: 14,
									gap: WIDGETS_GAP,
									background: "transparent",
									boxSizing: "border-box",
								}}>
								<WidgetsBox />
							</div>
						</div>

						{/* Prawa kolumna */}
						<div
							style={{
								width: isMobile ? "100%" : `${RIGHT_COL_WIDTH}px`,
								minWidth: isMobile ? "0" : `${RIGHT_COL_WIDTH}px`,
								display: "flex",
								flexDirection: "column",
								gap: isMobile ? 8 : GAP,
							}}>
							<div
								style={{
									minHeight: 70,
									padding: "10px 10px",
									fontSize: 14,
									background: "transparent",
									boxSizing: "border-box",
								}}>
								<EstateCalendar />
							</div>
							<div
								style={{
									minHeight: 70,
									padding: "10px 10px",
									fontSize: 14,
									background: "transparent",
									boxSizing: "border-box",
								}}>
								<ContactsBox />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
