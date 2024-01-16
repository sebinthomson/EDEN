/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useTimer } from "react-timer-hook";
import Digit from "./Digit";

function Countdown({ timeDifference, setTimeDifference }) {
  const currentTimestamp = Date.now();
  const expiryTimestamp = currentTimestamp + timeDifference;
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      setTimeDifference(false);
    },
  });

  const TimerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 30px;
  `;

  const SepartorContainer = styled.span`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: flex-end;
    margin: 0 0 10px 0px;
  `;

  const Separtor = styled.span`
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #404549;
    border-radius: 6px;
    margin: 5px 0px;
  `;

  return (
    <TimerContainer>
      {days !== undefined ? (
        <Digit value={days} title="DAYS" addSeparator />
      ) : null}
      {days !== undefined ? (
        <SepartorContainer>
          <Separtor />
          <Separtor />
        </SepartorContainer>
      ) : null}
      <Digit value={hours} title="HOURS" addSeparator />
      <SepartorContainer>
        <Separtor />
        <Separtor />
      </SepartorContainer>
      <Digit value={minutes} title="MINUTES" addSeparator />
      <SepartorContainer>
        <Separtor />
        <Separtor />
      </SepartorContainer>
      <Digit value={seconds} title="SECONDS" />
    </TimerContainer>
  );
}

export default Countdown;
