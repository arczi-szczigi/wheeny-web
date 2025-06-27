import React, { useState } from "react";
import styled from "styled-components";
import { useMain } from "../../context/EstateContext";
import { useRouter } from "next/navigation";

const AVATAR_SRC = "/assets/top/marcin.png";
const ICON_SRC = "/assets/top/down.png";

const Container = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0;
	height: 60px;
	position: relative;
`;

const Greeting = styled.span`
	color: #000;
	font-size: 26px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.3px;
	white-space: nowrap;
`;

// TO JEST SEPARATOR (LINIA) POZIOMA FLEX
const Separator = styled.div`
	flex: 1;
	height: 1.5px;
	background: #dadada;
	margin: 0 28px;
	opacity: 0.7;
`;

const ProfileBox = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 30px;
	height: 60px;
	padding: 0 20px 0 0;
	min-width: 200px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
	position: relative;
	cursor: pointer;
`;

const Avatar = styled.img`
	width: 60px;
	height: 60px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 12px;
	margin-left: 0;
`;

const Name = styled.span`
	color: #000;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.8px;
	margin-right: 14px;
	white-space: nowrap;
`;

const DropdownIcon = styled.img`
	width: 26px;
	height: 26px;
`;

const DropdownMenu = styled.div`
	position: absolute;
	top: 65px;
	right: 8px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	padding: 10px 24px;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	gap: 7px;
	min-width: 150px;
	animation: fadeIn 0.23s;
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;

const LogoutButton = styled.button`
	background: none;
	border: none;
	color: #c00;
	font-size: 16px;
	font-weight: 600;
	padding: 7px 0;
	cursor: pointer;
	text-align: left;
	&:hover {
		color: #a00;
	}
`;

export const HelloTop: React.FC = () => {
	const { manager, logout } = useMain();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	return (
		<Container>
			<Greeting>Dzień dobry {manager ? manager.firstName : "..."}!</Greeting>
			<Separator />
			<ProfileBox
				tabIndex={0}
				onClick={() => setOpen(v => !v)}
				onBlur={() => setTimeout(() => setOpen(false), 200)}>
				<Avatar src={AVATAR_SRC} alt='avatar' />
				<Name>
					{manager ? `${manager.firstName} ${manager.lastName}` : "..."}
				</Name>
				<DropdownIcon src={ICON_SRC} alt='menu' />
				{open && (
					<DropdownMenu>
						<LogoutButton onClick={handleLogout}>Wyloguj</LogoutButton>
					</DropdownMenu>
				)}
			</ProfileBox>
		</Container>
	);
};
