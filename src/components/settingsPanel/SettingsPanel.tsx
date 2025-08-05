"use client";

import React from "react";
import styled from "styled-components";
import { SettingsCard, SettingItem, SettingInfo, SettingTitle, SettingDescription, SettingAction, Button, Badge } from "./SettingsCard";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { PricingPlanSelector } from "./PricingPlanSelector";
import { NotificationSettings } from "./NotificationSettings";

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32px;
	padding-bottom: 40px;
`;

const PageTitle = styled.h1`
	color: #202020;
	font-size: 32px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.6px;
	margin: 0;
	text-align: center;
`;

const PageDescription = styled.p`
	color: #666;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 0.8px;
	margin: 0;
	text-align: center;
	max-width: 600px;
`;

export const SettingsPanel: React.FC = () => {
	return (
		<Wrapper>
			<div style={{ textAlign: 'center', marginBottom: '20px' }}>
				<PageTitle>Ustawienia</PageTitle>
				<PageDescription>
					Zarządzaj swoimi ustawieniami konta, bezpieczeństwem i preferencjami powiadomień
				</PageDescription>
			</div>

			<SettingsCard icon="🔐" title="Bezpieczeństwo">
				<SettingItem>
					<SettingInfo>
						<SettingTitle>Zmiana hasła</SettingTitle>
						<SettingDescription>
							Zmień swoje hasło, aby zachować bezpieczeństwo konta
						</SettingDescription>
					</SettingInfo>
					<SettingAction>
						<Badge variant="info">Wymagane</Badge>
					</SettingAction>
				</SettingItem>
				<PasswordChangeForm />
			</SettingsCard>

			<SettingsCard icon="💳" title="Pakiet cenowy">
				<SettingItem>
					<SettingInfo>
						<SettingTitle>Twój aktualny plan</SettingTitle>
						<SettingDescription>
							Wybierz plan, który najlepiej odpowiada Twoim potrzebom
						</SettingDescription>
					</SettingInfo>
					<SettingAction>
						<Badge variant="success">Profesjonalny</Badge>
					</SettingAction>
				</SettingItem>
				<PricingPlanSelector />
			</SettingsCard>

			<SettingsCard icon="🔔" title="Powiadomienia">
				<SettingItem>
					<SettingInfo>
						<SettingTitle>Preferencje powiadomień</SettingTitle>
						<SettingDescription>
							Dostosuj sposób otrzymywania powiadomień
						</SettingDescription>
					</SettingInfo>
					<SettingAction>
						<Badge variant="warning">Aktywne</Badge>
					</SettingAction>
				</SettingItem>
				<NotificationSettings />
			</SettingsCard>

			<SettingsCard icon="👤" title="Profil">
				<SettingItem>
					<SettingInfo>
						<SettingTitle>Dane osobowe</SettingTitle>
						<SettingDescription>
							Zarządzaj swoimi danymi osobowymi i informacjami kontaktowymi
						</SettingDescription>
					</SettingInfo>
					<SettingAction>
						<Button variant="secondary">Edytuj profil</Button>
					</SettingAction>
				</SettingItem>
				
				<SettingItem>
					<SettingInfo>
						<SettingTitle>Avatar</SettingTitle>
						<SettingDescription>
							Zmień swoje zdjęcie profilowe
						</SettingDescription>
					</SettingInfo>
					<SettingAction>
						<Button variant="secondary">Zmień avatar</Button>
					</SettingAction>
				</SettingItem>
				
				<SettingItem>
					<SettingInfo>
						<SettingTitle>Język</SettingTitle>
						<SettingDescription>
							Wybierz preferowany język interfejsu
						</SettingDescription>
					</SettingInfo>
					<SettingAction>
						<Badge variant="info">Polski</Badge>
					</SettingAction>
				</SettingItem>
			</SettingsCard>

			<SettingsCard icon="🔧" title="Zaawansowane">
				<SettingItem>
					<SettingInfo>
						<SettingTitle>Eksport danych</SettingTitle>
						<SettingDescription>
							Pobierz kopię swoich danych w formacie JSON
						</SettingDescription>
					</SettingInfo>
					<SettingAction>
						<Button variant="secondary">Eksportuj</Button>
					</SettingAction>
				</SettingItem>
				
				<SettingItem>
					<SettingInfo>
						<SettingTitle>Usuń konto</SettingTitle>
						<SettingDescription>
							Trwale usuń swoje konto i wszystkie dane
						</SettingDescription>
					</SettingInfo>
					<SettingAction>
						<Button variant="danger">Usuń konto</Button>
					</SettingAction>
				</SettingItem>
			</SettingsCard>
		</Wrapper>
	);
}; 