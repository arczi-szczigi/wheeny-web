import React, { useState } from "react";
import styled from "styled-components";

// --- Styled Components ---

const Container = styled.div`
	width: 100vw;
	min-height: 100vh;
	background: #f5f5f5;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
`;

const MainPanel = styled.div`
	width: 1400px;
	margin: 42px auto 0 auto;
	background: #fdfdfd;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	box-shadow: 0px 2px 24px 0px #2828280a;
	display: flex;
	flex-direction: column;
	padding: 30px 20px 30px 20px;
	gap: 10px;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding-left: 12px;
`;

const Title = styled.span`
	color: black;
	font-size: 30px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 1.5px;
`;

const SubTitle = styled.span`
	color: #9d9d9d;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	margin-top: 2px;
`;

const TabsWrapper = styled.div`
	display: flex;
	gap: 14px;
	margin-top: 26px;
`;

const TabButton = styled.div<{ active?: boolean }>`
	flex: 1 1 0;
	height: 50px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 0 18px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	letter-spacing: 0.6px;
	font-weight: 600;
	color: #202020;
	background: ${({ active }) => (active ? "#FFD100" : "#D9D9D9")};
	cursor: pointer;
	transition: background 0.18s;
`;

const ControlsBar = styled.div`
	display: flex;
	gap: 18px;
	margin-top: 22px;
`;

const ButtonYellow = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	height: 40px;
	background: #ffd100;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 30px;
	padding: 0 22px;
	border: none;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	color: #202020;
	font-weight: 400;
	letter-spacing: 0.6px;
	cursor: pointer;
`;

const InputWrapper = styled.div`
	display: flex;
	align-items: center;
	height: 40px;
	width: 400px;
	background: #fff;
	border-radius: 30px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border: 0.5px solid #d9d9d9;
	padding: 0 20px;
	gap: 10px;
`;

const Input = styled.input`
	border: none;
	outline: none;
	font-size: 12px;
	color: #202020;
	background: transparent;
	font-family: Roboto, sans-serif;
	width: 100%;
`;

const GrayButton = styled.button`
	display: flex;
	align-items: center;
	gap: 7px;
	height: 40px;
	background: #f3f3f3;
	border-radius: 30px;
	border: none;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	color: #9d9d9d;
	font-weight: 400;
	letter-spacing: 0.6px;
	padding: 0 23px;
	cursor: pointer;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const TableWrapper = styled.div`
	margin-top: 20px;
	width: 100%;
	background: #f3f3f3;
	border-radius: 10px;
	padding: 15px 10px 15px 10px;
`;

const Table = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0px;
`;

const TableHeader = styled.div`
	display: flex;
	align-items: center;
	border-bottom: 0.5px solid #dadada;
	padding: 0 8px;
	min-height: 44px;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #9d9d9d;
	letter-spacing: 0.5px;
	background: transparent;
`;

const Th = styled.div`
	flex: 1 1 0;
	min-width: 100px;
	padding-left: 10px;
	padding-right: 10px;
`;

const TableRow = styled.div<{ faded?: boolean }>`
	display: flex;
	align-items: center;
	min-height: 44px;
	border-bottom: 0.5px solid #dadada;
	background: ${({ faded }) => (faded ? "rgba(255,255,255,0.5)" : "#fff")};
	border-radius: 10px;
	padding: 0 8px;
	opacity: ${({ faded }) => (faded ? 0.5 : 1)};
`;

const Td = styled.div`
	flex: 1 1 0;
	min-width: 100px;
	padding-left: 10px;
	padding-right: 10px;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	color: #202020;
	letter-spacing: 0.5px;
`;

const EditButton = styled.button`
	background: #d9d9d9;
	border: none;
	border-radius: 30px;
	color: #202020;
	font-size: 10px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.5px;
	padding: 9px 24px;
	cursor: pointer;
	margin-left: 8px;
	white-space: nowrap; // <--- dodaj to!
`;

// Komponent renderowany po przełączeniu taba "Dokumenty dla osiedla..."
const ExampleDocRow = styled.div`
	width: 1320px;
	height: 60px;
	padding: 10px;
	background: white;
	border-radius: 10px;
	border-bottom: 0.5px #dadada solid;
	display: flex;
	align-items: center;
	gap: 30px;
	margin-bottom: 8px;
