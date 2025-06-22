import React, { useState } from "react";
import styled from "styled-components";
import {
	FiPlus,
	FiSearch,
	FiFilter,
	FiChevronDown,
	FiAlignLeft,
} from "react-icons/fi";

// ... styled components (tak jak masz)

const Container = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 18px;
	margin: 32px 0 24px 0;
`;

const AddButton = styled.button`
	height: 40px;
	padding: 0 20px;
	background: #ffd100;
	border: none;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 4px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	font-weight: 400;
	letter-spacing: 0.6px;
	cursor: pointer;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const SearchContainer = styled.div`
	flex: 1 1 0;
	height: 40px;
	padding: 0 20px;
	background: #ffffff;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 4px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const Input = styled.input`
	flex: 1 1 0;
	border: none;
	outline: none;
	font-family: Roboto, sans-serif;
	font-size: 14px;
	color: #202020;
	&::placeholder {
		color: #9d9d9d;
	}
`;

const ControlButton = styled.button`
	height: 40px;
	padding: 0 13px;
	background: #ffffff;
	border: none;
	border-radius: 30px;
	display: flex;
	align-items: center;
	gap: 10px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	font-weight: 400;
	letter-spacing: 0.6px;
	color: #9d9d9d;
	cursor: pointer;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

export interface SearchBarPanelOrganisationProps {
	onAddClick?: () => void;
	onSearch?: (value: string) => void;
	onFilterClick?: () => void;
	onSortClick?: () => void;
	placeholder?: string;
}

const SearchBarPanelOrganisation: React.FC<SearchBarPanelOrganisationProps> = ({
	onAddClick,
	onSearch,
	onFilterClick,
	onSortClick,
	placeholder = "Wyszukaj organizację",
}) => {
	const [search, setSearch] = useState("");

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setSearch(val);
		onSearch?.(val);
	};

	return (
		<Container>
			<AddButton onClick={onAddClick} type='button'>
				<FiPlus size={15} />
				<span>Dodaj organizację</span>
			</AddButton>

			<SearchContainer>
				<FiSearch size={15} color='#9d9d9d' />
				<Input
					value={search}
					onChange={handleSearchChange}
					placeholder={placeholder}
				/>
			</SearchContainer>

			<ControlButton onClick={onFilterClick} type='button'>
				<FiFilter size={20} />
				<span>Filtrowanie</span>
				<FiChevronDown size={20} />
			</ControlButton>
			<ControlButton onClick={onSortClick} type='button'>
				<FiAlignLeft size={20} />
				<span>Sortowanie</span>
				<FiChevronDown size={20} />
			</ControlButton>
		</Container>
	);
};

export default SearchBarPanelOrganisation;
