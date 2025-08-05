"use client";
import React from "react";
import { useMain } from "@/context/EstateContext";
import { ImportFileModal } from "./ImportFileModal";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	showToast?: (opts: { message: string; type: "success" | "error" }) => void;
	reloadBalances?: () => void;
};

const AddBalancesModal: React.FC<Props> = ({
	isOpen,
	onClose,
	showToast,
	reloadBalances,
}) => {
	const { importBalancesFile } = useMain();

	return (
		<ImportFileModal
			isOpen={isOpen}
			onClose={onClose}
			title='Dodaj saldo mieszkańców'
			templateLabel='Pobierz formatkę Excel'
			templateHref='/assets/templates/Saldo czynszowe - wheeny formatka 2025.xlsx'
			onImport={async file => {
				try {
					await importBalancesFile(file);
					reloadBalances?.();
					showToast?.({ message: "Plik został dodany", type: "success" });
					onClose();
				} catch (e) {
					showToast?.({ message: "Błąd podczas importu pliku", type: "error" });
				}
			}}
		/>
	);
};

export default AddBalancesModal;
