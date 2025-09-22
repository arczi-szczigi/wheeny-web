"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMessages, loremResponses } from "@/context/MessagesContext";

const WRAPPER_WIDTH = 660;

const Wrapper = styled.div`
	width: ${WRAPPER_WIDTH}px;
	height: 760px;
	background: #fdfdfd;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const TopBar = styled.div`
	width: 100%;
	height: 114px;
	background: #f3f3f3;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	display: flex;
	align-items: center;
	gap: 32px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const UserBlock = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	flex: 1;
	padding-left: 32px;
`;

const UserIcon = styled.img`
	width: 18px;
	height: 18px;
`;

const UserDetails = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 2px;
`;

const Name = styled.div`
	color: #202020;
	font-size: 18px;
	font-family: Roboto;
	font-weight: 600;
	letter-spacing: 0.9px;
`;

const DateText = styled.div`
	color: #9d9d9d;
	font-size: 9px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.45px;
`;

const StatusBtn = styled.button`
	height: 40px;
	background: #f3f3f3;
	border-radius: 10px;
	border: 1px solid #202020;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 0 24px 0 14px;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 600;
	color: #202020;
	letter-spacing: 0.6px;
	cursor: pointer;
	margin-right: 12px;
	position: relative;
`;

const StatusDropdown = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	border: 1px solid #e3e3e3;
	border-radius: 10px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	margin-top: 4px;
