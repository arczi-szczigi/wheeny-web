import type { Metadata } from "next";
import React from "react";
import ThemeRegistry from "./ThemeRegistry";
import ClientWrapper from "./ClientWrapper";
import { MainProvider } from "@/context/EstateContext";
import { AnnouncementProvider } from "@/context/AnnouncementContext";
import { DocForResidentsProvider } from "@/context/DocForResidentsContext";

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
				<ThemeRegistry>
					<ClientWrapper>
						<MainProvider>
							<AnnouncementProvider>
								<DocForResidentsProvider>{children}</DocForResidentsProvider>
							</AnnouncementProvider>
						</MainProvider>
					</ClientWrapper>
				</ThemeRegistry>
			</body>
		</html>
	);
}
