"use client";

import React, { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Label = styled.label`
	color: #202020;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.8px;
`;

const Input = styled.input`
	padding: 12px 16px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.8px;
	transition: border-color 0.2s;
	
	&:focus {
		outline: none;
		border-color: #ffd100;
	}
	
	&::placeholder {
		color: #999;
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	gap: 15px;
	margin-top: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
	padding: 12px 24px;
	border-radius: 25px;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.7px;
	border: none;
	cursor: pointer;
	transition: all 0.2s;
	
	${({ variant }) => {
		switch (variant) {
			case 'primary':
				return `
					background: #ffd100;
					color: #202020;
					&:hover {
						background: #e6c000;
					}
				`;
			case 'secondary':
				return `
					background: #f5f5f5;
					color: #202020;
					&:hover {
						background: #e8e8e8;
					}
				`;
			case 'danger':
				return `
					background: #ff4444;
					color: white;
					&:hover {
						background: #e63939;
					}
				`;
			default:
				return `
					background: #ffd100;
					color: #202020;
					&:hover {
						background: #e6c000;
					}
				`;
		}
	}}
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
	padding: 12px 16px;
	border-radius: 8px;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
	
	${({ type }) => {
		switch (type) {
			case 'success':
				return `
					background: #d4edda;
					color: #155724;
					border: 1px solid #c3e6cb;
				`;
			case 'error':
				return `
					background: #f8d7da;
					color: #721c24;
					border: 1px solid #f5c6cb;
				`;
		}
	}}
`;

export const PasswordChangeForm: React.FC = () => {
	const [formData, setFormData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage(null);

		// Walidacja
		if (formData.newPassword !== formData.confirmPassword) {
			setMessage({ type: 'error', text: 'Nowe hasła nie są identyczne' });
			setIsLoading(false);
			return;
		}

		if (formData.newPassword.length < 8) {
			setMessage({ type: 'error', text: 'Nowe hasło musi mieć co najmniej 8 znaków' });
			setIsLoading(false);
			return;
		}

		try {
			// TODO: Implementacja API call
			await new Promise(resolve => setTimeout(resolve, 1000)); // Symulacja API call
			
			setMessage({ type: 'success', text: 'Hasło zostało zmienione pomyślnie' });
			setFormData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			});
		} catch (error) {
			setMessage({ type: 'error', text: 'Wystąpił błąd podczas zmiany hasła' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		});
		setMessage(null);
	};

	return (
		<Form onSubmit={handleSubmit}>
			{message && (
				<Message type={message.type}>
					{message.text}
				</Message>
			)}
			
			<FormGroup>
				<Label htmlFor="currentPassword">Aktualne hasło</Label>
				<Input
					id="currentPassword"
					type="password"
					value={formData.currentPassword}
					onChange={(e) => handleInputChange('currentPassword', e.target.value)}
					placeholder="Wprowadź aktualne hasło"
					required
				/>
			</FormGroup>
			
			<FormGroup>
				<Label htmlFor="newPassword">Nowe hasło</Label>
				<Input
					id="newPassword"
					type="password"
					value={formData.newPassword}
					onChange={(e) => handleInputChange('newPassword', e.target.value)}
					placeholder="Wprowadź nowe hasło (min. 8 znaków)"
					required
				/>
			</FormGroup>
			
			<FormGroup>
				<Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
				<Input
					id="confirmPassword"
					type="password"
					value={formData.confirmPassword}
					onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
					placeholder="Potwierdź nowe hasło"
					required
				/>
			</FormGroup>
			
			<ButtonGroup>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Zmienianie...' : 'Zmień hasło'}
				</Button>
				<Button type="button" variant="secondary" onClick={handleCancel}>
					Anuluj
				</Button>
			</ButtonGroup>
		</Form>
	);
}; 