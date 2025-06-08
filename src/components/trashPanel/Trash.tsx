import React from "react";
import styled from "styled-components";

// --- Wrapper i główna karta ---
const PageWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	background: #ededed;
	padding: 42px 0 0 64px;
`;

const Title = styled.h1`
	font-size: 30px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 1.5px;
	color: #202020;
	margin-bottom: 32px;
`;

const WhiteCard = styled.div`
	width: 1360px;
	margin: 0;
	background: #fdfdfd;
	border-radius: 20px 20px 10px 10px;
	padding: 30px 20px 20px 20px;
	box-sizing: border-box;
	box-shadow: 0 2px 20px rgba(0, 0, 0, 0.01);
`;

// --- Górna linia z przyciskami i inputami ---
const TopRow = styled.div`
	display: flex;
	gap: 18px;
	align-items: center;
	margin-bottom: 18px;
`;

const AddButton = styled.button`
	display: flex;
	align-items: center;
	background: #ffd100;
	border: none;
	border-radius: 30px;
	height: 40px;
	padding: 0 26px 0 20px;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.6px;
	color: #202020;
	cursor: pointer;
	gap: 8px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);

	&:hover {
		background: #ffe25c;
	}
`;

const AddIcon = styled.img`
	width: 15px;
	height: 15px;
	margin-right: 2px;
`;

const SearchInputWrapper = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 30px;
	height: 40px;
	padding: 0 22px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	min-width: 380px;
	flex: 1 1 0;
	gap: 8px;
`;

const SearchIcon = styled.img`
	width: 15px;
	height: 15px;
`;

const SearchInput = styled.input`
	border: none;
	background: transparent;
	font-size: 12px;
	font-family: Roboto;
	color: #9d9d9d;
	outline: none;
	flex: 1;
`;

const FilterRow = styled.div`
	display: flex;
	gap: 10px;
`;

const FilterBox = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 30px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	height: 40px;
	padding: 0 20px;
	font-size: 12px;
	color: #9d9d9d;
	font-family: Roboto;
	gap: 8px;
`;

const FilterIcon = styled.img`
	width: 17px;
	height: 17px;
`;

// --- lista pojedynczych kart/wierszy ---

const ListWrapper = styled.div`
	margin-top: 24px;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

// --- POJEDYNCZA KARTA/WIERSZ ---
const Row = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 10px;
	min-height: 64px;
	padding: 0 10px 0 0;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.01);
	gap: 20px;
`;

const RowCol1 = styled.div`
	flex: 3;
	display: flex;
	align-items: center;
	gap: 14px;
`;

const TrashIconWrap = styled.div`
	width: 25px;
	height: 25px;
	background: #ffd100;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const TrashIcon = styled.img`
	width: 16px;
	height: 16px;
`;

const RowLabel = styled.div`
	color: #4d4d4d;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 0.6px;
`;

const RowCol2 = styled.div`
	flex: 4;
	display: flex;
	gap: 44px;
	align-items: flex-start;
	padding: 16px 0;
`;

const RowColGroup = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	min-width: 90px;
	gap: 2px;
`;

const ColHeader = styled.div`
	color: #9d9d9d;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 0.5px;
	margin-bottom: 1px;
`;

const RowValue = styled.div`
	color: #202020;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 0.5px;
`;

const RowActions = styled.div`
	display: flex;
	gap: 20px;
	margin-left: 18px;
`;

const ActionBtn = styled.button<{ danger?: boolean }>`
	padding: 9px 20px;
	border-radius: 30px;
	border: none;
	background: ${({ danger }) => (danger ? "#e8ae9e" : "#d9d9d9")};
	color: #202020;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.5px;
	cursor: pointer;
	transition: background 0.18s;
	&:hover {
		background: ${({ danger }) => (danger ? "#f9cac0" : "#e3e3e3")};
	}
`;

// --- DANE PRZYKŁADOWE ---
const exampleRows = [
	{
		label: "Kalendarz odbioru odpadów gabarytowych",
		year: "2025",
		sorted: "TAK",
		date: "08.01.2025",
	},
	{
		label: "Kalendarz odbioru odpadów gabarytowych",
		year: "2024",
		sorted: "TAK",
		date: "5.01.2024",
	},
	{
		label: "Kalendarz odbioru odpadów gabarytowych",
		year: "2023",
		sorted: "TAK",
		date: "11.01.2023",
	},
];

// --- KOMPONENT ---

export default function Trash() {
	return (
		<PageWrapper>
			<Title>Odpady</Title>
			<WhiteCard>
				<TopRow>
					<AddButton>
						<AddIcon src='/assets/trash/plus.svg' alt='plus' />
						Dodaj kalendarz
					</AddButton>
					<SearchInputWrapper>
						<SearchIcon src='/assets/trash/search.svg' alt='search' />
						<SearchInput placeholder='Wyszukaj kalendarz' />
					</SearchInputWrapper>
					<FilterRow>
						<FilterBox>
							<FilterIcon src='/assets/trash/filter.svg' alt='filter' />
							Filtrowanie
						</FilterBox>
						<FilterBox>
							<FilterIcon src='/assets/trash/filter.svg' alt='filter' />
							Sortowanie
						</FilterBox>
					</FilterRow>
				</TopRow>

				<ListWrapper>
					{exampleRows.map((row, i) => (
						<Row key={i}>
							<RowCol1>
								<TrashIconWrap>
									<TrashIcon src='/assets/trash/trash.svg' alt='trash' />
								</TrashIconWrap>
								<RowLabel>{row.label}</RowLabel>
							</RowCol1>
							<RowCol2>
								<RowColGroup>
									<ColHeader>Rok kalendarzowy</ColHeader>
									<RowValue>{row.year}</RowValue>
								</RowColGroup>
								<RowColGroup>
									<ColHeader>Informacja o sortowaniu</ColHeader>
									<RowValue>{row.sorted}</RowValue>
								</RowColGroup>
								<RowColGroup>
									<ColHeader>Data dodania</ColHeader>
									<RowValue>{row.date}</RowValue>
								</RowColGroup>
							</RowCol2>
							<RowActions>
								<ActionBtn>Edytuj terminy</ActionBtn>
								<ActionBtn danger>Usuń kalendarz</ActionBtn>
							</RowActions>
						</Row>
					))}
				</ListWrapper>
			</WhiteCard>
		</PageWrapper>
	);
}
