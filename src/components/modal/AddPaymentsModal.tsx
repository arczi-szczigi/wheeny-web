"use client";

import React from "react";
import { useMain } from "@/context/EstateContext";
import { ImportFileModal } from "./ImportFileModal";

type Props = { isOpen: boolean; onClose: () => void };

export const AddPaymentsModal: React.FC<Props> = ({ isOpen, onClose }) => {
	const { importPaymentsFile } = useMain();

	return (
		<ImportFileModal
			isOpen={isOpen}
			onClose={onClose}
			title='Dodaj miesięczne zaliczki'
			templateLabel='Pobierz formatkę Excel'
			templateHref='/assets/templates/payments_template.xlsx' // <- podmień ścieżkę jeśli inna
			onImport={importPaymentsFile}
		/>
	);
};
