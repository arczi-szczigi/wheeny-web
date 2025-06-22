import React from "react";
import styled from "styled-components";
import { useMain } from "../../context/EstateContext";

// Jeśli używasz Next.js i pliki są w public/, użyj poniższych stringów:
const AVATAR_SRC = "/assets/top/marcin.png";
const ICON_SRC = "/assets/top/down.png";

// Jeśli importujesz obrazki jako moduły, zamień powyższe na import ... from ...
// import MarcinImg from "../../assets/top/marcin.png";
// import DownIcon from "../../assets/top/anglesmalldown2.png";

const Container = styled.div`
	width: auto;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24px;
	position: relative;
`;

const Greeting = styled.span`
	color: #000;
	font-size: 26px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.3px;
`;

const Divider = styled.div`
	flex: 1;
	height: 1px;
	background: #dadada;
	margin: 0 24px;
`;

const ProfileBox = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 30px;
	height: 60px;
	padding: 0 20px 0 8px;
	min-width: 200px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
`;

const Avatar = styled.img`
	width: 60px;
	height: 60px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 12px;
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

export const HelloTop: React.FC = () => {
	const { manager } = useMain();

	return (
		<Container>
			<Greeting>Dzień dobry {manager ? manager.firstName : "..."}!</Greeting>
			<Divider />
			<ProfileBox>
				<Avatar src={AVATAR_SRC} alt='avatar' />
				<Name>
					{manager ? `${manager.firstName} ${manager.lastName}` : "..."}
				</Name>
				<DropdownIcon src={ICON_SRC} alt='menu' />
			</ProfileBox>
		</Container>
	);
};
