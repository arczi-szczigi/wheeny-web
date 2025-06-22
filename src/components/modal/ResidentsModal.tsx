import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useAnnouncement } from "@/context/AnnouncementContext";

const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.2);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ModalWrap = styled.div`
	width: 1220px;
	background: #f3f3f3;
	border-radius: 18px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	padding: 42px 42px 32px 42px;
	display: flex;
	flex-direction: column;
	gap: 32px;
`;

const ModalHeaderRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 18px;
	width: 100%;
	justify-content: flex-start;
`;

const IconCircle = styled.div`
	width: 54px;
	height: 54px;
	border-radius: 100px;
	background: #ffd100;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ModalTitle = styled.span`
	color: #202020;
	font-size: 22px;
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 1.1px;
`;

const StepNumber = styled.span`
	margin-left: auto;
	color: #4d4d4d;
	font-size: 18px;
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 0.8px;
`;

const ModalDesc = styled.p`
	color: #9d9d9d;
	font-size: 16px;
	font-family: Roboto;
	font-weight: 300;
	letter-spacing: 0.8px;
	margin: 0 0 18px 0;
`;

const ActionsRow = styled.div`
	width: 100%;
	display: flex;
	gap: 36px;
`;

const ActionBtn = styled.button<{
	color: string;
	active?: boolean;
	disabled?: boolean;
}>`
	flex: 1;
	height: 48px;
	padding: 0 20px;
	background: ${({ color }) => color};
	opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
	border: none;
	border-radius: 32px;
	font-family: Roboto;
	font-weight: 600;
	font-size: 15px;
	color: #202020;
	transition: background 0.12s;
	cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	letter-spacing: 0.5px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const InstructionBox = styled.div`
	width: 700px;
	background: #fff;
	border-radius: 14px;
	padding: 28px 32px 24px 32px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 18px;
`;

const InstructionTitle = styled.div`
	color: #202020;
	font-size: 16px;
	font-family: Roboto;
	font-weight: 500;
	letter-spacing: 0.7px;
	margin-bottom: 10px;
`;

const InstructionList = styled.ol`
	color: #202020;
	font-size: 15px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.7px;
	line-height: 1.8;
	margin: 0 0 0 15px;
	padding: 0;
`;

const DownloadBtn = styled.button`
	margin-top: 15px;
	background: #98c580;
	color: #202020;
	font-size: 13px;
	font-family: Roboto;
	font-weight: 600;
	border-radius: 30px;
	padding: 10px 34px;
	border: none;
	cursor: pointer;
	letter-spacing: 0.5px;
	transition: background 0.15s;
	&:hover {
		background: #7da36d;
	}
`;

const FileRow = styled.div`
	background: #fff;
	border-radius: 12px;
	min-height: 54px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	gap: 14px;
	margin-bottom: 20px;
	border: 1.5px solid #e3e3e3;
`;

const FileLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	color: #4d4d4d;
	font-size: 16px;
	font-family: Roboto;
	font-weight: 400;
`;

const FileInputBtn = styled.button`
	margin-left: auto;
	background: #ededed;
	color: #4d4d4d;
	border-radius: 30px;
	border: 1.5px solid #dadada;
	font-size: 12px;
	font-family: Roboto;
	padding: 11px 32px;
	cursor: pointer;
	font-weight: 500;
	letter-spacing: 0.4px;
	transition: background 0.14s;
	&:hover {
		background: #e0e0e0;
	}
`;

const ModalFooter = styled.div`
	display: flex;
	gap: 36px;
	width: 100%;
`;

const FooterBtn = styled.button<{ color: string; gray?: boolean }>`
	flex: 1;
	height: 48px;
	background: ${({ color }) => color};
	border-radius: 32px;
	border: none;
	font-family: Roboto;
	font-weight: 600;
	font-size: 15px;
	color: ${({ gray }) => (gray ? "#202020" : "#4D4D4D")};
	letter-spacing: 0.5px;
	cursor: pointer;
	transition: background 0.12s;
	opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

const StepCounter = styled.div`
	color: #4d4d4d;
	font-size: 15px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.7px;
	text-align: center;
	margin-top: 16px;
	opacity: 0.7;
`;

const ErrorInfo = styled.div`
	color: #cb3a2b;
	font-size: 15px;
	font-family: Roboto;
	font-weight: 500;
	margin: 12px 0 0 0;
	text-align: left;
`;

// Folder icon
const FolderIcon = () => (
	<img
		src='/assets/documentsEstate/folder.png'
		alt='folder'
		style={{ width: 26, height: 26, display: "block" }}
	/>
);

type Props = {
	open: boolean;
	onClose: () => void;
	estateId: string;
};

