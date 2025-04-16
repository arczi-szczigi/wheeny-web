import type { Metadata } from "next";
import ClientStyleWrapper from "@/components/ClientStyleWrapper";

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
				<ClientStyleWrapper>{children}</ClientStyleWrapper>
			</body>
		</html>
	);
}
