"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Interfejsy
export interface Message {
	id: number;
	text: string;
	isOwn: boolean;
	timestamp: string;
}

export interface Person {
	id: string;
	name: string;
	lastMessage: string;
	time: string;
	status: "ważna" | "w trakcie" | "zamknięta" | "odczytana" | "nowa";
	messages: Message[];
}

interface MessagesContextType {
	people: Person[];
	selectedPersonId: string | null;
	activeTab: number;
	setSelectedPersonId: (id: string | null) => void;
	setActiveTab: (tab: number) => void;
	updatePersonStatus: (personId: string, newStatus: Person["status"]) => void;
	addMessageToPerson: (personId: string, message: Message) => void;
	resetPersonMessages: (personId: string) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

// Dane początkowe
const initialPeople: Person[] = [
	{
		id: "1",
		name: "Marek Kowal",
		lastMessage: "Mam pytanie odnośnie nadchodzącego zebrania...",
		time: "11:40",
		status: "ważna",
		messages: [
			{
				id: 1,
				text: "Mam pytanie odnośnie nadchodzącego zebrania...",
				isOwn: false,
				timestamp: "11:40"
			}
		]
	},
	{
		id: "2",
		name: "Ewa Konieczna",
		lastMessage: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "09:10",
		status: "ważna",
		messages: [
			{
				id: 1,
				text: "Dzień dobry, kiedy otrzymamy rozliczenia za ostatni miesiąc?",
				isOwn: false,
				timestamp: "09:10"
			}
		]
	},
	{
		id: "3",
		name: "Dorota Przylas",
		lastMessage: "Dziękujemy za ostatnie spotkanie, było nam...",
		time: "wczoraj",
		status: "w trakcie",
		messages: [
			{
				id: 1,
				text: "Dzień dobry,\nDziękujemy za ostatnie spotkanie, było nam bardzo miło!",
				isOwn: false,
				timestamp: "11:12"
			},
			{
				id: 2,
				text: "Czy możemy zorganizować w przyszłości podobne spotkanie dla mieszkańców osiedla?",
				isOwn: false,
				timestamp: "12:51"
			},
			{
				id: 3,
				text: "Dzień dobry, dziękujemy! Nam też było miło. W czym możemy pomóc dzisiaj?",
				isOwn: true,
				timestamp: "teraz"
			},
			{
				id: 4,
				text: "Oczywiście proszę tylko zaproponować termin. Na pewno uda się coś ustalić.",
				isOwn: true,
				timestamp: "teraz"
			}
		]
	},
	{
		id: "4",
		name: "Rafał Borówka",
		lastMessage: "Szanowni Państwo",
		time: "wczoraj",
		status: "zamknięta",
		messages: [
			{
				id: 1,
				text: "Szanowni Państwo, dziękuję za szybką odpowiedź w sprawie naprawy windy.",
				isOwn: false,
				timestamp: "wczoraj"
			},
			{
				id: 2,
				text: "Sprawa została rozwiązana. Dziękujemy za zgłoszenie!",
				isOwn: true,
				timestamp: "wczoraj"
			}
		]
	},
	{
		id: "5",
		name: "Jacek Izolta",
		lastMessage: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "12.05.2025",
		status: "zamknięta",
		messages: [
			{
				id: 1,
				text: "Dzień dobry, kiedy otrzymamy rozliczenia za media?",
				isOwn: false,
				timestamp: "12.05.2025"
			},
			{
				id: 2,
				text: "Rozliczenia będą dostępne do końca miesiąca.",
				isOwn: true,
				timestamp: "12.05.2025"
			}
		]
	},
	{
		id: "6",
		name: "Stefan Niemas",
		lastMessage: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "01.04.2025",
		status: "odczytana",
		messages: [
			{
				id: 1,
				text: "Dzień dobry, kiedy otrzymamy rozliczenia za parking?",
				isOwn: false,
				timestamp: "01.04.2025"
			}
		]
	},
	{
		id: "7",
		name: "Tomek Cios",
		lastMessage: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "21.04.2025",
		status: "odczytana",
		messages: [
			{
				id: 1,
				text: "Dzień dobry, kiedy otrzymamy rozliczenia za ogrzewanie?",
				isOwn: false,
				timestamp: "21.04.2025"
			}
		]
	},
	{
		id: "8",
		name: "Grzegorz Boberek",
		lastMessage: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "19.03.2025",
		status: "zamknięta",
		messages: [
			{
				id: 1,
				text: "Dzień dobry, kiedy otrzymamy rozliczenia za wodę?",
				isOwn: false,
				timestamp: "19.03.2025"
			},
			{
				id: 2,
				text: "Rozliczenia za wodę są dostępne w panelu mieszkańca.",
				isOwn: true,
				timestamp: "19.03.2025"
			}
		]
	},
	{
		id: "9",
		name: "Ola Szfran",
		lastMessage: "Dzień dobry, kiedy otrzymamy rozliczenia za...",
		time: "02.02.2025",
		status: "zamknięta",
		messages: [
			{
				id: 1,
				text: "Dzień dobry, kiedy otrzymamy rozliczenia za prąd?",
				isOwn: false,
				timestamp: "02.02.2025"
			},
			{
				id: 2,
				text: "Rozliczenia za prąd będą dostępne w przyszłym tygodniu.",
				isOwn: true,
				timestamp: "02.02.2025"
			}
		]
	}
];

// Lorem ipsum odpowiedzi od systemu
export const loremResponses = [
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	"Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
	"Duis aute irure dolor in reprehenderit in voluptate velit esse.",
	"Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
	"Qui officia deserunt mollit anim id est laborum.",
	"Nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
	"Consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
	"Ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
	"Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea."
];

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
	const [people, setPeople] = useState<Person[]>(initialPeople);
	const [selectedPersonId, setSelectedPersonId] = useState<string | null>("3"); // Domyślnie Dorota
	const [activeTab, setActiveTab] = useState(0); // 0 = Wszystkie

	const updatePersonStatus = (personId: string, newStatus: Person["status"]) => {
		setPeople(prev => prev.map(person => 
			person.id === personId 
				? { ...person, status: newStatus }
				: person
		));
	};

	const addMessageToPerson = (personId: string, message: Message) => {
		setPeople(prev => prev.map(person => 
			person.id === personId 
				? { 
					...person, 
					messages: [...person.messages, message],
					lastMessage: message.text.substring(0, 50) + (message.text.length > 50 ? "..." : ""),
					time: message.timestamp
				}
				: person
		));
	};

	const resetPersonMessages = (personId: string) => {
		setPeople(prev => prev.map(person => 
			person.id === personId 
				? { 
					...person, 
					messages: [],
					lastMessage: "Brak wiadomości",
					time: "teraz"
				}
				: person
		));
	};

	return (
		<MessagesContext.Provider value={{
			people,
			selectedPersonId,
			activeTab,
			setSelectedPersonId,
			setActiveTab,
			updatePersonStatus,
			addMessageToPerson,
			resetPersonMessages
		}}>
			{children}
		</MessagesContext.Provider>
	);
};

export const useMessages = () => {
	const context = useContext(MessagesContext);
	if (context === undefined) {
		throw new Error('useMessages must be used within a MessagesProvider');
	}
	return context;
};
