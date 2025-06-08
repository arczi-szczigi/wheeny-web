import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	width: 255px;
	height: 780px;
	background: #fdfdfd;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	padding: 32px 0 0 0;
	box-sizing: border-box;
	align-items: flex-start;
`;

const Avatar = styled.img`
	width: 50px;
	height: 50px;
	border-radius: 100%;
	object-fit: cover;
	margin-left: 32px;
	margin-bottom: 18px;
`;

const Name = styled.div`
	color: #202020;
	font-size: 18px;
	font-family: Roboto;
	font-weight: 600;
	letter-spacing: 0.9px;
	margin-left: 32px;
	margin-bottom: 20px;
`;

const Section = styled.div`
	width: 85%;
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-left: 32px;
	margin-bottom: 16px;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 4px;
`;

const Label = styled.span`
	color: #202020;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 600;
	letter-spacing: 0.6px;
`;

const Value = styled.span`
	color: #202020;
	font-size: 12px;
	font-family: Roboto;
	font-weight: 400;
	letter-spacing: 0.6px;
`;

const Divider = styled.div`
	width: 85%;
	height: 1px;
	background: #dadada;
	margin: 18px 0 10px 32px;
`;

export default function ResidentInfo() {
	return (
		<Wrapper>
			<Avatar src='/assets/msgPanel/dorota.png' alt='Dorota Przylas' />
			<Name>Dorota Przylas</Name>
			<Section>
				<Row>
					<Label>Adres:</Label>
					<Value>ul. Jerozolimskie 44, m.7 01-345 Warszawa</Value>
				</Row>
				<Row>
					<Label>Email:</Label>
					<Value>d.przylas@gmail.com</Value>
				</Row>
				<Row>
					<Label>Telefon:</Label>
					<Value>569 851 658</Value>
				</Row>
			</Section>
			<Divider />
			<Section>
				<Label style={{ marginBottom: 4 }}>Informacje dodatkowe</Label>
				<Divider style={{ margin: "10px 0 10px 0", width: "100%" }} />
				<Row>
					<Label>Metraż mieszkania:</Label>
					<Value>56m2</Value>
				</Row>
				<Row>
					<Label>Czynsz:</Label>
					<Value>856 zł/mc</Value>
				</Row>
				<Row>
					<Label>Garaż:</Label>
					<Value>Tak</Value>
				</Row>
			</Section>
		</Wrapper>
	);
}
