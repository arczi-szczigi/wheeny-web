import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
	FiPlus,
	FiSearch,
	FiFilter,
	FiChevronDown,
	FiAlignLeft,
} from "react-icons/fi";

// --- STYLES ---
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

const Dropdown = styled.div`
	position: relative;
	display: inline-block;
`;

const DropButton = styled.button<{ $active?: boolean }>`
	display: flex;
	align-items: center;
	gap: 6px;
	background: #fff;
	border: none;
	border-radius: 30px;
	padding: 8px 20px;
	font-size: 12px;
	color: #202020;
	font-family: Roboto, sans-serif;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	cursor: pointer;
	outline: ${({ $active }) => ($active ? "2px solid #FFD100" : "none")};
	margin-right: 8px;
`;

const DropList = styled.ul`
	position: absolute;
	left: 0;
	top: 110%;
	min-width: 150px;
	background: #fff;
	border-radius: 10px;
	box-shadow: 0 8px 32px rgba(30, 30, 30, 0.16);
	list-style: none;
	padding: 6px 0;
	margin: 0;
	z-index: 10000;
`;

const DropItem = styled.li<{ $selected?: boolean }>`
	padding: 8px 18px;
	font-size: 13px;
	cursor: pointer;
	color: #232323;
	background: ${({ $selected }) => ($selected ? "#e1f1ff" : "#fff")};
	font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
	transition: background 0.13s;
	&:hover {
		background: #e1f1ff;
	}
`;

// --- TYPES ---
export type FilterStatus = "all" | "withGarage" | "withoutGarage" | "withStorage" | "withoutStorage" | "withConsent" | "withoutConsent";
export type SortValue = "flatNumber" | "name" | "area" | "flatNumberDesc" | "nameDesc" | "areaDesc" | "numerical" | "numericalDesc";

// --- PROPS ---
export interface SearchBarResidentsProps {
	onAddClick?: () => void;
	onSearch?: (val: string) => void;
	onFilterChange?: (val: FilterStatus) => void;
	onSortChange?: (val: SortValue) => void;
	filterValue?: FilterStatus;
	sortValue?: SortValue;
	placeholder?: string;
}

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
	{ value: "all", label: "Wszyscy" },
	{ value: "withGarage", label: "Z garażem" },
	{ value: "withoutGarage", label: "Bez garażu" },
	{ value: "withStorage", label: "Z komórką" },
	{ value: "withoutStorage", label: "Bez komórki" },
	{ value: "withConsent", label: "Z zgodą" },
	{ value: "withoutConsent", label: "Bez zgody" },
];

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
	{ value: "numerical", label: "Numer mieszkania 1-999" },
	{ value: "numericalDesc", label: "Numer mieszkania 999-1" },
	{ value: "flatNumber", label: "Numer mieszkania A-Z" },
	{ value: "flatNumberDesc", label: "Numer mieszkania Z-A" },
	{ value: "name", label: "Imię i nazwisko A-Z" },
	{ value: "nameDesc", label: "Imię i nazwisko Z-A" },
	{ value: "area", label: "Metraż rosnąco" },
	{ value: "areaDesc", label: "Metraż malejąco" },
];

const SearchBarResidents: React.FC<SearchBarResidentsProps> = ({
	onAddClick,
	onSearch,
	onFilterChange,
	onSortChange,
	filterValue = "all",
	sortValue = "numerical",
	placeholder = "Wyszukaj mieszkańca",
}) => {
	const [search, setSearch] = useState("");
	const [showFilter, setShowFilter] = useState(false);
	const [showSort, setShowSort] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);
	const sortRef = useRef<HTMLDivElement>(null);

	// Obsługa kliknięcia poza dropdownem (zamykanie)
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
				setShowFilter(false);
			}
			if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
				setShowSort(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setSearch(val);
		onSearch?.(val);
	};

	return (
		<Container>
			{/* Dodaj mieszkańca */}
			<AddButton onClick={onAddClick} type='button'>
				<FiPlus size={15} />
				<span>Dodaj właściciela/i</span>
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

			{/* Filtrowanie z dropdownem */}
			<Dropdown ref={filterRef}>
				<DropButton
					$active={showFilter}
					type='button'
					onClick={() => setShowFilter(v => !v)}>
					<FiFilter size={18} />
					Filtrowanie:{" "}
					{FILTER_OPTIONS.find(opt => opt.value === filterValue)?.label}
					<FiChevronDown size={16} />
				</DropButton>
				{showFilter && (
					<DropList>
						{FILTER_OPTIONS.map(opt => (
							<DropItem
								key={opt.value}
								$selected={opt.value === filterValue}
								onClick={() => {
									onFilterChange?.(opt.value);
									setShowFilter(false);
								}}>
								{opt.label}
							</DropItem>
						))}
					</DropList>
				)}
			</Dropdown>

			{/* Sortowanie z dropdownem */}
			<Dropdown ref={sortRef}>
				<DropButton
					$active={showSort}
					type='button'
					onClick={() => setShowSort(v => !v)}>
					<FiAlignLeft size={17} />
					Sortowanie: {SORT_OPTIONS.find(opt => opt.value === sortValue)?.label}
					<FiChevronDown size={16} />
				</DropButton>
				{showSort && (
					<DropList>
						{SORT_OPTIONS.map(opt => (
							<DropItem
								key={opt.value}
								$selected={opt.value === sortValue}
								onClick={() => {
									onSortChange?.(opt.value);
									setShowSort(false);
								}}>
								{opt.label}
							</DropItem>
						))}
					</DropList>
				)}
			</Dropdown>
		</Container>
	);
};

export default SearchBarResidents; 