"use client";

import React, { useState } from "react";
import styled from "styled-components";

const SettingsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 25px;
`;

const SettingGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

const GroupTitle = styled.h3`
	color: #202020;
	font-size: 18px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	letter-spacing: 0.9px;
	margin: 0;
	padding-bottom: 10px;
	border-bottom: 1px solid #f0f0f0;
`;

const SettingRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 0;
	border-bottom: 1px solid #f8f8f8;
	
	&:last-child {
		border-bottom: none;
	}
`;

const SettingInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
	flex: 1;
`;

const SettingTitle = styled.span`
	color: #202020;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.8px;
`;

const SettingDescription = styled.span`
	color: #666;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 0.7px;
`;

const ToggleSwitch = styled.label`
	position: relative;
	display: inline-block;
	width: 50px;
	height: 24px;
`;

const ToggleInput = styled.input`
	opacity: 0;
	width: 0;
	height: 0;
	
	&:checked + span {
		background-color: #ffd100;
	}
	
	&:checked + span:before {
		transform: translateX(26px);
	}
`;

const ToggleSlider = styled.span`
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: 0.3s;
	border-radius: 24px;
	
	&:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: 0.3s;
		border-radius: 50%;
	}
`;

const Select = styled.select`
	padding: 8px 12px;
	border: 2px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
	background: white;
	cursor: pointer;
	transition: border-color 0.2s;
	
	&:focus {
		outline: none;
		border-color: #ffd100;
	}
`;

const SaveButton = styled.button`
	padding: 12px 24px;
	background: #ffd100;
	color: #202020;
	border: none;
	border-radius: 25px;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.7px;
	cursor: pointer;
	transition: background 0.2s;
	margin-top: 20px;
	
	&:hover {
		background: #e6c000;
	}
	
	&:disabled {
		background: #ccc;
		cursor: not-allowed;
	}
