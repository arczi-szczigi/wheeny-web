"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext"; // POPRAWIONY import!
import type { EstateDocument } from "@/context/EstateContext"; // Typ dokumentu

// --- Styled Components ---

const Container = styled.div`
	width: 100%;
	min-height: 100vh;
	background: #f5f5f5;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
`;

const MainPanel = styled.div`
	width: 1150px;
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
	white-space: nowrap;
`;

// ---------------- LOGIKA KOMPONENTU -----------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function DocumentListBox() {
	const { documents, loading } = useMain(); // POPRAWKA: useMain zamiast useEstates
	const [activeTab, setActiveTab] = useState<number>(0);
	const [search, setSearch] = useState<string>("");

	// Filtrowanie dokumentów po tytule/originalName
	const filteredDocs: EstateDocument[] =
		search.trim().length > 0
			? documents.filter(
					(doc: EstateDocument) =>
						doc.title.toLowerCase().includes(search.toLowerCase()) ||
						doc.originalName.toLowerCase().includes(search.toLowerCase())
			  )
			: documents;

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
						<Input
							placeholder='Wyszukaj dokument'
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
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
								<Th>Oryginalna nazwa</Th>
								<Th>Data dodania</Th>
								<Th>Pobierz</Th>
								<Th></Th>
							</TableHeader>
							{loading ? (
								<TableRow>
									<Td style={{ textAlign: "center", width: "100%" }}>
										Ładowanie...
									</Td>
								</TableRow>
							) : filteredDocs.length === 0 ? (
								<TableRow>
									<Td style={{ textAlign: "center", width: "100%" }}>
										Brak dokumentów.
									</Td>
								</TableRow>
							) : (
								filteredDocs.map((doc: EstateDocument, i: number) => (
									<TableRow key={doc._id || i}>
										<Td style={{ maxWidth: 35, cursor: "pointer" }}>
											<a
												href={`${API_URL}/uploads/${doc.filename}`}
												target='_blank'
												rel='noopener noreferrer'
												title='Pobierz dokument'
												download={doc.originalName}>
												<img
													src='/assets/documentsEstate/pdf.png'
													alt='pdf'
													width={25}
													height={25}
													style={{ display: "block" }}
												/>
											</a>
										</Td>
										<Td style={{ cursor: "pointer" }}>
											<a
												href={`${API_URL}/uploads/${doc.filename}`}
												target='_blank'
												rel='noopener noreferrer'
												title='Pobierz dokument'
												download={doc.originalName}
												style={{
													color: "#4D4D4D",
													textDecoration: "underline",
												}}>
												{doc.title}
											</a>
										</Td>
										<Td>
											{doc.mimetype.replace("application/", "").toUpperCase()}
										</Td>
										<Td>{doc.originalName}</Td>
										<Td>
											{new Date(doc.createdAt).toLocaleDateString("pl-PL")}
										</Td>
										<Td>
											<a
												href={`${API_URL}/uploads/${doc.filename}`}
												target='_blank'
												rel='noopener noreferrer'
												download={doc.originalName}
												style={{ color: "#202020" }}>
												Pobierz
											</a>
										</Td>
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
								))
							)}
						</Table>
					) : (
						<>
							{/* Możesz wrzucić tu logikę pod drugi tab */}
							<TableRow>
								<Td style={{ textAlign: "center", width: "100%" }}>
									Funkcja w budowie...
								</Td>
							</TableRow>
						</>
					)}
				</TableWrapper>
			</MainPanel>
		</Container>
	);
}
