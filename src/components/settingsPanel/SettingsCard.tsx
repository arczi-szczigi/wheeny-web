"use client";

import React, { useState } from "react";
import styled from "styled-components";

const Card = styled.div`
	width: 100%;
	max-width: 1360px;
	padding: 30px;
	background: #fff;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	gap: 30px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 15px;
	padding-bottom: 20px;
	border-bottom: 1px solid #e0e0e0;
`;

const CardIcon = styled.div`
	width: 50px;
	height: 50px;
	background: #ffd100;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	color: #202020;
`;

const CardTitle = styled.h2`
	color: #202020;
	font-size: 24px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	letter-spacing: 1.2px;
	margin: 0;
`;

const CardContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 25px;
`;

const SettingItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 0;
	border-bottom: 1px solid #f0f0f0;
	
	&:last-child {
		border-bottom: none;
	}
`;

const SettingInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

const SettingTitle = styled.span`
	color: #202020;
	font-size: 18px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.9px;
`;

const SettingDescription = styled.span`
	color: #666;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 0.7px;
`;

const SettingAction = styled.div`
	display: flex;
	align-items: center;
	gap: 15px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
	padding: 10px 20px;
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

const Badge = styled.span<{ variant?: 'success' | 'warning' | 'info' }>`
	padding: 5px 12px;
	border-radius: 15px;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.6px;
	
	${({ variant }) => {
		switch (variant) {
			case 'success':
				return `
					background: #d4edda;
					color: #155724;
				`;
			case 'warning':
				return `
					background: #fff3cd;
					color: #856404;
				`;
			case 'info':
				return `
					background: #d1ecf1;
					color: #0c5460;
				`;
			default:
				return `
					background: #e9ecef;
					color: #495057;
				`;
		}
	}}
`;

interface SettingsCardProps {
	icon: string;
	title: string;
	children: React.ReactNode;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ icon, title, children }) => {
	return (
		<Card>
			<CardHeader>
				<CardIcon>{icon}</CardIcon>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{children}
			</CardContent>
		</Card>
	);
};

export { SettingItem, SettingInfo, SettingTitle, SettingDescription, SettingAction, Button, Badge }; 