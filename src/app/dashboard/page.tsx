"use client";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";

// ================= STYLES =================

const PageWrapper = styled.div`
	display: flex;
	height: 100vh;
	background: #f1f1f1;
	font-family: "Roboto", sans-serif;
`;

const Sidebar = styled.aside`
	width: 240px;
	background: white;
	border-right: 1px solid #ddd;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 2rem 1.2rem;
`;

const Logo = styled.img`
	width: 120px;
	margin-bottom: 2rem;
`;

const MenuSection = styled.div`
	margin-bottom: 2rem;
`;

const Divider = styled.hr`
	border: none;
	border-top: 1px solid #eee;
	margin: 1.5rem 0;
`;

const Menu = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	li {
		display: flex;
		align-items: center;
		font-size: 0.92rem;
		color: #333;
		font-weight: 500;
		gap: 0.6rem;
		cursor: pointer;

		img {
			width: 18px;
			height: 18px;
		}
	}
`;

const BottomPanel = styled.div`
	border-top: 1px solid #eee;
	padding-top: 1.5rem;
	font-size: 0.85rem;
	color: #222;

	button {
		background: #ffd600;
		padding: 0.6rem 1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 500;
		margin-top: 0.5rem;
	}
`;

const DiskUsage = styled.div`
	background: #f4f4f4;
	border-radius: 8px;
	padding: 0.8rem;
	margin-bottom: 1.2rem;
	font-size: 0.75rem;
	color: #333;

	.bar {
		background: #ddd;
		border-radius: 999px;
		height: 8px;
		margin-top: 0.5rem;
		position: relative;
	}

	.fill {
		width: 72%;
		height: 100%;
		background: #333;
		border-radius: 999px;
	}

	.label {
		margin-top: 0.4rem;
		display: flex;
		justify-content: space-between;
		font-size: 0.7rem;
		color: #555;
	}
`;

const Main = styled.main`
	flex: 1;
	padding: 2rem 3rem;
`;

const Header = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
`;

const Title = styled.h1`
	font-size: 1.4rem;
	font-weight: 700;
`;

const Avatar = styled.div`
	display: flex;
	align-items: center;
	gap: 0.7rem;
	background: #fff;
	border-radius: 9999px;
	padding: 0.4rem 0.8rem;

	img {
		width: 32px;
		height: 32px;
		border-radius: 50%;
	}
	span {
		font-weight: 500;
		font-size: 0.9rem;
	}
`;

const InfoCards = styled.div`
	display: flex;
	gap: 1rem;
	margin-bottom: 2rem;
`;

interface InfoCardProps {
	color?: string;
}

const InfoCard = styled.div<InfoCardProps>`
	background: white;
	border-radius: 12px;
	padding: 1rem 1.2rem;
	min-width: 160px;
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;

	h2 {
		font-size: 1.5rem;
		font-weight: bold;
	}

	p {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		color: #666;
	}

	.icon-bg {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 58px;
		height: 58px;
		background: ${props => props.color || "#ccc"};
		border-top-left-radius: 100%;
		z-index: 1;
	}

	.icon-bg img {
		position: absolute;
		bottom: 0.3rem;
		right: 0.3rem;
		width: 18px;
		height: 18px;
		z-index: 2;
	}
`;

const CalendarCard = styled.div`
	background: #222;
	color: white;
	border-radius: 12px;
	padding: 1.2rem;
	min-width: 200px;

	h4 {
		font-size: 0.85rem;
		margin-bottom: 0.4rem;
		color: #aaa;
	}
	h2 {
		font-size: 1.3rem;
		font-weight: bold;
	}
`;

const TopControls = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 2rem;

	input {
		padding: 0.7rem 1rem;
		border-radius: 9999px;
		border: 1px solid #ccc;
	}

	input:nth-of-type(1) {
		width: 520px;
	}

	input:nth-of-type(2),
	input:nth-of-type(3) {
		width: 160px;
	}

	button {
		background: #ffd600;
		color: black;
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		font-weight: 500;
	}
`;

const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
`;

const Modal = styled.div`
	background: white;
	border-radius: 12px;
	padding: 2rem;
	width: 920px;
	max-width: 95%;
`;

const PopupTitle = styled.h2`
	font-size: 1.2rem;
	font-weight: 700;
	margin-bottom: 0.5rem;
`;

const PopupSubtext = styled.p`
	font-size: 0.9rem;
	color: #555;
	margin-bottom: 2rem;
`;

const GridTwo = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.2rem;
	margin-bottom: 1rem;
`;

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
`;

const Label = styled.label`
	font-size: 0.9rem;
	color: #222;
	font-weight: 500;
	margin-bottom: 0.3rem;
`;

const Input = styled.input`
	padding: 0.7rem 1rem;
	border-radius: 8px;
	border: 1px solid #ccc;
	background: #f9f9f9;
	font-size: 0.9rem;
`;

const PopupButtons = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 2rem;
`;

const CancelButton = styled.button`
	background: #e0e0e0;
	border: none;
	border-radius: 8px;
	padding: 0.8rem 2rem;
	cursor: pointer;
	font-weight: 500;
