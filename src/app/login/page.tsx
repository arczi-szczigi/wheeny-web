"use client";
import styled, { keyframes } from "styled-components";
import { useState } from "react";
import axios from "axios";

// === LOADER STYLE (taki jak przy rejestracji) ===
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
		width: 290px; // około 3x większe niż 130px
		margin-bottom: 3rem;
		margin-top: -220px; // przesunięcie do góry
		display: block;
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
		color: #777;
		margin-bottom: 2rem;
	}
`;
const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1.3rem;
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
const SecondaryButton = styled.button`
	width: 100%;
	background: #d6d6d6;
	color: #333;
	font-weight: 400;
	padding: 0.9rem;
	font-size: 0.95rem;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	margin-top: 1rem;
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
const ForgotPassword = styled.a`
	font-size: 0.85rem;
	color: #666;
	text-decoration: underline;
	margin-top: -10px;
	margin-bottom: 10px;
`;
const ErrorBox = styled.div`
	background: #fff4f4;
	border: 1px solid #ffd2d2;
	border-radius: 10px;
	color: #d20000;
	font-size: 0.99rem;
	text-align: center;
	padding: 14px;
	margin-bottom: 10px;
`;

// ================= KOMPONENT ==================

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/managers/login`,
				{ email, password }
			);

			// Ustaw token i managerId do localStorage
			localStorage.setItem("token", response.data.accessToken);
			localStorage.setItem("managerId", response.data.managerId);

			// Pełny reload, żeby contexty pobrały nowe dane
			window.location.href = "/panelManager";
		} catch (error: any) {
			setError(
				error?.response?.data?.message ||
					"Niepoprawny email lub hasło. Spróbuj ponownie."
			);
		} finally {
			setLoading(false);
		}
	};

	const goToRegister = () => {
		window.location.href = "/register";
	};

	return (
		<Wrapper>
			<Left>
				<img src='/icons/wheenyLogo.png' alt='wheeny logo' />
				<h1>
					Nowoczesne narzędzie <br /> dla nowoczesnego zarządcy.
				</h1>
				<p>Wygodna kontrola nad wszystkim, co ważne.</p>
			</Left>

			<Right>
				<h2>Zaloguj się do panelu zarządcy</h2>
				<p>Masz już konto w systemie wheeny? Zaloguj się już teraz.</p>

				<Form onSubmit={handleSubmit}>
					{error && <ErrorBox>{error}</ErrorBox>}
					<Input
						type='email'
						placeholder='Adres email'
						value={email}
						autoComplete='username'
						onChange={e => setEmail(e.target.value)}
						disabled={loading}
					/>
					<Input
						type='password'
						placeholder='Wpisz hasło'
						value={password}
						autoComplete='current-password'
						onChange={e => setPassword(e.target.value)}
						disabled={loading}
					/>
					<ForgotPassword href='#'>Nie pamiętasz hasła?</ForgotPassword>
					<SubmitButton type='submit' disabled={loading}>
						{loading ? "Logowanie..." : "Zaloguj się"}
					</SubmitButton>
				</Form>

				<SecondaryButton
					onClick={goToRegister}
					type='button'
					disabled={loading}>
					Nie masz konta? Zarejestruj się teraz.
				</SecondaryButton>

				<HelpText>
					Problemy z logowaniem? <a href='#'>Poproś o pomoc</a>
				</HelpText>
			</Right>

			{/* LOADER - w trakcie logowania */}
			{loading && (
				<LoaderOverlay>
					<LoaderSpinner />
					<LoaderText>Logowanie w toku...</LoaderText>
				</LoaderOverlay>
			)}
		</Wrapper>
	);
}
