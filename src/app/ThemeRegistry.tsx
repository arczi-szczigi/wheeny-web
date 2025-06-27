import type { Metadata } from "next";
import React from "react";

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
			<body>{children}</body>
		</html>
	);
}
