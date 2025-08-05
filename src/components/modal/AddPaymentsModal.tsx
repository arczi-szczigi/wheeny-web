"use client";
import React from "react";
import { useMain } from "@/context/EstateContext";
import { ImportFileModal } from "./ImportFileModal";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	showToast?: (opts: { message: string; type: "success" | "error" }) => void;
	reloadPayments?: () => void;
};

const AddPaymentsModal: React.FC<Props> = ({
	isOpen,
	onClose,
	showToast,
	reloadPayments,
}) => {
	const { importPaymentsFile } = useMain();

	return (
		<ImportFileModal
			isOpen={isOpen}
			onClose={onClose}
			title='Dodaj miesięczne zaliczki'
			templateLabel='Pobierz formatkę Excel'
			templateHref='/assets/templates/Zaliczki czynszowe - wheeny formatka 2025.xlsx'
			onImport={async file => {
				try {
					await importPaymentsFile(file);
					reloadPayments?.();
					showToast?.({ message: "Plik został dodany", type: "success" });
					onClose();
				} catch (e) {
					showToast?.({ message: "Błąd podczas importu pliku", type: "error" });
				}
			}}
		/>
	);
};

export default AddPaymentsModal;
