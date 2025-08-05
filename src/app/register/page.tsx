// app/register/page.tsx
"use client";
import styled, { keyframes } from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// === SPINNER LOADER ===
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
	align-items: center;
	justify-content: center;
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

// === SUCCESS MODAL ===
const SuccessOverlay = styled(LoaderOverlay)`
	background: rgba(30, 30, 30, 0.6);
`;
const SuccessBox = styled.div`
	background: #fff;
	border-radius: 18px;
	padding: 38px 46px 30px;
	box-shadow: 0 0 40px #0003;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14px;
	min-width: 290px;
	text-align: center;
`;

// === LAYOUT & FORM ===
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
	justify-content: center; /* vertical centering */
	align-items: flex-start; /* left-align items */
	padding: 4rem;

	img {
		width: 325px; /* half previous size */
		margin: 0 0 2rem 0; /* flush top & left */
		display: block;
	}
	h1 {
		font-size: 2.2rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		line-height: 1.3;
		text-align: left;
	}
	p {
		font-size: 1rem;
		color: #d1d1d1;
		margin: 0;
		text-align: left;
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
	gap: 1rem;
	grid-template-columns: 1fr;
	@media (min-width: 768px) {
		grid-template-columns: 1fr 1fr;
	}
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
	span.required {
		color: #d20000;
		margin-left: 0.2rem;
	}
`;
const Input = styled.input<{ invalid?: boolean }>`
	padding: 0.7rem 1rem;
	border-radius: 8px;
	font-size: 0.95rem;
	border: 1px solid ${({ invalid }) => (invalid ? "#d20000" : "#ccc")};
	background: #fff;
	&:focus {
		outline: 2px solid #ffd600;
		border-color: transparent;
	}
`;
const FieldError = styled.div`
	color: #d20000;
	font-size: 0.85rem;
	margin-top: -4px;
	margin-bottom: 4px;
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
		span.required {
			color: #d20000;
			margin-left: 0.2rem;
		}
	}
`;
const ButtonGroup = styled.div`
	display: flex;
	gap: 1rem;
	margin-top: 1rem;
`;
const BackButton = styled.button`
	flex: 1;
	background: #d6d6d6;
	color: #333;
	font-weight: 400;
	padding: 0.9rem;
	font-size: 0.95rem;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	&:hover {
		background: #bfbfbf;
	}
`;
const SubmitButton = styled.button`
	flex: 1;
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

