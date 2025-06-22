// components/Sidebar.tsx
import styled from "styled-components";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const SidebarWrapper = styled.aside`
	width: 240px;
	min-height: 100vh;
	background: #fff;
	border-right: 1px solid #eee;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 32px 18px 0 18px;
	height: 100vh;
	overflow-y: auto;
`;

const Logo = styled.img`
	width: 135px;
	margin: 0 0 48px 0;
	user-select: none;
`;

const MenuSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 32px;
`;

const MenuList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

// TU zmieniamy active na $active!
const MenuItem = styled.li.attrs<{ $active?: boolean }>(props => ({
	className: props.$active ? "active" : undefined,
}))<{ $active?: boolean }>`
	display: flex;
	align-items: center;
	gap: 20px;
	font-size: 13px;
	font-family: "Roboto", sans-serif;
	font-weight: ${props => (props.$active ? 800 : 400)};
	letter-spacing: 0.65px;
	color: #4d4d4d;
	background: ${props => (props.$active ? "#f3f3f3" : "none")};
	border-radius: 8px;
	padding: 8px 12px;
	cursor: pointer;
	transition: background 0.13s;
	&:hover {
		background: #fafaf4;
	}
	img {
		width: 18px;
		height: 18px;
		object-fit: contain;
		filter: ${props => (props.$active ? "grayscale(0%)" : "grayscale(80%)")};
	}
`;

const Divider = styled.div`
	height: 1px;
	background: #d9d9d9;
	margin: 18px 0 0 0;
	width: 100%;
`;

const DiskUsageBox = styled.div`
	background: #f3f3f3;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 5px;
	margin-top: 24px;
	padding: 18px;
`;

const SupportSection = styled.div`
	margin-top: 24px;
	padding: 17px 0 0 0;
	background: #f3f3f3;
	border-radius: 8px;
	text-align: center;
`;

const SupportBtn = styled.button`
	margin: 12px auto 0 auto;
	display: block;
	background: #ffd100;
	border: none;
	border-radius: 30px;
	font-size: 12px;
	color: #202020;
	padding: 7px 28px;
	font-family: "Roboto", sans-serif;
	font-weight: 400;
	letter-spacing: 0.6px;
	cursor: pointer;
`;

const DiskInfo = styled.div`
	margin: 10px 0 0 0;
	color: #4d4d4d;
	font-size: 8px;
	font-family: "Roboto", sans-serif;
`;

const DiskBar = styled.div`
	background: linear-gradient(55deg, #202020 0%, #4d4d4d 100%);
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	height: 20px;
	width: 157px;
	margin: 7px 0;
`;

const SectionTitle = styled.div`
	font-size: 12px;
	font-family: "Roboto", sans-serif;
	font-weight: 700;
	color: #4d4d4d;
	margin-top: 6px;
`;

const BuyMore = styled.div`
	font-size: 8px;
	color: #202020;
	font-family: "Roboto", sans-serif;
	font-weight: 700;
	text-decoration: underline;
	text-align: right;
	margin-top: 3px;
	letter-spacing: 0.4px;
	cursor: pointer;
`;

const SupportTitle = styled.div`
	font-size: 26px;
	font-family: "Roboto", sans-serif;
	font-weight: 600;
	color: black;
	letter-spacing: 1.3px;
`;

const SupportDesc = styled.div`
	font-size: 10px;
	color: black;
	font-family: "Roboto", sans-serif;
	font-weight: 300;
	margin-top: 1px;
	letter-spacing: 0.5px;
`;

const menuItems = [
	{
		label: "Panel managera",
		icon: "/assets/sidebar/building.svg",
		path: "/panelManager",
	},
	{
		label: "Panel wyboru osiedla",
		icon: "/assets/sidebar/building.svg",
		path: "/panelEstate",
	},
	{
		label: "Start",
		icon: "/assets/sidebar/building2.svg",
		path: "/start",
	},
	{
		label: "Wiadomości",
		icon: "/assets/sidebar/comment-alt.svg",
		path: "/messagesPanel",
	},
	{
		label: "Zgłoszenia",
		icon: "/assets/sidebar/fi-rr-file-check.svg",
		path: "/ticketsPanel",
	},
	{
		label: "Rozliczenia osiedla",
		icon: "/assets/sidebar/document 2.svg",
		path: "/advancePayment",
	},
	{
		label: "Dokumenty",
		icon: "/assets/sidebar/folder-open 2.svg",
		path: "/documentsPanel",
	},
	{
		label: "Dodaj ogłoszenie",
		icon: "/assets/sidebar/book.svg",
		path: "/announcmentPanel",
	},
	{
		label: "Odpady",
		icon: "/assets/sidebar/fi-rr-trash.svg",
		path: "/wastePanel",
	},
	{
		label: "Grupa społecznościowa",
		icon: "/assets/sidebar/meeting.svg",
		path: "/socialGroup",
	},
	{
		label: "Najemcy",
		icon: "/assets/sidebar/users 2.svg",
		path: "/residentsPanel",
	},
	{
		label: "Dane osiedla",
		icon: "/assets/sidebar/city 3.svg",
		path: "/estateInfo",
	},
];

const menuBottomItems = [
	{
		label: "Twoje osiedla",
		icon: "/assets/sidebar/fi-rr-book.svg",
		path: "/allEstates",
	},
	{
		label: "Twoja organizacja",
		icon: "/assets/sidebar/team-check 1.svg",
		path: "/organisationInfo",
	},
	{
		label: "Współpracownicy",
		icon: "/assets/sidebar/team-check 1.svg",
		path: "/coworkers",
	},
	{
		label: "Ustawienia",
		icon: "/assets/sidebar/fi-rr-settings.svg",
		path: "/settingsPanel",
	},
];

export const Sidebar = () => {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<SidebarWrapper>
			<div>
				<Logo src='/assets/sidebar/wheenyLogo.svg' alt='wheeny logo'></Logo>
				<MenuSection>
					<MenuList>
						{menuItems.map(item => (
							<MenuItem
								key={item.label}
								$active={
									(item.path === "/dashboard" &&
										pathname.startsWith("/dashboard")) ||
									pathname === item.path
								}
								onClick={() => router.push(item.path)}>
								<img src={item.icon} alt='' />
								{item.label}
							</MenuItem>
						))}
					</MenuList>
					<Divider />
					<MenuList>
						{menuBottomItems.map(item => (
							<MenuItem
								key={item.label}
								$active={pathname === item.path}
								onClick={() => router.push(item.path)}>
								<img src={item.icon} alt='' />
								{item.label}
							</MenuItem>
						))}
					</MenuList>
				</MenuSection>
			</div>

			<div>
				<DiskUsageBox>
					<SectionTitle>Konto podstawowe</SectionTitle>
					<DiskBar />
					<BuyMore>Dokup miejsce.</BuyMore>
					<DiskInfo>zajęte 78% z 1GB miejsca na dysku.</DiskInfo>
				</DiskUsageBox>
				<SupportSection>
					<SupportTitle>Wsparcie</SupportTitle>
					<SupportDesc>Skontaktuj się z nami</SupportDesc>
					<SupportBtn>Centrum pomocy</SupportBtn>
				</SupportSection>
			</div>
		</SidebarWrapper>
	);
};
