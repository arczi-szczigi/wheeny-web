import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMain } from "../../context/EstateContext";
import { useRouter } from "next/navigation";
import { ProfileImageModal } from "../modal/ProfileImageModal";

const DEFAULT_AVATAR = "/assets/top/marcin.png";
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

const MenuButton = styled.button`
	background: none;
	border: none;
	color: #202020;
	font-size: 16px;
	font-weight: 500;
	padding: 7px 0;
	cursor: pointer;
	text-align: left;
	transition: color 0.2s;
	&:hover {
		color: #ffd100;
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

const MenuSeparator = styled.div`
	height: 1px;
	background: #e0e0e0;
	margin: 5px 0;
`;

export const HelloTop: React.FC = () => {
	const { manager, currentUserName, logout } = useMain();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const handleSettings = () => {
		router.push("/settingsPanel");
		setOpen(false);
	};

	const handleHelp = () => {
		// TODO: Implementacja pomocy
		console.log("Pomoc clicked");
		setOpen(false);
	};

	// Pobieranie zdjęcia profilowego
	useEffect(() => {
		const fetchProfileImage = async () => {
			if (!manager?._id) return;
			
			try {
				const token = localStorage.getItem('token');
				if (!token) return;

				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/managers/profile-image/${manager._id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (response.ok) {
					const blob = await response.blob();
					const url = URL.createObjectURL(blob);
					setProfileImageUrl(url);
				}
			} catch (error) {
				console.error('Błąd podczas pobierania zdjęcia profilowego:', error);
			}
		};

		fetchProfileImage();
	}, [manager?._id]);

	// Upload zdjęcia profilowego
	const handleUploadProfileImage = async (file: File) => {
		if (!manager?._id) throw new Error('Brak ID managera');

		const token = localStorage.getItem('token');
		if (!token) throw new Error('Brak tokena');

		const formData = new FormData();
		formData.append('image', file);

		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/managers/profile-image`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			body: formData
		});

		if (!response.ok) {
			throw new Error('Błąd podczas uploadu zdjęcia');
		}

		// Odśwież zdjęcie profilowe
		const newResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/managers/profile-image/${manager._id}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (newResponse.ok) {
			const blob = await newResponse.blob();
			const url = URL.createObjectURL(blob);
			setProfileImageUrl(url);
		}
	};

	const handleProfileImageClick = () => {
		setIsModalOpen(true);
		setOpen(false);
	};

	return (
		<>
			<Container>
				<Greeting>
					Dzień dobry {currentUserName ? currentUserName.split(" ")[0] : manager ? manager.firstName : "..."}!
				</Greeting>
				<Separator />
				<ProfileBox
					tabIndex={0}
					onClick={() => setOpen(v => !v)}
					onBlur={() => setTimeout(() => setOpen(false), 200)}>
					<Avatar src={profileImageUrl || DEFAULT_AVATAR} alt='avatar' />
					<Name>{currentUserName ?? (manager ? `${manager.firstName} ${manager.lastName}` : "...")}</Name>
					<DropdownIcon src={ICON_SRC} alt='menu' />
					{open && (
						<DropdownMenu>
							<MenuButton onClick={handleProfileImageClick}>Miniaturka</MenuButton>
							<MenuButton onClick={handleSettings}>Ustawienia</MenuButton>
							<MenuButton onClick={handleHelp}>Pomoc</MenuButton>
							<MenuSeparator />
							<LogoutButton onClick={handleLogout}>Wyloguj</LogoutButton>
						</DropdownMenu>
					)}
				</ProfileBox>
			</Container>
			
			<ProfileImageModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onUpload={handleUploadProfileImage}
			/>
		</>
	);
};
