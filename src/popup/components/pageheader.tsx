import { ArrowLeftIcon } from '@heroicons/react/outline';
import React from 'react';
import styled from 'styled-components';
import { Card } from './ui';

const PageHeaderContainer = styled.div`
    .header {
        display: flex;
        align-items: center;

        button {
            border: 0;
            background: transparent;
            outline: 0;
            cursor: pointer;
        }

        svg {
            color: ${(props) => props.theme.text};
            margin-bottom: -0.1rem;
        }

        h2 {
            margin-left: 1rem;
        }
    }
`;

export default function PageHeader({
    title,
    backAction,
}: {
    title: string;
    backAction: () => void;
}) {
    return (
        <PageHeaderContainer>
            <Card className="header">
                <button onClick={backAction}>
                    <ArrowLeftIcon className="icon" />
                </button>
                <h2>{title}</h2>
            </Card>
        </PageHeaderContainer>
    );
}
