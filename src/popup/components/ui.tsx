import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
    width: 100%;
    padding: 1rem;
    border-radius: 4px;
    background-color: ${(props) => props.theme.bgLight};
`;

export { Card };
