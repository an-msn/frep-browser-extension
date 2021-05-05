import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ExclamationIcon } from '@heroicons/react/outline';

const Card = styled.div`
    width: 100%;
    padding: 1rem;
    border-radius: 4px;
    background-color: ${(props) => props.theme.bgLight};
`;

const FieldContainer = styled.div<{ error?: boolean }>`
    margin-bottom: 0.8rem;

    label {
        padding: 1rem;
        font-size: 1rem;

        p {
            margin-left: 0.4rem;
            color: ${(props) => props.theme.textAlt};
        }

        .field {
            border-radius: 4px;
            font-size: 1rem;
            padding: 0.8rem 1rem;
            background-color: transparent;
            color: ${(props) => props.theme.text};
            width: 100%;
            margin-top: 0.6rem;
            border: 1px solid ${(props) => props.theme.textAlt};
            outline: 0;
        }
    }

    .error {
        margin: 0.5rem 0;
        border-radius: 4px;
        background: ${(props) => props.theme.errorLight};
        color: ${(props) => props.theme.errorDark};
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: 0.5rem 1rem;

        svg {
            width: 1.5rem;
            height: 1.5rem;
        }

        p {
            margin-left: 1rem;
            font-size: 1rem;
        }
    }
`;

const TextField = ({
    type = 'text',
    label,
    error,
    ...props
}: {
    type?: string;
    label: string;
    error?: string | false;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <FieldContainer error={error ? true : false}>
            <label>
                <p>{label}</p>
                <input type={type} className="field" {...props} />
            </label>
            {error && (
                <div className="error">
                    <ExclamationIcon />
                    <p>{error}</p>
                </div>
            )}
        </FieldContainer>
    );
};

const ButtonStyle = styled.div<{ disabled?: boolean }>`
    display: inline-block;

    .button {
        display: inline-flex;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        background: ${(props) =>
            props.disabled
                ? props.theme.bgButtonDisabled
                : props.theme.primary};
        border: 0;
        border-radius: 4px;
        color: ${(props) => props.theme.text};
        justify-content: center;
        align-items: center;
        cursor: ${(props) => (props.disabled ? 'normal' : 'pointer')};
    }
`;

const Button = ({
    children,
    ...props
}: {
    children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <ButtonStyle disabled={props.disabled} className={props.className}>
            <button {...props} className="button">
                {children}
            </button>
        </ButtonStyle>
    );
};

export { Card, TextField, Button };
