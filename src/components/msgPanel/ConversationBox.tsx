import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	width: 706px;
	height: 780px;
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
	padding: 0 32px;
	gap: 32px;
	box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.02);
`;

const UserBlock = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	flex: 1;
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
	position: relative;
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
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 0 32px 24px 32px;
	background: transparent;
`;

const InputBar = styled.div`
	width: 100%;
	height: 50px;
	background: #f3f3f3;
	border-radius: 10px;
	border: 1px solid #dadada;
	display: flex;
	align-items: center;
	padding: 0 14px 0 16px;
	gap: 10px;
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

export default function ConversationBox() {
	// Wartości "na sztywno" zgodnie z widokiem
	return (
		<Wrapper>
			<TopBar>
				<UserBlock>
					<UserIcon src='/assets/msgPanel/msg.png' alt='msg' />
					<UserDetails>
						<Name>Dorota Przylas</Name>
						<DateText>21.05.2025 10:21</DateText>
					</UserDetails>
				</UserBlock>
				<StatusBtn>
					<StatusIcon src='/assets/msgPanel/check.png' alt='check' />
					Otwarte
					<ArrowIcon src='/assets/msgPanel/down_arrow.png' alt='down' />
				</StatusBtn>
			</TopBar>

			<ConversationBody>
				<DateDivider>Wczoraj</DateDivider>

				{/* WIADOMOŚĆ OD DOROTA */}
				<MessageRow>
					<Avatar src='/assets/msgPanel/dorota.png' alt='Dorota' />
					<div>
						<Bubble>
							Dzień dobry,
							<br />
							Dziękujemy za ostatnie spotkanie, było nam bardzo miło!
						</Bubble>
						<MsgMeta>11:12</MsgMeta>
					</div>
				</MessageRow>

				<MessageRow>
					<Avatar src='/assets/msgPanel/dorota.png' alt='Dorota' />
					<div>
						<Bubble>
							Czy możemy zorganizować w przyszłości podobne spotkanie dla
							mieszkańców osiedla?
						</Bubble>
						<MsgMeta>12:51</MsgMeta>
					</div>
				</MessageRow>

				{/* TWOJA WIADOMOŚĆ */}
				<MessageRow own>
					<div>
						<Bubble own>
							Dzień dobry, dziękujemy! Nam też było miło. W czym możemy pomóc
							dzisiaj?
						</Bubble>
						<MsgMeta>teraz</MsgMeta>
					</div>
				</MessageRow>

				<MessageRow own>
					<div>
						<Bubble own>
							Oczywiście proszę tylko zaproponować termin. Na pewno uda się coś
							ustalić.
						</Bubble>
						<MsgMeta>teraz</MsgMeta>
					</div>
				</MessageRow>
			</ConversationBody>

			<Footer>
				<InputBar>
					<MsgInput placeholder='Napisz wiadomość' />
					<FooterIcon src='/assets/msgPanel/download.png' alt='download' />
					<FooterIcon src='/assets/msgPanel/spin.png' alt='spin' />
					<FooterIcon src='/assets/msgPanel/send_gray.png' alt='send' />
				</InputBar>
			</Footer>
		</Wrapper>
	);
}
