import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const VehicleTypeSwitcher = ({ vehicleType, setVehicleType }) => {
  const { t } = useTranslation();

  return (
    <Section>
      <Container>
        <ToggleInput
          type="checkbox"
          checked={vehicleType === 'electric'}
          onChange={() =>
            setVehicleType(prev =>
              prev === 'combustion' ? 'electric' : 'combustion'
            )
          }
          id="check"
        />
        <ToggleLabel htmlFor="check" className="toggle">
          <ToggleCircle className="toggle__circle" />
        </ToggleLabel>
        <ToggleText className="toggle-text">
          <span>{t('combustion')}</span>
          <span>{t('electric')}</span>
        </ToggleText>
      </Container>
    </Section>
  );
};

const Section = styled.div`
  background-color: var(--section-bg);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const Container = styled.div`
  margin: auto;
  color: var(--text-color);
  font-weight: 900;
  font-size: 2rem;
  display: flex;
  align-items: center;
  
  input:checked + label.toggle {
    background-color:rgb(211, 197, 0);
  }

  /* 
    Keď je checkbox checknutý, posunieme kruh dole:
    (pôvodná hodnota margin-top, ktorá bola v default stave)
  */
  input:checked + label.toggle > div.toggle__circle {
    margin-top: calc(100px - (0.15rem * 2) - 30px);
  }
`;

const ToggleInput = styled.input`
  display: none;
`;

const ToggleLabel = styled.label`
  width: 40px;
  height: 100px;
  background-color: hsl(0, 0%, 80%);
  border-radius: 1.7rem;
  padding: 0.15rem 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: background-color 300ms 300ms;
  transform: scale(0.7);
`;

const ToggleCircle = styled.div`
  width: 30px;
  height: 30px;
  background-color: hsl(0, 0%, 95%);
  border-radius: 50%;
  /* 
    V default stave (nechecknutý) chceme kruh hore,
    preto mu dáme menší margin-top:
  */
  margin-top: 5px;
  transition: margin 500ms ease-in-out;
`;

const ToggleText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  text-transform: capitalize;
  margin-left: -2rem;
  font-size: 1.5em;
  transform: scale(0.7);
`;

export default VehicleTypeSwitcher;
