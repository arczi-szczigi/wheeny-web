import React, { useState } from "react";
import styled from "styled-components";
import {
	FiPlus,
	FiSearch,
	FiFilter,
	FiChevronDown,
	FiAlignLeft,
} from "react-icons/fi";

// ---------------------------
// Styled components
// ---------------------------
const Container = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 18px;
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

// ---------------------------
// Component
// ---------------------------
export interface SearchBarPanelEstateProps {
	/** Callback fired when the "Dodaj osiedle" button is clicked */
	onAddClick?: () => void;
	/** Fires on each search input change */
	onSearch?: (value: string) => void;
	/** Opens the filter modal / popover */
	onFilterClick?: () => void;
	/** Opens the sort modal / popover */
	onSortClick?: () => void;
	/** Placeholder for the search input */
	placeholder?: string;
}

/**
 * Search bar panel used on the estates page.
 * Implements add‑estate, search, filter & sort actions in a single compact bar.
 */
const SearchBarPanelEstate: React.FC<SearchBarPanelEstateProps> = ({
	onAddClick,
	onSearch,
	onFilterClick,
	onSortClick,
	placeholder = "Wyszukaj osiedle",
}) => {
	const [search, setSearch] = useState("");

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setSearch(val);
		onSearch?.(val);
	};

	return (
		<Container>
			{/* Add estate */}
			<AddButton onClick={onAddClick} type='button'>
				<FiPlus size={15} />
				<span>Dodaj osiedle</span>
			</AddButton>

			{/* Search */}
			<SearchContainer>
				<FiSearch size={15} color='#9d9d9d' />
				<Input
					value={search}
					onChange={handleSearchChange}
					placeholder={placeholder}
				/>
			</SearchContainer>

			{/* Filter */}
			<ControlButton onClick={onFilterClick} type='button'>
				<FiFilter size={20} />
				<span>Filtrowanie</span>
				<FiChevronDown size={20} />
			</ControlButton>

			{/* Sort */}
			<ControlButton onClick={onSortClick} type='button'>
				<FiAlignLeft size={20} />
				<span>Sortowanie</span>
				<FiChevronDown size={20} />
			</ControlButton>
		</Container>
	);
};

export default SearchBarPanelEstate;
