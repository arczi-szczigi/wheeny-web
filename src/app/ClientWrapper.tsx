"use client";
import GlobalStyle from "@/styles/GlobalStyle";

export default function ClientWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<GlobalStyle />
			{children}
		</>
	);
}
