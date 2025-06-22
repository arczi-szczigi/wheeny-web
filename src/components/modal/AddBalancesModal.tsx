"use client";

import React from "react";
import { useMain } from "@/context/EstateContext";
import { ImportFileModal } from "./ImportFileModal";

type Props = { isOpen: boolean; onClose: () => void };

export const AddBalancesModal: React.FC<Props> = ({ isOpen, onClose }) => {
	const { importBalancesFile } = useMain();

	return (
		<ImportFileModal
			isOpen={isOpen}
			onClose={onClose}
			title='Dodaj aktualne saldo mieszkańców'
			templateLabel='Pobierz formatkę Excel'
			templateHref='/assets/templates/balances_template.xlsx' // <- podmień ścieżkę jeśli inna
			onImport={importBalancesFile}
		/>
	);
};
