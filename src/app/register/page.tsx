"use client";
import styled, { keyframes } from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- SPINNER LOADER ---
const spin = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;
const LoaderOverlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(30, 30, 30, 0.38);
	backdrop-filter: blur(2px);
	z-index: 4000;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 16px;
`;
const LoaderSpinner = styled.div`
	width: 64px;
	height: 64px;
	border: 7px solid #ffd60044;
	border-top: 7px solid #ffd600;
	border-radius: 50%;
	animation: ${spin} 1.1s linear infinite;
	margin-bottom: 18px;
`;
const LoaderText = styled.div`
	color: #fff;
	font-size: 1.15rem;
	font-weight: 500;
	letter-spacing: 0.04em;
	text-shadow: 0 2px 18px #000a;
`;

// --- SUCCESS MODAL ---
const SuccessOverlay = styled(LoaderOverlay)`
	background: rgba(30, 30, 30, 0.6);
`;
const SuccessBox = styled.div`
	background: #fff;
	border-radius: 18px;
	padding: 38px 46px 30px 46px;
	box-shadow: 0 0 40px #0003;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14px;
	min-width: 290px;
	text-align: center; /* <-- dodaj to */
`;

// --- RESZTA STYLI ---
const Wrapper = styled.main`
	min-height: 100vh;
	display: grid;
	grid-template-columns: 1fr;
	@media (min-width: 1024px) {
		grid-template-columns: 1fr 1fr;
	}
