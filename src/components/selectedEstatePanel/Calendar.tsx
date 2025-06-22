"use client";

import React, { useState } from "react";
import styled, { css } from "styled-components";

// Dni tygodnia po polsku
const WEEKDAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"];

// Nazwy miesięcy po polsku
const MONTHS = [
	"Styczeń",
	"Luty",
	"Marzec",
	"Kwiecień",
	"Maj",
	"Czerwiec",
	"Lipiec",
	"Sierpień",
	"Wrzesień",
	"Październik",
	"Listopad",
	"Grudzień",
];

const CalendarWrapper = styled.div`
	width: 100%;
	max-width: 400px;
	min-height: 220px;
	background: white;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	position: relative;
	padding: 24px 12px 16px 12px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	box-sizing: border-box;

	@media (max-width: 600px) {
		padding: 8px 2px 8px 2px;
	}
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const MonthTitle = styled.span`
	color: black;
	font-size: 20px;
	font-family: Roboto;
	font-weight: 700;
	letter-spacing: 1px;
	text-align: center;
	flex: 1;
`;

const ArrowButton = styled.button<{ left?: boolean }>`
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	width: 26px;
	height: 26px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: filter 0.1s;
	${({ left }) =>
		left
			? css`
					transform: rotate(90deg);
			  `
			: css`
					transform: rotate(-90deg);
			  `}
	svg {
		width: 22px;
		height: 22px;
		stroke: #202020;
		stroke-width: 2.5px;
		fill: none;
		display: block;
	}
	&:hover {
		filter: brightness(0.7);
	}
`;

const DaysHeader = styled.div`
	margin-top: 24px;
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 0;
`;

const DayName = styled.span`
	color: #4d4d4d;
	font-size: 11px;
	font-family: Roboto;
	font-weight: 300;
	letter-spacing: 0.55px;
	text-align: center;
	user-select: none;
`;

const DaysGrid = styled.div`
	margin-top: 6px;
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 0;
`;

const DayCell = styled.div<{ isToday?: boolean; isOtherMonth?: boolean }>`
	height: 35px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	margin-bottom: 2px;

	span {
		color: ${({ isOtherMonth }) => (isOtherMonth ? "#DADADA" : "#4D4D4D")};
		font-size: 14px;
		font-family: Roboto;
		font-weight: 400;
		letter-spacing: 0.7px;
		z-index: 2;
		position: relative;
		transition: color 0.1s;
		${({ isToday }) =>
			isToday &&
			css`
				color: white;
			`}
	}
	${({ isToday }) =>
		isToday &&
		css`
			&::before {
				content: "";
				display: block;
				position: absolute;
				width: 27px;
				height: 27px;
				background: black;
				border-radius: 50%;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				z-index: 1;
			}
		`}
`;

export default function EstateCalendar() {
	// Zwraca 1-szy dzień miesiąca i ilość dni
	function getMonthData(year: number, month: number) {
		const firstDay = new Date(year, month, 1);
		const firstWeekDay = (firstDay.getDay() + 6) % 7; // Niedziela = 6, Poniedziałek = 0
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const daysInPrevMonth = new Date(year, month, 0).getDate();
		const prevMonthDays = Array.from({ length: firstWeekDay }, (_, i) => ({
			date: new Date(year, month - 1, daysInPrevMonth - firstWeekDay + i + 1),
			otherMonth: true,
		}));
		const thisMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
			date: new Date(year, month, i + 1),
			otherMonth: false,
		}));
		// dopełnij do 6 wierszy (42 komórki)
		const total = prevMonthDays.length + thisMonthDays.length;
		const nextMonthDays = Array.from(
			{ length: total <= 35 ? 42 - total : 0 },
			(_, i) => ({
				date: new Date(year, month + 1, i + 1),
				otherMonth: true,
			})
		);
		return [...prevMonthDays, ...thisMonthDays, ...nextMonthDays];
	}

	// Stan miesiąc/rok
	const today = new Date();
	const [month, setMonth] = useState(today.getMonth());
	const [year, setYear] = useState(today.getFullYear());

	// Wylicz dni do wyświetlenia
	const monthDays = getMonthData(year, month);

	// Pomoc do porównywania dni
	function isSameDay(d1: Date, d2: Date) {
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	}

	function handlePrevMonth() {
		setMonth(prev => {
			if (prev === 0) {
				setYear(y => y - 1);
				return 11;
			}
			return prev - 1;
		});
	}
	function handleNextMonth() {
		setMonth(prev => {
			if (prev === 11) {
				setYear(y => y + 1);
				return 0;
			}
			return prev + 1;
		});
	}

	return (
		<CalendarWrapper>
			<Header>
				<ArrowButton left onClick={handlePrevMonth}>
					<svg viewBox='0 0 24 24'>
						<polyline points='7 10 12 15 17 10' />
					</svg>
				</ArrowButton>
				<MonthTitle>
					{MONTHS[month]} {year}
				</MonthTitle>
				<ArrowButton onClick={handleNextMonth}>
					<svg viewBox='0 0 24 24'>
						<polyline points='7 10 12 15 17 10' />
					</svg>
				</ArrowButton>
			</Header>
			<DaysHeader>
				{WEEKDAYS.map((wd, idx) => (
					<DayName key={idx}>{wd}</DayName>
				))}
			</DaysHeader>
			<DaysGrid>
				{monthDays.map((obj, idx) => {
					const isToday = isSameDay(obj.date, today);
					return (
						<DayCell key={idx} isToday={isToday} isOtherMonth={obj.otherMonth}>
							<span>{obj.date.getDate().toString().padStart(2, "0")}</span>
						</DayCell>
					);
				})}
			</DaysGrid>
		</CalendarWrapper>
	);
}
