import type { Metadata } from "next";
import { MainProvider } from "@/context/EstateContext";
import { AnnouncementProvider } from "@/context/AnnouncementContext";
import { DocForResidentsProvider } from "@/context/DocForResidentsContext";
import ClientWrapper from "./ClientWrapper";

export const metadata: Metadata = {
	title: "Manager Wheeny Panel",
	description: "Zarządzanie osiedlami — nowocześnie i wygodnie",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='pl'>
			<body>
				<ClientWrapper>
					<MainProvider>
						<AnnouncementProvider>
							<DocForResidentsProvider>{children}</DocForResidentsProvider>
						</AnnouncementProvider>
					</MainProvider>
				</ClientWrapper>
			</body>
		</html>
	);
}
