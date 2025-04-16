"use client";
import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/managers/login`,
				{ email, password }
			);
			localStorage.setItem("token", response.data.accessToken);
			localStorage.setItem("managerId", response.data.managerId);
			router.push("/dashboard");
		} catch (error: any) {
			alert("Niepoprawny email lub hasło");
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
				<p>Masz już konto w systemie wheeny? Zaloguj się już teraz.</p>

				<Form onSubmit={handleSubmit}>
					<Input
						type='email'
						placeholder='Adres email'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<Input
						type='password'
						placeholder='Wpisz hasło'
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
					<ForgotPassword href='#'>Nie pamiętasz hasła?</ForgotPassword>
					<SubmitButton disabled={loading}>
						{loading ? "Logowanie..." : "Zaloguj się"}
					</SubmitButton>
				</Form>

				<SecondaryButton onClick={goToRegister}>
					Nie masz konta? Zarejestruj się teraz.
				</SecondaryButton>

				<HelpText>
					Problemy z logowaniem? <a href='#'>Poproś o pomoc</a>
				</HelpText>
			</Right>
		</Wrapper>
	);
}