`;
const Left = styled.div`
	background: linear-gradient(to bottom, #121212, #2e2e00);
	color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 4rem;
	h1 {
		font-size: 2.2rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		line-height: 1.3;
	}
	p {
		font-size: 1rem;
		color: #d1d1d1;
	}
	img {
		margin-bottom: 2rem;
		width: 130px;
	}
`;
const Right = styled.div`
	background: #f9f9fb;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 4rem;
	h2 {
		font-size: 1.6rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
	p {
		font-size: 0.95rem;
		color: #555;
	}
`;
const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-top: 2rem;
`;
const GridTwo = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	@media (min-width: 768px) {
		grid-template-columns: 1fr 1fr;
	}
	gap: 1rem;
`;
const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;
const Label = styled.label`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-weight: 500;
	font-size: 0.9rem;
	color: #444;
	img {
		width: 18px;
		height: 18px;
	}
`;
const Input = styled.input`
	padding: 0.7rem 1rem;
	border: 1px solid #ccc;
	border-radius: 8px;
	font-size: 0.95rem;
	background: #fff;
	&:focus {
		outline: 2px solid #ffd600;
		border-color: transparent;
	}
`;
const CheckboxGroup = styled.div`
	font-size: 0.85rem;
	color: #555;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	label {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
		input {
			margin-top: 0.2rem;
		}
		a {
			color: #0070f3;
			text-decoration: underline;
		}
	}
`;
const SubmitButton = styled.button`
	width: 100%;
	background: #ffd600;
	color: black;
	font-weight: 500;
	padding: 0.9rem;
	font-size: 1rem;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	&:hover {
		background: #e6c200;
	}
`;
const HelpText = styled.div`
	text-align: right;
	font-size: 0.85rem;
	color: #666;
	padding-top: 1rem;
	a {
		text-decoration: underline;
	}
`;
const ErrorBox = styled.div`
	background: #fff4f4;
	border: 1px solid #ffd2d2;
	border-radius: 10px;
	color: #d20000;
	font-size: 0.99rem;
	text-align: center;
	padding: 14px;
	margin-bottom: 14px;
`;

// ----- LABELED INPUT -----
function LabeledInput({
	icon,
	label,
	placeholder,
	name,
	value,
	onChange,
}: {
	icon: string;
	label: string;
	placeholder: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<InputGroup>
			<Label>
				<img src={`/icons/${icon}`} alt='' />
				{label}
			</Label>
			<Input
				type={name === "password" ? "password" : "text"}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
			/>
		</InputGroup>
	);
}

export default function RegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		companyName: "",
		nip: "",
		firstName: "",
		lastName: "",
		city: "",
		zipCode: "",
		street: "",
		buildingNumber: "",
		phone: "",
		email: "",
		password: "",
	});
	const [agreed, setAgreed] = useState(false);
	const [accepted, setAccepted] = useState(false);

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!agreed || !accepted) {
			setError("Musisz zaznaczyć wszystkie wymagane zgody.");
			return;
		}
		setLoading(true);
		setError(null);

		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/managers/register`,
				formData
			);

			if (res.status === 201 || res.status === 200) {
				setSuccess(true);
				setTimeout(() => {
					router.push("/login");
				}, 1400);
			} else {
				setError("Błąd rejestracji. Spróbuj ponownie.");
			}
		} catch (err: any) {
			setError(
				err?.response?.data?.message ||
					"Nie udało się zarejestrować. Spróbuj ponownie."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Wrapper>
			<Left>
				<img src='/icons/wheenyLogo.png' alt='wheeny logo' />
				<h1>
					Już kilka klików dzieli Cię <br /> od świata nowoczesnej komunikacji.
				</h1>
				<p>Dokończ rejestrację już teraz.</p>
			</Left>

			<Right>
				<h2>Wypełnij formularz rejestracyjny</h2>
				<p>
					Czy jesteś właścicielem lub osobą zarządzającą osiedlami?
					<br />
					Jeśli tak, to możesz utworzyć bezpłatne konto zarządcy.
				</p>

				<Form onSubmit={handleSubmit}>
					{error && <ErrorBox>{error}</ErrorBox>}
					<GridTwo>
						<LabeledInput
							icon='buildingIcon.png'
							label='Nazwa firmy'
							name='companyName'
							placeholder='Wpisz nazwę firmy'
							value={formData.companyName}
							onChange={handleChange}
						/>
						<LabeledInput
							icon='buildingIcon.png'
							label='NIP'
							name='nip'
							placeholder='Wpisz NIP'
							value={formData.nip}
							onChange={handleChange}
						/>
					</GridTwo>
					<GridTwo>
						<LabeledInput
							icon='peopleIcon.png'
							label='Imię'
							name='firstName'
							placeholder='Wpisz imię'
							value={formData.firstName}
							onChange={handleChange}
						/>
						<LabeledInput
							icon='peopleIcon.png'
							label='Nazwisko'
							name='lastName'
							placeholder='Wpisz nazwisko'
							value={formData.lastName}
							onChange={handleChange}
						/>
					</GridTwo>
					<GridTwo>
						<LabeledInput
							icon='homeIcon.png'
							label='Miasto'
							name='city'
							placeholder='Wpisz miasto'
							value={formData.city}
							onChange={handleChange}
						/>
						<LabeledInput
							icon='homeIcon.png'
							label='Kod pocztowy'
							name='zipCode'
							placeholder='Wpisz kod pocztowy'
							value={formData.zipCode}
							onChange={handleChange}
						/>
					</GridTwo>
					<GridTwo>
						<LabeledInput
							icon='homeIcon.png'
							label='Ulica'
							name='street'
							placeholder='Wpisz ulicę'
							value={formData.street}
							onChange={handleChange}
						/>
						<LabeledInput
							icon='homeIcon.png'
							label='Numer budynku'
							name='buildingNumber'
							placeholder='Nr budynku'
							value={formData.buildingNumber}
							onChange={handleChange}
						/>
					</GridTwo>
					<GridTwo>
						<LabeledInput
							icon='peopleIcon.png'
							label='Telefon'
							name='phone'
							placeholder='Wpisz numer telefonu'
							value={formData.phone}
							onChange={handleChange}
						/>
						<LabeledInput
							icon='peopleIcon.png'
							label='Email'
							name='email'
							placeholder='Wpisz adres email'
							value={formData.email}
							onChange={handleChange}
						/>
					</GridTwo>
					<LabeledInput
						icon='peopleIcon.png'
						label='Hasło'
						name='password'
						placeholder='Wpisz hasło'
						value={formData.password}
						onChange={handleChange}
					/>
					<CheckboxGroup>
						<label>
							<input
								type='checkbox'
								checked={agreed}
								onChange={() => setAgreed(!agreed)}
							/>
							<span>
								Oświadczam, że wszystkie dane przesłane podczas rejestracji są
								prawdziwe i posiadam prawo do ich użycia.
							</span>
						</label>
						<label>
							<input
								type='checkbox'
								checked={accepted}
								onChange={() => setAccepted(!accepted)}
							/>
							<span>
								Potwierdzam zapoznanie się z <a href='#'>regulaminem</a> oraz{" "}
								<a href='#'>polityką prywatności</a>.
							</span>
						</label>
					</CheckboxGroup>
					<SubmitButton disabled={loading}>Zarejestruj konto</SubmitButton>
					<HelpText>
						Problemy z formularzem? <a href='#'>Poproś o pomoc</a>
					</HelpText>
				</Form>
			</Right>

			{/* LOADER - w trakcie rejestracji */}
			{loading && (
				<LoaderOverlay>
					<LoaderSpinner />
					<LoaderText>Rejestracja konta w toku...</LoaderText>
				</LoaderOverlay>
			)}

			{/* SUKCES */}
			{success && (
				<SuccessOverlay>
					<SuccessBox>
						<div
							style={{ color: "#232323", fontWeight: 600, fontSize: "1.1rem" }}>
							Konto zarejestrowane! <br />
							Zaraz zostaniesz przekierowany do logowania.
						</div>
					</SuccessBox>
				</SuccessOverlay>
			)}
		</Wrapper>
	);
}
