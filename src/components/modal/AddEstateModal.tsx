// src/components/modal/AddEstateModal.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMain } from "@/context/EstateContext";
import {
	FiHome,
	FiMapPin,
	FiCreditCard,
	FiUsers,
	FiCalendar,
	FiHash,
} from "react-icons/fi";

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
	width: 820px;
	max-width: 99vw;
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

const StepText = styled.div`
	font-size: 19px;
	color: #bdbdbd;
	font-weight: 600;
	margin-left: 14px;
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
	gap: 18px 36px;
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

const ErrorMsg = styled.div`
	margin: 10px 0 0 0;
	font-size: 15px;
	color: #c81b1b;
	text-align: center;
`;

// ========== PROPS ==========
interface AddEstateModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const AddEstateModal: React.FC<AddEstateModalProps> = ({
	open,
	onClose,
	onSuccess,
}) => {
	const { selectedOrganisationId, createEstate } = useMain();

	const [form, setForm] = useState({
		name: "",
		city: "",
		zipCode: "",
		street: "",
		buildingNumber: "",
		bankAccountNumber: "",
		rentDueDate: "",
		numberOfFlats: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// reset po zamknięciu
	useEffect(() => {
		if (!open) {
			setForm({
				name: "",
				city: "",
				zipCode: "",
				street: "",
				buildingNumber: "",
				bankAccountNumber: "",
				rentDueDate: "",
				numberOfFlats: "",
			});
			setError(null);
			setLoading(false);
		}
	}, [open]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		if (!selectedOrganisationId) {
			setError("Nie wybrano organizacji dla osiedla!");
			setLoading(false);
			return;
		}

		try {
			await createEstate({
				name: form.name,
				address: {
					city: form.city,
					zipCode: form.zipCode,
					street: form.street,
					buildingNumber: form.buildingNumber,
				},
				bankAccountNumber: form.bankAccountNumber,
				rentDueDate: form.rentDueDate,
				numberOfFlats: Number(form.numberOfFlats),
				organisation: selectedOrganisationId,
			});
			setLoading(false);
			onSuccess();
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
							<img
								src='/assets/panelEstate/building.png'
								alt='icon'
								width={27}
								height={27}
							/>
						</IconBox>
						<Title>Dodaj nowe osiedle</Title>
					</TitleRow>
					<StepText>1/2</StepText>
				</HeaderRow>
				<Subtitle>
					Wprowadź podstawowe dane osiedla, aby dodać je do panelu. <br />
					Po weryfikacji umowy z osiedlem będziesz mógł/mogła dodać mieszkańców
					i ich dane do obliczania zaliczek.
					<br />
					Weryfikacji osiedla możesz też dokonać później.
				</Subtitle>
				<form onSubmit={handleSubmit} autoComplete='off'>
					<FieldsGrid>
						<FieldBox>
							<label>
								Nazwa osiedla
								<InputRow>
									<IconInput>
										<FiHash />
									</IconInput>
									<Input
										name='name'
										value={form.name}
										onChange={handleChange}
										placeholder='Wpisz nazwę osiedla'
										required
									/>
								</InputRow>
							</label>
						</FieldBox>
						<FieldBox>
							<label>
								Adres osiedla
								<InputRow>
									<IconInput>
										<FiMapPin />
									</IconInput>
									<Input
										name='street'
										value={form.street}
										onChange={handleChange}
										placeholder='Wpisz adres osiedla'
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
										<FiHome />
									</IconInput>
									<Input
										name='city'
										value={form.city}
										onChange={handleChange}
										placeholder='Wpisz miasto'
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
										placeholder='Wpisz kod pocztowy'
										required
									/>
								</InputRow>
							</label>
						</FieldBox>
						<FieldBox>
							<label>
								Nr głównego konta bankowego osiedla
								<InputRow>
									<IconInput>
										<FiCreditCard />
									</IconInput>
									<Input
										name='bankAccountNumber'
										value={form.bankAccountNumber}
										onChange={handleChange}
										placeholder='Wpisz nr konta'
										required
									/>
								</InputRow>
							</label>
						</FieldBox>
						<FieldBox>
							<label>
								Ilość mieszkań
								<InputRow>
									<IconInput>
										<FiUsers />
									</IconInput>
									<Input
										name='numberOfFlats'
										value={form.numberOfFlats}
										onChange={handleChange}
										placeholder='Podaj liczbę'
										required
										type='number'
										min={1}
									/>
								</InputRow>
							</label>
						</FieldBox>
						<FieldBox>
							<label>
								Czynsz płatny do
								<InputRow>
									<IconInput>
										<FiCalendar />
									</IconInput>
									<Input
										name='rentDueDate'
										value={form.rentDueDate}
										onChange={handleChange}
										placeholder='Podaj dzień'
										required
									/>
								</InputRow>
							</label>
						</FieldBox>
						<div />
					</FieldsGrid>
					<Actions>
						<CancelButton type='button' onClick={onClose}>
							Anuluj
						</CancelButton>
						<ConfirmButton type='submit' disabled={loading}>
							{loading ? "Dodawanie osiedla..." : "Dodaj osiedle i zweryfikuj"}
						</ConfirmButton>
					</Actions>
				</form>
				{error && <ErrorMsg>{error}</ErrorMsg>}
			</Modal>
		</Overlay>
	);
};

export default AddEstateModal;
