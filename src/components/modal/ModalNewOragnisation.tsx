import React, { useState } from "react";
import styled from "styled-components";
import { FiHome, FiMapPin, FiMail, FiPhone, FiHash } from "react-icons/fi";
import { useMain, Organisation } from "@/context/EstateContext";

// ===== STYLE =====
const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.13);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
`;

const Modal = styled.div`
	width: 680px;
	max-width: 98vw;
	border-radius: 22px;
	background: #fafafa;
	box-shadow: 0 0 40px rgba(0, 0, 0, 0.17);
	padding: 38px 48px 32px 48px;
	display: flex;
	flex-direction: column;
	gap: 18px;
	position: relative;
`;

const HeaderRow = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
`;

const TitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
`;

const Title = styled.div`
	font-size: 23px;
	font-weight: 700;
	color: #232323;
	display: flex;
	align-items: center;
`;

const IconBox = styled.div`
	background: #ffd100;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 14px;
	margin-right: 2px;
`;

const Subtitle = styled.div`
	font-size: 15px;
	color: #8c8c8c;
	font-weight: 400;
	margin: 10px 0 18px 0;
`;

const FieldsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 18px 32px;
	margin-bottom: 6px;
`;

const FieldBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 7px;
`;

const InputRow = styled.div`
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 11px;
	border: 1px solid #e3e3e3;
	padding: 0 12px 0 10px;
	height: 47px;
	transition: border 0.15s;
	&:focus-within {
		border-color: #ffd100;
	}
`;

const IconInput = styled.div`
	color: #bdbdbd;
	font-size: 20px;
	margin-right: 10px;
	display: flex;
	align-items: center;
`;

const Input = styled.input`
	flex: 1;
	border: none;
	background: none;
	font-size: 15px;
	font-family: inherit;
	color: #212121;
	outline: none;
	&::placeholder {
		color: #bdbdbd;
		font-weight: 400;
		font-size: 15px;
	}
`;

const Actions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 20px;
	margin-top: 30px;
`;

const CancelButton = styled.button`
	background: #ededed;
	border: none;
	border-radius: 10px;
	padding: 13px 60px;
	font-size: 17px;
	font-weight: 500;
	color: #535353;
	cursor: pointer;
	transition: background 0.18s;
	&:hover {
		background: #e0e0e0;
	}
`;

const ConfirmButton = styled.button`
	background: #ffd100;
	border: none;
	border-radius: 10px;
	padding: 13px 60px;
	font-size: 17px;
	font-weight: 700;
	color: #232323;
	cursor: pointer;
	box-shadow: 0 0 18px rgba(255, 209, 0, 0.13);
	transition: background 0.18s;
	&:hover {
		background: #ffc800;
	}
`;

const SuccessMsg = styled.div`
	margin: 40px 0 0 0;
	font-size: 22px;
	color: #32a852;
	text-align: center;
	font-weight: 700;
`;

const ErrorMsg = styled.div`
	margin: 10px 0 0 0;
	font-size: 15px;
	color: #c81b1b;
	text-align: center;
`;

// ====== PROPS ======
interface ModalNewOrganisationProps {
	open: boolean;
	onClose: () => void;
	createOrganisation: (
		data: Omit<Organisation, "_id" | "estates" | "createdAt" | "updatedAt">
	) => Promise<void>;
	onSuccess?: () => void; // <-- dodany prop!
}