`;

const StatusOption = styled.div`
	padding: 10px 14px;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 500;
	color: #202020;
	
	&:hover {
		background: #f5f5f5;
	}
	
	&:first-child {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	
	&:last-child {
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
`;

const StatusOptionIcon = styled.img`
	width: 14px;
	height: 14px;
`;

const ResetBtn = styled.button`
	height: 40px;
	background: #FFD100;
	border-radius: 10px;
	border: 1px solid #FFD100;
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 0 20px;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 600;
	color: #202020;
	letter-spacing: 0.6px;
	cursor: pointer;
	margin-right: 32px;
	transition: background 0.2s;
	
	&:hover {
		background: #FFC800;
	}
`;

const StatusIcon = styled.img`
	width: 16px;
	height: 16px;
	margin-right: 3px;
`;

const ArrowIcon = styled.img`
	width: 20px;
	height: 20px;
	margin-left: 6px;
`;

const ConversationBody = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 0 32px;
	padding-bottom: 84px;
	background: transparent;
	overflow-y: auto;
`;

const DateDivider = styled.div`
	width: 100%;
	text-align: center;
	margin: 18px 0 6px 0;
	color: #9d9d9d;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.6px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const MessageRow = styled.div<{ own?: boolean }>`
	display: flex;
	align-items: flex-end;
	margin-bottom: 8px;
	justify-content: ${({ own }) => (own ? "flex-end" : "flex-start")};
`;

const Avatar = styled.img`
	width: 30px;
	height: 30px;
	border-radius: 999px;
	object-fit: cover;
	margin-right: 10px;
	background: #fff;
`;

const Bubble = styled.div<{ own?: boolean }>`
	background: ${({ own }) => (own ? "#F3F3F3" : "#FFD100")};
	color: #202020;
	font-size: 10px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.5px;
	border-radius: 10px;
	padding: 10px 14px;
	max-width: 380px;
	min-width: 60px;
	word-break: break-word;
	margin-right: ${({ own }) => (own ? "0" : "8px")};
	margin-left: ${({ own }) => (own ? "8px" : "0")};
`;

const MsgMeta = styled.div`
	color: #9d9d9d;
	font-size: 8px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.4px;
	margin-left: 8px;
	margin-right: 8px;
	align-self: flex-end;
`;

const Footer = styled.div`
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
	background: transparent;
	padding-bottom: 24px;
	pointer-events: none; /* żeby nie przeszkadzało scrollowi */
`;

const InputBar = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding: 0 32px;
	height: 50px;
	background: #f3f3f3;
	border-radius: 10px;
	border: 1px solid #dadada;
	display: flex;
	align-items: center;
	gap: 10px;
	pointer-events: auto; /* tylko input ma reagować */
`;

const MsgInput = styled.input`
	flex: 1;
	border: none;
	background: transparent;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 400;
	color: #202020;
	letter-spacing: 0.6px;
	outline: none;
	::placeholder {
		color: #9d9d9d;
	}
`;

const FooterIcon = styled.img`
	width: 20px;
	height: 20px;
	cursor: pointer;
`;

// Dostępne statusy
const statusOptions = [
	{ value: "ważna", label: "Ważna", icon: "/assets/msgPanel/check.png" },
	{ value: "w trakcie", label: "W trakcie", icon: "/assets/msgPanel/check.png" },
	{ value: "zamknięta", label: "Zamknięta", icon: "/assets/msgPanel/delete.png" },
	{ value: "odczytana", label: "Odczytana", icon: "/assets/msgPanel/check.png" }
];

export default function ConversationBox() {
	const { 
		people, 
		selectedPersonId, 
		updatePersonStatus, 
		addMessageToPerson, 
		resetPersonMessages 
	} = useMessages();
	
	const [newMessage, setNewMessage] = useState("");
	const [showStatusDropdown, setShowStatusDropdown] = useState(false);
	const dropdownRef = useRef<HTMLButtonElement>(null);
	
	// Znajdź wybraną osobę
	const selectedPerson = people.find(person => person.id === selectedPersonId);
	const messages = selectedPerson?.messages || [];
	
	// Zamknij dropdown przy kliknięciu poza nim
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowStatusDropdown(false);
			}
		};
		
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	
	// Funkcja do dodawania wiadomości użytkownika
	const sendMessage = () => {
		if (newMessage.trim() === "" || !selectedPersonId) return;
		
		const userMessage = {
			id: Date.now(),
			text: newMessage,
			isOwn: true,
			timestamp: "teraz"
		};
		
		addMessageToPerson(selectedPersonId, userMessage);
		setNewMessage("");
		
		// Automatyczna odpowiedź po 1-2 sekundach
		setTimeout(() => {
			const randomResponse = loremResponses[Math.floor(Math.random() * loremResponses.length)];
			const systemMessage = {
				id: Date.now() + 1,
				text: randomResponse,
				isOwn: false,
				timestamp: "teraz"
			};
			addMessageToPerson(selectedPersonId, systemMessage);
		}, 1000 + Math.random() * 1000); // 1-2 sekundy delay
	};
	
	// Funkcja do resetu konwersacji
	const resetConversation = () => {
		if (!selectedPersonId) return;
		resetPersonMessages(selectedPersonId);
		setNewMessage("");
	};
	
	// Funkcja do zmiany statusu
	const changeStatus = (newStatus: string) => {
		if (!selectedPersonId) return;
		updatePersonStatus(selectedPersonId, newStatus as any);
		setShowStatusDropdown(false);
	};
	
	// Obsługa Enter w input
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			sendMessage();
		}
	};

	// Jeśli nie ma wybranej osoby
	if (!selectedPerson) {
		return (
			<Wrapper>
				<div style={{ 
					display: 'flex', 
					alignItems: 'center', 
					justifyContent: 'center', 
					height: '100%',
					color: '#9d9d9d',
					fontSize: '16px',
					textAlign: 'center'
				}}>
					Wybierz osobę z listy, aby zobaczyć konwersację
				</div>
			</Wrapper>
		);
	}

	const currentStatus = statusOptions.find(option => option.value === selectedPerson.status);

	return (
		<Wrapper>
			<TopBar>
				<UserBlock>
					<UserIcon src='/assets/msgPanel/msg.png' alt='msg' />
					<UserDetails>
						<Name>{selectedPerson.name}</Name>
						<DateText>Ostatnia wiadomość: {selectedPerson.time}</DateText>
					</UserDetails>
				</UserBlock>
				<StatusBtn ref={dropdownRef} onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
					<StatusIcon src={currentStatus?.icon || '/assets/msgPanel/check.png'} alt='status' />
					{currentStatus?.label || 'Nieznany'}
					<ArrowIcon src='/assets/msgPanel/down_arrow.png' alt='down' />
					{showStatusDropdown && (
						<StatusDropdown>
							{statusOptions.map((option) => (
								<StatusOption 
									key={option.value} 
									onClick={(e) => {
										e.stopPropagation();
										changeStatus(option.value);
									}}
								>
									<StatusOptionIcon src={option.icon} alt={option.value} />
									{option.label}
								</StatusOption>
							))}
						</StatusDropdown>
					)}
				</StatusBtn>
				<ResetBtn onClick={resetConversation}>
					🔄 Reset
				</ResetBtn>
			</TopBar>

			<ConversationBody>
				{messages.length > 0 && <DateDivider>Dzisiaj</DateDivider>}

				{messages.map((message) => (
					<MessageRow key={message.id} own={message.isOwn}>
						{!message.isOwn && (
							<Avatar src='/assets/msgPanel/dorota.png' alt='System' />
						)}
						<div>
							<Bubble own={message.isOwn}>
								{message.text.split('\n').map((line, i) => (
									<React.Fragment key={i}>
										{line}
										{i < message.text.split('\n').length - 1 && <br />}
									</React.Fragment>
								))}
							</Bubble>
							<MsgMeta>{message.timestamp}</MsgMeta>
						</div>
					</MessageRow>
				))}
				
				{messages.length === 0 && (
					<div style={{ 
						textAlign: 'center', 
						color: '#9d9d9d', 
						marginTop: '50px',
						fontSize: '14px'
					}}>
						Brak wiadomości. Napisz coś aby rozpocząć konwersację!
					</div>
				)}
			</ConversationBody>

			<Footer>
				<InputBar>
					<MsgInput 
						placeholder='Napisz wiadomość...' 
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyPress={handleKeyPress}
					/>
					<FooterIcon src='/assets/msgPanel/download.png' alt='download' />
					<FooterIcon src='/assets/msgPanel/spin.png' alt='spin' />
					<FooterIcon 
						src='/assets/msgPanel/send_gray.png' 
						alt='send' 
						onClick={sendMessage}
						style={{ cursor: 'pointer' }}
					/>
				</InputBar>
			</Footer>
		</Wrapper>
	);
}