`;

interface NotificationSettings {
	emailNotifications: boolean;
	smsNotifications: boolean;
	pushNotifications: boolean;
	announcementNotifications: boolean;
	paymentNotifications: boolean;
	ticketNotifications: boolean;
	notificationFrequency: string;
	quietHours: boolean;
	quietHoursStart: string;
	quietHoursEnd: string;
}

export const NotificationSettings: React.FC = () => {
	const [settings, setSettings] = useState<NotificationSettings>({
		emailNotifications: true,
		smsNotifications: false,
		pushNotifications: true,
		announcementNotifications: true,
		paymentNotifications: true,
		ticketNotifications: true,
		notificationFrequency: 'immediate',
		quietHours: false,
		quietHoursStart: '22:00',
		quietHoursEnd: '08:00'
	});

	const [isSaving, setIsSaving] = useState(false);

	const handleToggle = (key: keyof NotificationSettings) => {
		setSettings(prev => ({
			...prev,
			[key]: !prev[key]
		}));
	};

	const handleSelect = (key: keyof NotificationSettings, value: string) => {
		setSettings(prev => ({
			...prev,
			[key]: value
		}));
	};

	const handleSave = async () => {
		setIsSaving(true);
		// TODO: Implementacja API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsSaving(false);
	};

	return (
		<SettingsContainer>
			<SettingGroup>
				<GroupTitle>Kanały powiadomień</GroupTitle>
				
				<SettingRow>
					<SettingInfo>
						<SettingTitle>Powiadomienia email</SettingTitle>
						<SettingDescription>Otrzymuj powiadomienia na adres email</SettingDescription>
					</SettingInfo>
					<ToggleSwitch>
						<ToggleInput
							type="checkbox"
							checked={settings.emailNotifications}
							onChange={() => handleToggle('emailNotifications')}
						/>
						<ToggleSlider />
					</ToggleSwitch>
				</SettingRow>
				
				<SettingRow>
					<SettingInfo>
						<SettingTitle>Powiadomienia SMS</SettingTitle>
						<SettingDescription>Otrzymuj powiadomienia SMS</SettingDescription>
					</SettingInfo>
					<ToggleSwitch>
						<ToggleInput
							type="checkbox"
							checked={settings.smsNotifications}
							onChange={() => handleToggle('smsNotifications')}
						/>
						<ToggleSlider />
					</ToggleSwitch>
				</SettingRow>
				
				<SettingRow>
					<SettingInfo>
						<SettingTitle>Powiadomienia push</SettingTitle>
						<SettingDescription>Otrzymuj powiadomienia w aplikacji</SettingDescription>
					</SettingInfo>
					<ToggleSwitch>
						<ToggleInput
							type="checkbox"
							checked={settings.pushNotifications}
							onChange={() => handleToggle('pushNotifications')}
						/>
						<ToggleSlider />
					</ToggleSwitch>
				</SettingRow>
			</SettingGroup>
			
			<SettingGroup>
				<GroupTitle>Typy powiadomień</GroupTitle>
				
				<SettingRow>
					<SettingInfo>
						<SettingTitle>Ogłoszenia</SettingTitle>
						<SettingDescription>Powiadomienia o nowych ogłoszeniach</SettingDescription>
					</SettingInfo>
					<ToggleSwitch>
						<ToggleInput
							type="checkbox"
							checked={settings.announcementNotifications}
							onChange={() => handleToggle('announcementNotifications')}
						/>
						<ToggleSlider />
					</ToggleSwitch>
				</SettingRow>
				
				<SettingRow>
					<SettingInfo>
						<SettingTitle>Płatności</SettingTitle>
						<SettingDescription>Powiadomienia o płatnościach i zaliczkach</SettingDescription>
					</SettingInfo>
					<ToggleSwitch>
						<ToggleInput
							type="checkbox"
							checked={settings.paymentNotifications}
							onChange={() => handleToggle('paymentNotifications')}
						/>
						<ToggleSlider />
					</ToggleSwitch>
				</SettingRow>
				
				<SettingRow>
					<SettingInfo>
						<SettingTitle>Zgłoszenia</SettingTitle>
						<SettingDescription>Powiadomienia o nowych zgłoszeniach</SettingDescription>
					</SettingInfo>
					<ToggleSwitch>
						<ToggleInput
							type="checkbox"
							checked={settings.ticketNotifications}
							onChange={() => handleToggle('ticketNotifications')}
						/>
						<ToggleSlider />
					</ToggleSwitch>
				</SettingRow>
			</SettingGroup>
			
			<SettingGroup>
				<GroupTitle>Ustawienia zaawansowane</GroupTitle>
				
				<SettingRow>
					<SettingInfo>
						<SettingTitle>Częstotliwość powiadomień</SettingTitle>
						<SettingDescription>Jak często chcesz otrzymywać powiadomienia</SettingDescription>
					</SettingInfo>
					<Select
						value={settings.notificationFrequency}
						onChange={(e) => handleSelect('notificationFrequency', e.target.value)}
					>
						<option value="immediate">Natychmiast</option>
						<option value="hourly">Co godzinę</option>
						<option value="daily">Codziennie</option>
						<option value="weekly">Co tydzień</option>
					</Select>
				</SettingRow>
				
				<SettingRow>
					<SettingInfo>
						<SettingTitle>Ciche godziny</SettingTitle>
						<SettingDescription>Nie otrzymuj powiadomień w określonych godzinach</SettingDescription>
					</SettingInfo>
					<ToggleSwitch>
						<ToggleInput
							type="checkbox"
							checked={settings.quietHours}
							onChange={() => handleToggle('quietHours')}
						/>
						<ToggleSlider />
					</ToggleSwitch>
				</SettingRow>
				
				{settings.quietHours && (
					<SettingRow>
						<SettingInfo>
							<SettingTitle>Godziny ciszy</SettingTitle>
							<SettingDescription>Okres, w którym nie będziesz otrzymywać powiadomień</SettingDescription>
						</SettingInfo>
						<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
							<input
								type="time"
								value={settings.quietHoursStart}
								onChange={(e) => handleSelect('quietHoursStart', e.target.value)}
								style={{
									padding: '8px 12px',
									border: '2px solid #e0e0e0',
									borderRadius: '6px',
									fontSize: '14px',
									fontFamily: 'Roboto, sans-serif'
								}}
							/>
							<span style={{ color: '#666', fontSize: '14px' }}>do</span>
							<input
								type="time"
								value={settings.quietHoursEnd}
								onChange={(e) => handleSelect('quietHoursEnd', e.target.value)}
								style={{
									padding: '8px 12px',
									border: '2px solid #e0e0e0',
									borderRadius: '6px',
									fontSize: '14px',
									fontFamily: 'Roboto, sans-serif'
								}}
							/>
						</div>
					</SettingRow>
				)}
			</SettingGroup>
			
			<SaveButton onClick={handleSave} disabled={isSaving}>
				{isSaving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
			</SaveButton>
		</SettingsContainer>
	);
}; 