// === VALIDATION HELPERS ===
const validateEmail = (v: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const validateZip = (v: string) => /^\d{2}-\d{3}$/.test(v.trim());
const validatePhone = (v: string) =>
	/^\+?\d{2}[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3,4}$/.test(v.trim());

// === LABELED INPUT ===
function LabeledInput({
	icon,
	label,
	placeholder,
	name,
	type = "text",
	value,
	onChange,
	error,
}: {
	icon: string;
	label: string;
	placeholder: string;
	name: string;
	type?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
}) {
	return (
		<InputGroup>
			<Label>
				<img src={`/icons/${icon}`} alt='' />
				{label}
				<span className='required'>*</span>
			</Label>
			<Input
				type={type}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				invalid={!!error}
			/>
			{error && <FieldError>{error}</FieldError>}
		</InputGroup>
	);
}

// === REGISTER PAGE ===
export default function RegisterPage() {
	const router = useRouter();
	const [fd, setFd] = useState({
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
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		if (type === "checkbox") {
			name === "agreed" ? setAgreed(checked) : setAccepted(checked);
			setErrors(p => ({ ...p, [name]: "" }));
		} else {
			setFd(p => ({ ...p, [name]: value }));
			setErrors(p => ({ ...p, [name]: "" }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const ne: Record<string, string> = {};
		(
			[
				"companyName",
				"nip",
				"firstName",
				"lastName",
				"city",
				"zipCode",
				"street",
				"buildingNumber",
				"phone",
				"email",
				"password",
			] as const
		).forEach(f => {
			if (!fd[f].trim()) ne[f] = "To pole jest wymagane.";
		});
		if (fd.email && !validateEmail(fd.email))
			ne.email = "Adres musi być w formacie adres@przykład.pl";
		if (fd.zipCode && !validateZip(fd.zipCode))
			ne.zipCode = "Poprawny kod: 44-200";
		if (fd.phone && !validatePhone(fd.phone))
			ne.phone = "Poprawny tel: +48 536 560 764";
		if (fd.password && fd.password.length < 6)
			ne.password = "Hasło musi mieć min. 6 znaków.";
		if (!agreed) ne.agreed = "Musisz potwierdzić prawdziwość danych.";
		if (!accepted) ne.accepted = "Musisz zaakceptować regulamin i politykę.";

		setErrors(ne);
		if (Object.keys(ne).length) return;

		setLoading(true);
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/managers/register`,
				fd
			);
			if (res.status < 300) {
				setSuccess(true);
				setTimeout(() => router.push("/login"), 1400);
			} else {
				setErrors({ form: "Błąd rejestracji. Spróbuj ponownie." });
			}
		} catch (err: any) {
			setErrors({
				form: err?.response?.data?.message || "Nie udało się zarejestrować.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Wrapper>
			<Left>
				<img src='/icons/wheenyLogo.png' alt='wheeny logo' />
				<h1>
					Już kilka klików dzieli Cię
					<br />
					od świata nowoczesnej komunikacji.
				</h1>
				<p>Dokończ rejestrację już teraz.</p>
			</Left>
			<Right>
				<h2>Wypełnij formularz rejestracyjny</h2>
				<p>
					Czy jesteś właścicielem lub osobą zarządzającą osiedlami?
					<br />
					Jeśli tak, utwórz konto zarządcy.
				</p>
				<Form onSubmit={handleSubmit}>
					{errors.form && <ErrorBox>{errors.form}</ErrorBox>}
					<GridTwo>
						<LabeledInput
							icon='buildingIcon.png'
							label='Nazwa firmy'
							placeholder='Wpisz nazwę firmy'
							name='companyName'
							value={fd.companyName}
							onChange={handleChange}
							error={errors.companyName}
						/>
						<LabeledInput
							icon='buildingIcon.png'
							label='NIP'
							placeholder='Wpisz NIP'
							name='nip'
							value={fd.nip}
							onChange={handleChange}
							error={errors.nip}
						/>
					</GridTwo>
					<GridTwo>
						<LabeledInput
							icon='peopleIcon.png'
							label='Imię'
							placeholder='Wpisz imię'
							name='firstName'
							value={fd.firstName}
							onChange={handleChange}
							error={errors.firstName}
						/>
						<LabeledInput
							icon='peopleIcon.png'
							label='Nazwisko'
							placeholder='Wpisz nazwisko'
							name='lastName'
							value={fd.lastName}
							onChange={handleChange}
							error={errors.lastName}
						/>
					</GridTwo>
					<GridTwo>
						<LabeledInput
							icon='homeIcon.png'
							label='Miasto'
							placeholder='Wpisz miasto'
							name='city'
							value={fd.city}
							onChange={handleChange}
							error={errors.city}
						/>
						<LabeledInput
							icon='homeIcon.png'
							label='Kod pocztowy'
							placeholder='np. 00-000'
							name='zipCode'
							value={fd.zipCode}
							onChange={handleChange}
							error={errors.zipCode}
						/>
					</GridTwo>
					<GridTwo>
						<LabeledInput
							icon='homeIcon.png'
							label='Ulica'
							placeholder='Wpisz ulicę'
							name='street'
							value={fd.street}
							onChange={handleChange}
							error={errors.street}
						/>
						<LabeledInput
							icon='homeIcon.png'
							label='Numer budynku'
							placeholder='Nr budynku'
							name='buildingNumber'
							value={fd.buildingNumber}
							onChange={handleChange}
							error={errors.buildingNumber}
						/>
					</GridTwo>
					<GridTwo>
						<LabeledInput
							icon='peopleIcon.png'
							label='Telefon'
							placeholder='np. +48 XXX XXX XXX'
							name='phone'
							value={fd.phone}
							onChange={handleChange}
							error={errors.phone}
						/>
						<LabeledInput
							icon='peopleIcon.png'
							label='Email'
							placeholder='np. adres@przyklad.pl'
							name='email'
							value={fd.email}
							onChange={handleChange}
							error={errors.email}
						/>
					</GridTwo>
					<LabeledInput
						icon='peopleIcon.png'
						label='Hasło'
						placeholder='Wpisz hasło min 6 znaków'
						name='password'
						type='password'
						value={fd.password}
						onChange={handleChange}
						error={errors.password}
					/>
					<CheckboxGroup>
						<label>
							<input
								type='checkbox'
								name='agreed'
								checked={agreed}
								onChange={handleChange}
							/>
							<span>
								Oświadczam, że wszystkie dane są prawdziwe.
								<span className='required'>*</span>
							</span>
						</label>
						{errors.agreed && <FieldError>{errors.agreed}</FieldError>}
						<label>
							<input
								type='checkbox'
								name='accepted'
								checked={accepted}
								onChange={handleChange}
							/>
							<span>
								Akceptuję{" "}
								<a
									href='https://www.wheeny.com/regulamin'
									target='_blank'
									rel='noopener'>
									regulamin
								</a>{" "}
								oraz{" "}
								<a
									href='https://www.wheeny.com/polityka-prywatnosci'
									target='_blank'
									rel='noopener'>
									politykę prywatności
								</a>
								.<span className='required'>*</span>
							</span>
						</label>
						{errors.accepted && <FieldError>{errors.accepted}</FieldError>}
					</CheckboxGroup>
					<ButtonGroup>
						<BackButton type='button' onClick={() => router.back()}>
							Wstecz
						</BackButton>
						<SubmitButton type='submit' disabled={loading}>
							Zarejestruj konto
						</SubmitButton>
					</ButtonGroup>
					<HelpText>
						Problemy z formularzem?{" "}
						<a
							href='https://www.wheeny.com/pomoc'
							target='_blank'
							rel='noopener'>
							Poproś o pomoc
						</a>
					</HelpText>
				</Form>
			</Right>
			{loading && (
				<LoaderOverlay>
					<LoaderSpinner />
					<LoaderText>Rejestracja konta w toku...</LoaderText>
				</LoaderOverlay>
			)}
			{success && (
				<SuccessOverlay>
					<SuccessBox>
						<div
							style={{ color: "#232323", fontWeight: 600, fontSize: "1.1rem" }}>
							Konto zarejestrowane!
							<br />
							Za chwilę przeniesiemy Cię do logowania.
						</div>
					</SuccessBox>
				</SuccessOverlay>
			)}
		</Wrapper>
	);
}
