"use client";

import React, { useState } from "react";
import styled from "styled-components";

const PlansContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 20px;
	margin-top: 20px;
`;

const PlanCard = styled.div<{ isActive?: boolean; isPopular?: boolean }>`
	position: relative;
	padding: 25px;
	border-radius: 15px;
	border: 2px solid ${({ isActive }) => isActive ? '#ffd100' : '#e0e0e0'};
	background: ${({ isActive }) => isActive ? '#fffbf0' : '#fff'};
	transition: all 0.3s;
	cursor: pointer;
	
	&:hover {
		border-color: #ffd100;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	
	${({ isPopular }) => isPopular && `
		&::before {
			content: 'NAJPOPULARNIEJSZY';
			position: absolute;
			top: -10px;
			left: 50%;
			transform: translateX(-50%);
			background: #ffd100;
			color: #202020;
			padding: 5px 15px;
			border-radius: 15px;
			font-size: 12px;
			font-weight: 600;
			letter-spacing: 0.6px;
		}
	`}
`;

const PlanHeader = styled.div`
	text-align: center;
	margin-bottom: 20px;
`;

const PlanName = styled.h3`
	color: #202020;
	font-size: 20px;
	font-family: Roboto, sans-serif;
	font-weight: 600;
	letter-spacing: 1px;
	margin: 0 0 10px 0;
`;

const PlanPrice = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 5px;
	margin-bottom: 5px;
`;

const PriceAmount = styled.span`
	color: #202020;
	font-size: 32px;
	font-family: Roboto, sans-serif;
	font-weight: 700;
	letter-spacing: 1.6px;
`;

const PriceCurrency = styled.span`
	color: #666;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.8px;
`;

const PricePeriod = styled.span`
	color: #666;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 300;
	letter-spacing: 0.7px;
`;

const PlanFeatures = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const FeatureItem = styled.li`
	display: flex;
	align-items: center;
	gap: 10px;
	color: #202020;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 400;
	letter-spacing: 0.7px;
	
	&::before {
		content: '✓';
		color: #28a745;
		font-weight: bold;
		font-size: 16px;
	}
`;

const SelectButton = styled.button<{ isActive?: boolean }>`
	width: 100%;
	padding: 12px 20px;
	margin-top: 20px;
	border-radius: 25px;
	font-size: 14px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.7px;
	border: none;
	cursor: pointer;
	transition: all 0.2s;
	
	${({ isActive }) => isActive ? `
		background: #202020;
		color: white;
		&:hover {
			background: #333;
		}
	` : `
		background: #ffd100;
		color: #202020;
		&:hover {
			background: #e6c000;
		}
	`}
`;

const CurrentPlanBadge = styled.div`
	position: absolute;
	top: 15px;
	right: 15px;
	background: #28a745;
	color: white;
	padding: 5px 10px;
	border-radius: 12px;
	font-size: 12px;
	font-family: Roboto, sans-serif;
	font-weight: 500;
	letter-spacing: 0.6px;
`;

interface PricingPlan {
	id: string;
	name: string;
	price: number;
	currency: string;
	period: string;
	features: string[];
	isPopular?: boolean;
}

const plans: PricingPlan[] = [
	{
		id: 'basic',
		name: 'Podstawowy',
		price: 99,
		currency: 'PLN',
		period: '/miesiąc',
		features: [
			'Do 5 osiedli',
			'Podstawowe raporty',
			'Wsparcie email',
			'1 administrator'
		]
	},
	{
		id: 'professional',
		name: 'Profesjonalny',
		price: 199,
		currency: 'PLN',
		period: '/miesiąc',
		features: [
			'Do 20 osiedli',
			'Zaawansowane raporty',
			'Wsparcie telefoniczne',
			'5 administratorów',
			'Integracje API'
		],
		isPopular: true
	},
	{
		id: 'enterprise',
		name: 'Enterprise',
		price: 399,
		currency: 'PLN',
		period: '/miesiąc',
		features: [
			'Nielimitowane osiedla',
			'Wszystkie raporty',
			'Wsparcie 24/7',
			'Nielimitowani administratorzy',
			'Integracje API',
			'Własne funkcjonalności'
		]
	}
];

export const PricingPlanSelector: React.FC = () => {
	const [selectedPlan, setSelectedPlan] = useState('professional');
	const [currentPlan, setCurrentPlan] = useState('professional');

	const handlePlanSelect = (planId: string) => {
		setSelectedPlan(planId);
	};

	const handleUpgrade = async () => {
		// TODO: Implementacja zmiany planu
		console.log('Zmiana planu na:', selectedPlan);
		// Symulacja API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		setCurrentPlan(selectedPlan);
	};

	return (
		<div>
			<PlansContainer>
				{plans.map((plan) => (
					<PlanCard
						key={plan.id}
						isActive={selectedPlan === plan.id}
						isPopular={plan.isPopular}
						onClick={() => handlePlanSelect(plan.id)}
					>
						{currentPlan === plan.id && (
							<CurrentPlanBadge>Aktualny plan</CurrentPlanBadge>
						)}
						
						<PlanHeader>
							<PlanName>{plan.name}</PlanName>
							<PlanPrice>
								<PriceAmount>{plan.price}</PriceAmount>
								<PriceCurrency>{plan.currency}</PriceCurrency>
								<PricePeriod>{plan.period}</PricePeriod>
							</PlanPrice>
						</PlanHeader>
						
						<PlanFeatures>
							{plan.features.map((feature, index) => (
								<FeatureItem key={index}>{feature}</FeatureItem>
							))}
						</PlanFeatures>
						
						<SelectButton
							isActive={currentPlan === plan.id}
							onClick={(e) => {
								e.stopPropagation();
								if (currentPlan !== plan.id) {
									handleUpgrade();
								}
							}}
						>
							{currentPlan === plan.id ? 'Aktualny plan' : 'Wybierz plan'}
						</SelectButton>
					</PlanCard>
				))}
			</PlansContainer>
		</div>
	);
}; 