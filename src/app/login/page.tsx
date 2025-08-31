// app/login/page.tsx
"use client";
import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// === LOADER STYLE ===
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
		width: 290px;
		margin-bottom: 3rem;
		margin-top: -220px;
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
const Input = styled.input<{ invalid?: boolean }>`
	padding: 0.7rem 1rem;
	border: 1px solid ${({ invalid }) => (invalid ? "#d20000" : "#ccc")};
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
	&:disabled {
		opacity: 0.6;
		cursor: default;
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

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [emailInvalid, setEmailInvalid] = useState(false);

	// Jeśli token jest w localStorage, przekieruj od razu
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			router.push("/panelManager");
		}
	}, [router]);

	const validateEmail = (value: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(value.trim());
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// front-endowa walidacja
		if (!validateEmail(email)) {
			setEmailInvalid(true);
			setError("Niepoprawny format adresu email.");
			return;
		}
		if (password.length < 6) {
			setError("Hasło musi mieć co najmniej 6 znaków.");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/managers/login`,
				{ email: email.trim().toLowerCase(), password }
			);
			localStorage.setItem("token", response.data.accessToken);
			// Dodatkowe pola dla współpracowników
			if (response.data.userType) localStorage.setItem("userType", response.data.userType);
			if (response.data.role) localStorage.setItem("role", response.data.role);
			if (response.data.userId) localStorage.setItem("userId", response.data.userId);
			// managerId: dla managera = jego własne userId, dla współpracownika = managerId z backendu
			const normalizedManagerId =
				response.data.userType === "manager"
					? response.data.userId
					: response.data.managerId;
			if (normalizedManagerId) localStorage.setItem("managerId", normalizedManagerId);
			window.location.href = "/panelManager";
		} catch (err: any) {
			// Zmieniona wiadomość błędu:
			setError("Złe dane logowania. Sprawdź adres e-mail i hasło.");
		} finally {
			setLoading(false);
		}
	};

	const goToRegister = () => {
		router.push("/register");
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
				<p>Masz już konto w systemie Wheeny? Zaloguj się już teraz.</p>

				<Form onSubmit={handleSubmit}>
					{error && <ErrorBox>{error}</ErrorBox>}

					<Input
						type='email'
						placeholder='Adres email'
						value={email}
						autoComplete='username'
						onChange={e => {
							setEmail(e.target.value);
							if (emailInvalid) {
								setEmailInvalid(!validateEmail(e.target.value));
							}
						}}
						invalid={emailInvalid}
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

					<ForgotPassword href='/forgot-password'>
						Nie pamiętasz hasła?
					</ForgotPassword>

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
					Problemy z logowaniem?{" "}
					<a href='https://www.wheeny.com/pomoc' target='_blank' rel='noopener'>
						Poproś o pomoc
					</a>
				</HelpText>
			</Right>

			{loading && (
				<LoaderOverlay>
					<LoaderSpinner />
					<LoaderText>Logowanie w toku...</LoaderText>
				</LoaderOverlay>
			)}
		</Wrapper>
	);
}
