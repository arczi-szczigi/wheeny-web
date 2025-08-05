// app/westPanel/page.tsx

"use client";

import { Sidebar } from "@/components/Sidebar";
import { HelloTop } from "@/components/top/HelloTop";
import Trash from "@/components/trashPanel/Trash";

const MAX_WIDTH = 1400; // szerokość jak w dokumentach

export default function WastePanelPage() {
	return (
		<div style={{ display: "flex", minHeight: "100vh", background: "#F2F2F2" }}>
			<Sidebar />

			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: "100%",
					minHeight: "100vh",
				}}>
				{/* HelloTop */}
				<div
					style={{
						width: "100%",
						maxWidth: MAX_WIDTH,
						margin: "0 auto",
						padding: "36px 0 0 0",
					}}>
					<HelloTop />
				</div>

				{/* Panel ze śmieciami */}
				<div
					style={{
						width: "100%",
						maxWidth: MAX_WIDTH,
						margin: "0 auto",
						padding: "28px 0 32px 0",
						boxSizing: "border-box",
						display: "flex",
						flexDirection: "column",
						gap: 0,
						alignItems: "center",
						minHeight: "calc(100vh - 110px)",
					}}>
					<Trash />
				</div>
			</div>
		</div>
	);
}
