"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar"; // poprawny import!
import styled from "styled-components";
import { usePathname } from "next/navigation";

const PageWrapper = styled.div`
	display: flex;
	min-height: 100vh;
	background: #f1f1f1;
	font-family: "Roboto", sans-serif;
`;

const Main = styled.main`
	flex: 1;
	padding: 2rem 3rem;
`;

const Header = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
`;

const Title = styled.h1`
	font-size: 1.4rem;
	font-weight: 700;
`;

const Avatar = styled.div`
	display: flex;
	align-items: center;
	gap: 0.7rem;
	background: #fff;
	border-radius: 9999px;
	padding: 0.4rem 0.8rem;

	img {
		width: 32px;
		height: 32px;
		border-radius: 50%;
	}
	span {
		font-weight: 500;
		font-size: 0.9rem;
	}
`;

export default function DashboardPage() {
	const pathname = usePathname();
	// Tu możesz mieć inne stany
	const [manager, setManager] = useState<{
		firstName: string;
		lastName: string;
	} | null>(null);

	useEffect(() => {
		// tu wrzuć swój kod pobierający managera przez API (jeśli potrzebujesz)
		// przykładowo:
		// axios.get("...").then(res => setManager(res.data));
	}, []);

	return (
		<PageWrapper>
			<Sidebar activePath={pathname} />
			<Main>
				<Header>
					<Title>
						Dzień dobry{" "}
						{manager ? `${manager.firstName} ${manager.lastName}` : "..."}!
					</Title>
					<Avatar>
						<img src='/icons/avatar.png' alt='user' />
						<span>
							{manager ? `${manager.firstName} ${manager.lastName}` : ""}
						</span>
					</Avatar>
				</Header>
				{/* Tutaj wrzuć resztę dashboardu: info cardy, tabelki, listy itd. */}
				{/* ... */}
			</Main>
		</PageWrapper>
	);
}
