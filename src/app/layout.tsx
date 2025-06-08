import type { Metadata } from "next";
import { EstateProvider } from "@/context/EstateContext";

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
				<EstateProvider>{children}</EstateProvider>
			</body>
		</html>
	);
}