const ResidentsModal: React.FC<Props> = ({ open, onClose, estateId }) => {
	const { addResidentsFromFile, loading } = useAnnouncement();

	const [step, setStep] = useState(1);
	const [selectedMode, setSelectedMode] = useState<"bulk" | "single" | null>(
		null
	);
	const [excelFile, setExcelFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	// Reset modal po zamknięciu
	React.useEffect(() => {
		if (!open) {
			setStep(1);
			setSelectedMode(null);
			setExcelFile(null);
			setError(null);
		}
	}, [open]);

	// Obsługa uploadu
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setExcelFile(e.target.files[0]);
			setError(null);
		}
	};

	// Obsługa wysyłki pliku
	const handleUpload = async () => {
		if (!excelFile) {
			setError("Wybierz plik Excela!");
			return;
		}
		try {
			await addResidentsFromFile(estateId, excelFile);
			setStep(1);
			setSelectedMode(null);
			setExcelFile(null);
			onClose();
		} catch (e: any) {
			setError(e.message || "Błąd importu pliku");
		}
	};

	// --- Krok 1 ---
	const renderStep1 = () => (
		<>
			<ModalHeaderRow>
				<IconCircle>
					<FolderIcon />
				</IconCircle>
				<ModalTitle>Dodaj mieszkańców - zbiorczo lub indywidualnie</ModalTitle>
				<StepNumber>1/3</StepNumber>
			</ModalHeaderRow>
			<ModalDesc>
				Dodaj zbiorczo indywidualne mieszkańca do listy najemców.
			</ModalDesc>
			<ActionsRow>
				<ActionBtn color='#D9D9D9' onClick={onClose}>
					Anuluj
				</ActionBtn>
				<ActionBtn
					color='#98C580'
					onClick={() => {
						setSelectedMode("bulk");
						setStep(2);
					}}>
					Dodaj zbiorczo przy pomocy Excela
				</ActionBtn>
				<ActionBtn color='#FFD100' disabled>
					Dodaj ręcznie
				</ActionBtn>
			</ActionsRow>
			<StepCounter>1/3</StepCounter>
		</>
	);

	// --- Krok 2 ---
	const renderStep2 = () => (
		<>
			<ModalHeaderRow>
				<IconCircle>
					<FolderIcon />
				</IconCircle>
				<ModalTitle>Dodaj mieszkańców - zbiorczo lub indywidualnie</ModalTitle>
				<StepNumber>2/3</StepNumber>
			</ModalHeaderRow>

			<InstructionBox>
				<InstructionTitle>INTRUKCJA DODAWANIA MIESZKAŃCÓW:</InstructionTitle>
				<InstructionList>
					<li>Pobierz formatkę pliku Excel.</li>
					<li>Przygotuj plik zgodnie z danymi zawartymi w Excel.</li>
					<li>Dodaj gotowy plik Excel poniżej.</li>
				</InstructionList>
				<DownloadBtn
					type='button'
					onClick={() =>
						window.open("/excel-template/residents.xlsx", "_blank")
					}>
					Pobierz formatkę Excel
				</DownloadBtn>
			</InstructionBox>

			<FileRow>
				<FileLabel>
					<img
						src='/assets/documentsEstate/folder.png'
						width={20}
						height={20}
						style={{ opacity: 0.5 }}
						alt=''
					/>
					Dodaj plik Excela z danymi mieszkańców
				</FileLabel>
				<input
					type='file'
					accept='.xls,.xlsx'
					ref={fileInputRef}
					onChange={handleFileChange}
					style={{ display: "none" }}
				/>
				<FileInputBtn
					type='button'
					onClick={() => fileInputRef.current?.click()}>
					{excelFile ? excelFile.name : "Wybierz plik"}
				</FileInputBtn>
			</FileRow>
			{error && <ErrorInfo>{error}</ErrorInfo>}

			<ModalFooter>
				<FooterBtn
					color='#D9D9D9'
					gray
					onClick={() => {
						setStep(1);
						setSelectedMode(null);
						setExcelFile(null);
					}}
					disabled={loading}>
					Wstecz
				</FooterBtn>
				<FooterBtn
					color='#FFD100'
					onClick={handleUpload}
					disabled={loading || !excelFile}>
					{loading ? "Dodawanie..." : "Dodaj"}
				</FooterBtn>
			</ModalFooter>
			<StepCounter>2/3</StepCounter>
		</>
	);

	if (!open) return null;

	return (
		<Overlay>
			<ModalWrap>
				{step === 1 && renderStep1()}
				{step === 2 && renderStep2()}
			</ModalWrap>
		</Overlay>
	);
};

export default ResidentsModal;