`;

const SubmitButton = styled.button`
	background: #ffd600;
	border: none;
	border-radius: 8px;
	padding: 0.8rem 2rem;
	cursor: pointer;
	font-weight: 500;
`;

// ================= KOMPONENT GŁÓWNY =================

export default function DashboardPage() {
	// Stan managera
	const [manager, setManager] = useState<{
		firstName: string;
		lastName: string;
	} | null>(null);

	// Data aktualna
	const [currentDate, setCurrentDate] = useState("");

	// Czy pop-up jest widoczny
	const [showModal, setShowModal] = useState(false);

	// Pola formularza
	const [estateName, setEstateName] = useState("");
	const [street, setStreet] = useState("");
	const [buildingNumber, setBuildingNumber] = useState("");
	const [city, setCity] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [bankAccountNumber, setBankAccountNumber] = useState("");
	const [rentDueDate, setRentDueDate] = useState("");
	const [numberOfFlats, setNumberOfFlats] = useState("");

	// Pobranie danych managera
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;

		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/managers/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(res => {
				setManager(res.data);
			})
			.catch(err => {
				console.error("Błąd pobierania danych managera", err);
			});
	}, []);

	// Inicjalizacja daty
	useEffect(() => {
		const date = new Date();
		const formatted = date.toLocaleDateString("pl-PL", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
		setCurrentDate(formatted);
	}, []);

	// Funkcja wysyłająca dane do endpointa
	const handleSubmit = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			alert("Brak tokena. Zaloguj się ponownie.");
			return;
		}

		// Przygotowanie payload
		const payload = {
			// Zakładamy, że backend nie potrzebuje nazwy w polu 'name',
			// ale jeśli wymaga, można dodać:
			name: estateName,
			address: {
				city: city,
				zipCode: zipCode,
				street: street,
				buildingNumber: buildingNumber,
			},
			bankAccountNumber: bankAccountNumber,
			rentDueDate: rentDueDate,
			numberOfFlats: parseInt(numberOfFlats, 10) || 0,
		};

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/estates`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log("Dodano osiedle:", response.data);

			// Zamknięcie modala i wyczyszczenie pól
			setShowModal(false);
			setEstateName("");
			setStreet("");
			setBuildingNumber("");
			setCity("");
			setZipCode("");
			setBankAccountNumber("");
			setRentDueDate("");
			setNumberOfFlats("");

			alert("Osiedle zostało dodane!");
		} catch (error) {
			console.error("Błąd podczas dodawania osiedla:", error);
			alert("Nie udało się dodać osiedla. Sprawdź dane.");
		}
	};

	return (
		<PageWrapper>
			<Sidebar>
				<div>
					<Logo src='/icons/wheenyLogo.png' alt='logo' />
					<MenuSection>
						<Menu>
							<li>
								<img src='/icons/homeIcon.png' alt='' /> Panel wyboru osiedla
							</li>
							<li>
								<img src='/icons/homeIcon.png' alt='' /> Start
							</li>
							<li>
								<img src='/icons/notificationIcon.png' alt='' /> Wiadomości
							</li>
							<li>
								<img src='/icons/commentIcon.png' alt='' /> Zgłoszenia
							</li>
							<li>
								<img src='/icons/documentIcon.png' alt='' /> Rozliczenia osiedla
							</li>
							<li>
								<img src='/icons/folderIcon.png' alt='' /> Dokumenty
							</li>
							<li>
								<img src='/icons/noteIcon.png' alt='' /> Dodaj ogłoszenie
							</li>
							<li>
								<img src='/icons/binIcon.png' alt='' /> Odpady
							</li>
							<li>
								<img src='/icons/socialGroupIcon.png' alt='' /> Grupa
								społecznościowa
							</li>
							<li>
								<img src='/icons/tenantsIcon.png' alt='' /> Najemcy
							</li>
							<li>
								<img src='/icons/cityIcon.png' alt='' /> Dane osiedla
							</li>
						</Menu>
						<Divider />
						<Menu>
							<li>
								<img src='/icons/yourEstateIcon.png' alt='' /> Twoje osiedla
							</li>
							<li>
								<img src='/icons/yourOrganisationIcon.png' alt='' /> Twoja
								organizacja
							</li>
							<li>
								<img src='/icons/workersIcon.png' alt='' /> Współpracownicy
							</li>
							<li>
								<img src='/icons/settingsIcon.png' alt='' /> Ustawienia
							</li>
						</Menu>
					</MenuSection>
				</div>
				<div>
					<DiskUsage>
						<strong>Konto podstawowe</strong>
						<div className='bar'>
							<div className='fill'></div>
						</div>
						<div className='label'>
							<span>zajęte 72%</span>
							<span>z 1GB miejsca na dysku.</span>
						</div>
					</DiskUsage>
					<BottomPanel>
						<strong>Wsparcie</strong>
						<p>Skontaktuj się z nami</p>
						<button>Centrum pomocy</button>
					</BottomPanel>
				</div>
			</Sidebar>
			<Main>
				<Header>
					<Title>
						Dzień dobry{" "}
						{manager ? `${manager.firstName} ${manager.lastName}` : "..."}!
					</Title>
					<Avatar>
						<img src='/icons/avatar.png' alt='user' />
						<span>
							{manager ? `${manager.firstName} ${manager.lastName}` : ""}
						</span>
					</Avatar>
				</Header>

				<InfoCards>
					<InfoCard color='#ffd600'>
						<h2>7</h2>
						<p>Nowych wiadomości od mieszkańców</p>
						<div className='icon-bg'>
							<img src='/icons/notificationIcon.png' alt='' />
						</div>
					</InfoCard>
					<InfoCard color='#ffeb3b'>
						<h2>2</h2>
						<p>Nowe zgłoszenia od mieszkańców</p>
						<div className='icon-bg'>
							<img src='/icons/commentIcon.png' alt='' />
						</div>
					</InfoCard>
					<InfoCard color='#ef9a9a'>
						<h2>11</h2>
						<p>Zgłoszeń w trakcie</p>
						<div className='icon-bg'>
							<img src='/icons/playIcon.png' alt='' />
						</div>
					</InfoCard>
					<InfoCard color='#bbdefb'>
						<h2>37</h2>
						<p>Zamkniętych zgłoszeń</p>
						<div className='icon-bg'>
							<img src='/icons/downloadIcon.png' alt='' />
						</div>
					</InfoCard>
					<CalendarCard>
						<h4>Dziś mamy:</h4>
						<h2>{currentDate}</h2>
					</CalendarCard>
				</InfoCards>

				<TopControls>
					<button onClick={() => setShowModal(true)}>+ Dodaj osiedle</button>
					<input type='text' placeholder='Wyszukaj dokument' />
					<input type='text' placeholder='Filtrowanie' />
					<input type='text' placeholder='Sortowanie' />
				</TopControls>

				{showModal && (
					<Overlay>
						<Modal>
							<PopupTitle>Dodaj nowe osiedle</PopupTitle>
							<PopupSubtext>
								Wprowadź podstawowe dane osiedla, aby dodać je do panelu. Po
								weryfikacji umowy z osiedlem będziesz mógł/mogła dodać
								mieszkańców i ich dane do obliczania zaliczek. Weryfikacji
								osiedla możesz też dokonać później.
							</PopupSubtext>
							<GridTwo>
								<InputGroup>
									<Label>Nazwa osiedla</Label>
									<Input
										type='text'
										value={estateName}
										onChange={e => setEstateName(e.target.value)}
										placeholder='Wpisz nazwę osiedla'
									/>
								</InputGroup>
								<InputGroup>
									<Label>Ulica</Label>
									<Input
										type='text'
										value={street}
										onChange={e => setStreet(e.target.value)}
										placeholder='np. Zielona'
									/>
								</InputGroup>
							</GridTwo>
							<GridTwo>
								<InputGroup>
									<Label>Numer budynku</Label>
									<Input
										type='text'
										value={buildingNumber}
										onChange={e => setBuildingNumber(e.target.value)}
										placeholder='np. 15A'
									/>
								</InputGroup>
								<InputGroup>
									<Label>Miasto</Label>
									<Input
										type='text'
										value={city}
										onChange={e => setCity(e.target.value)}
										placeholder='Wpisz miasto'
									/>
								</InputGroup>
							</GridTwo>
							<GridTwo>
								<InputGroup>
									<Label>Kod pocztowy</Label>
									<Input
										type='text'
										value={zipCode}
										onChange={e => setZipCode(e.target.value)}
										placeholder='np. 30-001'
									/>
								</InputGroup>
								<InputGroup>
									<Label>Nr głównego konta bankowego osiedla</Label>
									<Input
										type='text'
										value={bankAccountNumber}
										onChange={e => setBankAccountNumber(e.target.value)}
										placeholder='np. 123456789012...'
									/>
								</InputGroup>
							</GridTwo>
							<GridTwo>
								<InputGroup>
									<Label>Czynsz płatny do</Label>
									<Input
										type='text'
										value={rentDueDate}
										onChange={e => setRentDueDate(e.target.value)}
										placeholder='np. 10. każdego miesiąca'
									/>
								</InputGroup>
								<InputGroup>
									<Label>Ilość mieszkań</Label>
									<Input
										type='text'
										value={numberOfFlats}
										onChange={e => setNumberOfFlats(e.target.value)}
										placeholder='np. 120'
									/>
								</InputGroup>
							</GridTwo>
							<PopupButtons>
								<CancelButton onClick={() => setShowModal(false)}>
									Anuluj
								</CancelButton>
								<SubmitButton onClick={handleSubmit}>
									Dodaj osiedle i zweryfikuj
								</SubmitButton>
							</PopupButtons>
						</Modal>
					</Overlay>
				)}
			</Main>
		</PageWrapper>
	);
}