`;

const ExampleDocContent = () => (
	<ExampleDocRow>
		<div style={{ width: 25, height: 25 }}>
			<img
				src='/assets/documentsEstate/pdf.png'
				alt='pdf'
				width={25}
				height={25}
			/>
		</div>
		<div style={{ width: 300 }}>
			<span
				style={{
					color: "#4D4D4D",
					fontSize: 12,
					fontFamily: "Roboto",
					fontWeight: 500,
					letterSpacing: 0.6,
				}}>
				Sprawozdanie roczne osiedla - 2024
			</span>
		</div>
		<div style={{ minWidth: 70, textAlign: "center" }}>
			<span
				style={{
					color: "#202020",
					fontSize: 10,
					fontFamily: "Roboto",
					fontWeight: 500,
					letterSpacing: 0.5,
				}}>
				Dokument
			</span>
		</div>
		<div style={{ minWidth: 130, textAlign: "center" }}>
			<span
				style={{
					color: "#202020",
					fontSize: 10,
					fontFamily: "Roboto",
					fontWeight: 500,
					letterSpacing: 0.5,
				}}>
				Natalia Krakowiak
			</span>
		</div>
		<div style={{ minWidth: 90, textAlign: "center" }}>
			<span
				style={{
					color: "#202020",
					fontSize: 10,
					fontFamily: "Roboto",
					fontWeight: 500,
					letterSpacing: 0.5,
				}}>
				21.01.2025
			</span>
		</div>
		<div style={{ minWidth: 70, textAlign: "center" }}>
			<span
				style={{
					color: "#202020",
					fontSize: 10,
					fontFamily: "Roboto",
					fontWeight: 500,
					letterSpacing: 0.5,
				}}>
				wszyscy
			</span>
		</div>
		<div style={{ display: "flex", gap: 10 }}>
			<div
				style={{
					padding: "9px 20px",
					background: "#D9D9D9",
					borderRadius: 30,
					fontSize: 10,
					fontFamily: "Roboto",
					fontWeight: 400,
					letterSpacing: 0.5,
					color: "#202020",
				}}>
				Podmień dokument
			</div>
			<div
				style={{
					padding: "9px 20px",
					background: "#E8AE9E",
					borderRadius: 30,
					fontSize: 10,
					fontFamily: "Roboto",
					fontWeight: 400,
					letterSpacing: 0.5,
					color: "#202020",
				}}>
				Usuń dokument
			</div>
		</div>
	</ExampleDocRow>
);

// Dane przykładowe do tabeli
const rows = [
	{
		name: "Sprawozdanie roczne osiedla - 2024",
		type: "Dokument",
		person: "Natalia Krakowiak",
		date: "21.01.2025",
		odbiorca: "wszyscy",
	},
	{
		name: "Zawiadomienie o uchwałach",
		type: "Dokument",
		person: "Natalia Krakowiak",
		date: "07.01.2025",
		odbiorca: "wszyscy",
	},
	{
		name: "Pełnomocnictwo - zebranie 2025",
		type: "Dokument",
		person: "Natalia Krakowiak",
		date: "28.12.2025",
		odbiorca: "wszyscy",
	},
];

export default function DocumentListBox() {
	const [activeTab, setActiveTab] = useState(0); // 0 = dokumenty ogólne, 1 = zbiorcze/indywidualne
	return (
		<Container>
			<MainPanel>
				<Header>
					<Title>Dokumenty</Title>
					<SubTitle>
						Przegląd ogólny dokumentów dla wszystkich mieszkańców lub wysyłaj
						indywidualnie dokumenty zbiorcze.
					</SubTitle>
				</Header>
				<TabsWrapper>
					<TabButton active={activeTab === 0} onClick={() => setActiveTab(0)}>
						<img
							src='/assets/documentsEstate/folder.png'
							width={15}
							height={15}
							alt='search'
						/>
						Dokumenty dla osiedla - wszyscy mieszkańcy
					</TabButton>
					<TabButton active={activeTab === 1} onClick={() => setActiveTab(1)}>
						<img
							src='/assets/documentsEstate/folder.png'
							width={15}
							height={15}
							alt='search'
						/>
						Dokumenty zbiorcze i indywidualne
					</TabButton>
				</TabsWrapper>
				<ControlsBar>
					<ButtonYellow>
						<img
							src='/assets/documentsEstate/plus.png'
							width={15}
							height={15}
							alt='plus'
						/>
						Dodaj dokument
					</ButtonYellow>
					<InputWrapper>
						<img
							src='/assets/documentsEstate/search.png'
							width={15}
							height={15}
							alt='search'
						/>
						<Input placeholder='Wyszukaj dokument' />
					</InputWrapper>
					<GrayButton>
						<img
							src='/assets/documentsEstate/filter.png'
							width={20}
							height={20}
							alt='filter'
						/>
						Filtrowanie
					</GrayButton>
					<GrayButton>
						<img
							src='/assets/advancePayment/filter.png'
							width={20}
							height={20}
							alt='sort'
						/>
						Sortowanie
					</GrayButton>
				</ControlsBar>
				<TableWrapper>
					{activeTab === 0 ? (
						<Table>
							<TableHeader>
								<Th style={{ maxWidth: 35 }}></Th>
								<Th>Nazwa dokumentu</Th>
								<Th>Typ pliku</Th>
								<Th>Dodano przez</Th>
								<Th>Data dodania</Th>
								<Th>Odbiorca</Th>
								<Th></Th>
							</TableHeader>
							{rows.map((row, i) => (
								<TableRow key={i}>
									<Td style={{ maxWidth: 35 }}>
										<img
											src='/assets/documentsEstate/pdf.png'
											alt='pdf'
											width={25}
											height={25}
										/>
									</Td>
									<Td>{row.name}</Td>
									<Td>{row.type}</Td>
									<Td>{row.person}</Td>
									<Td>{row.date}</Td>
									<Td>{row.odbiorca}</Td>
									<Td
										style={{
											display: "flex",
											gap: 10,
											justifyContent: "flex-end",
										}}>
										<EditButton>Podmień dokument</EditButton>
										<EditButton style={{ background: "#E8AE9E" }}>
											Usuń dokument
										</EditButton>
									</Td>
								</TableRow>
							))}
						</Table>
					) : (
						// Renderujemy przykładową linijkę z figmy
						<>
							<ExampleDocContent />
							<ExampleDocContent />
							<ExampleDocContent />
						</>
					)}
				</TableWrapper>
			</MainPanel>
		</Container>
	);
}
