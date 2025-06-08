// KARTA OSIEDLA

// "use client";
// import { CardEstate } from "@/components/panelEstate/cardEstate";

// const mockEstate = {
// 	id: "1",
// 	name: "Osiedle Słoneczne",
// 	code: "waw.001-1",
// 	address: "ul. Jerozolimskie 44, 01-345 Warszawa",
// 	residentsCount: 51,
// 	newMessages: 5,
// 	newTickets: 5,
// 	inProgress: 5,
// };

// export default function TestCardEstatePage() {
// 	return (
// 		<div style={{ padding: 40, background: "#f1f1f1", minHeight: "100vh" }}>
// 			<CardEstate estate={mockEstate} />
// 		</div>
// 	);
// }

//PANEL TOP WYBORU OSIEDLA

// "use client";
// import DashboardTopPanel from "@/components/panelEstate/TopPanelChooseEstate";

// export default function TestPage() {
// 	return (
// 		<div style={{ background: "#f1f1f1", minHeight: "100vh", padding: 40 }}>
// 			<DashboardTopPanel />
// 		</div>
// 	);
// }

"use client";
import TopPanelChooseEstate from "@/components/panelEstate/TopPanelChooseEstate";

export default function HomePage() {
	return (
		<main className='flex min-h-screen flex-col items-center gap-8 p-10'>
			{/* Pasek wyszukiwania osiedli */}
			<TopPanelChooseEstate />

			{/* …reszta zawartości strony… */}
		</main>
	);
}