// ====== COMPONENT ======
const ModalNewOrganisation: React.FC<ModalNewOrganisationProps> = ({
	open,
	onClose,
	createOrganisation,
	onSuccess,
}) => {
	const { manager } = useMain();

	const [form, setForm] = useState({
		companyName: "",
		email: "",
		phone: "",
		city: "",
		zipCode: "",
		street: "",
		buildingNumber: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!manager?._id) {
			setError("Nie można dodać organizacji – brak zalogowanego managera.");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await createOrganisation({
				companyName: form.companyName,
				email: form.email,
				phone: form.phone,
				address: {
					city: form.city,
					zipCode: form.zipCode,
					street: form.street,
					buildingNumber: form.buildingNumber,
				},
				accountStatus: "unconfirmed",
				manager: manager._id,
			});
			setSuccess(true);
			setLoading(false);
			onSuccess?.();
			// Modal nie zamyka się automatycznie – tylko ręcznie!
		} catch (err: any) {
			setError(err.message || "Wystąpił błąd");
			setLoading(false);
		}
	};

	if (!open) return null;

	return (
		<Overlay>
			<Modal>
				<HeaderRow>
					<TitleRow>
						<IconBox>
							<FiHome size={27} />
						</IconBox>
						<Title>Dodaj nową organizację</Title>
					</TitleRow>
				</HeaderRow>
				<Subtitle>
					Wprowadź dane firmy, aby dodać ją do swojego panelu zarządcy.
				</Subtitle>
				{success ? (
					<>
						<SuccessMsg>
							Organizacja została dodana !
							<br />
							Dziękujemy!
						</SuccessMsg>
						<Actions>
							<ConfirmButton type='button' onClick={onClose}>
								Zamknij
							</ConfirmButton>
						</Actions>
					</>
				) : (
					<form onSubmit={handleSubmit} autoComplete='off'>
						<FieldsGrid>
							<FieldBox>
								<label>
									Nazwa firmy
									<InputRow>
										<IconInput>
											<FiHash />
										</IconInput>
										<Input
											name='companyName'
											value={form.companyName}
											onChange={handleChange}
											placeholder='Wpisz nazwę firmy'
											required
										/>
									</InputRow>
								</label>
							</FieldBox>
							<FieldBox>
								<label>
									E-mail firmy
									<InputRow>
										<IconInput>
											<FiMail />
										</IconInput>
										<Input
											name='email'
											type='email'
											value={form.email}
											onChange={handleChange}
											placeholder='Wpisz e-mail firmy'
											required
										/>
									</InputRow>
								</label>
							</FieldBox>
							<FieldBox>
								<label>
									Numer telefonu
									<InputRow>
										<IconInput>
											<FiPhone />
										</IconInput>
										<Input
											name='phone'
											value={form.phone}
											onChange={handleChange}
											placeholder='Podaj numer telefonu'
											required
										/>
									</InputRow>
								</label>
							</FieldBox>
							<FieldBox>
								<label>
									Miasto
									<InputRow>
										<IconInput>
											<FiMapPin />
										</IconInput>
										<Input
											name='city'
											value={form.city}
											onChange={handleChange}
											placeholder='Miasto'
											required
										/>
									</InputRow>
								</label>
							</FieldBox>
							<FieldBox>
								<label>
									Kod pocztowy
									<InputRow>
										<IconInput>
											<FiMapPin />
										</IconInput>
										<Input
											name='zipCode'
											value={form.zipCode}
											onChange={handleChange}
											placeholder='Kod pocztowy'
											required
										/>
									</InputRow>
								</label>
							</FieldBox>
							<FieldBox>
								<label>
									Ulica
									<InputRow>
										<IconInput>
											<FiMapPin />
										</IconInput>
										<Input
											name='street'
											value={form.street}
											onChange={handleChange}
											placeholder='Ulica'
											required
										/>
									</InputRow>
								</label>
							</FieldBox>
							<FieldBox>
								<label>
									Nr budynku
									<InputRow>
										<IconInput>
											<FiHome />
										</IconInput>
										<Input
											name='buildingNumber'
											value={form.buildingNumber}
											onChange={handleChange}
											placeholder='Nr budynku'
											required
										/>
									</InputRow>
								</label>
							</FieldBox>
						</FieldsGrid>
						<Actions>
							<CancelButton type='button' onClick={onClose}>
								Anuluj
							</CancelButton>
							<ConfirmButton type='submit' disabled={loading}>
								{loading ? "Dodawanie..." : "Dodaj organizację"}
							</ConfirmButton>
						</Actions>
					</form>
				)}
				{error && <ErrorMsg>{error}</ErrorMsg>}
			</Modal>
		</Overlay>
	);
};

export default ModalNewOrganisation;
