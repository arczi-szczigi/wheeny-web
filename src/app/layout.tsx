// app/layout.tsx
import type { Metadata } from "next";
import React from "react";
import StyledComponentsRegistry from "./StyledComponentsRegistry"; // lub './lib/StyledComponentsRegistry'
import ClientWrapper from "./ClientWrapper";
import { MainProvider } from "@/context/EstateContext";
import { AnnouncementProvider } from "@/context/AnnouncementContext";
import { DocForResidentsProvider } from "@/context/DocForResidentsContext";
import { ToastProvider } from "@/components/toast/ToastContext";

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
				<StyledComponentsRegistry>
					<ClientWrapper>
						<MainProvider>
							<AnnouncementProvider>
								<DocForResidentsProvider>
									{/* Globalny provider dla toastów */}
									<ToastProvider>{children}</ToastProvider>
								</DocForResidentsProvider>
							</AnnouncementProvider>
						</MainProvider>
					</ClientWrapper>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
