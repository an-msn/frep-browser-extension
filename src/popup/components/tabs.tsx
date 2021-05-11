import React, { ReactNode, ReactPortal, useState } from 'react';
import styled from 'styled-components';

const TabControls = styled.div`
    border-bottom: 1px solid ${(props) => props.theme.bgDark};
`;

const TabbedItemContainer = styled.div`
    width: 100%;
    padding: 1rem;
`;

const TabbedControlButton = styled.button<{ active: boolean }>`
    display: inline-block;
    padding: 1rem 2rem;
    background: ${(props) =>
        props.active ? props.theme.primary : props.theme.bgLight};
    color: ${(props) => props.theme.text};
    border: 0;
    text-transform: uppercase;
    font-weight: bold;
    font-family: 'Rubik', sans-serif;
    letter-spacing: 1px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.25s;

    &::hover,
    &::focus,
    &::active {
        background: ${(props) =>
            props.active ? props.theme.primary : props.theme.bg};
    }
`;

export function Tabs({ children }: { children: ReactNode }) {
    const [active, setActive] = useState(0);

    const tabbedControls: string[] = [];
    React.Children.forEach(children, (_child) => {
        const child = _child as ReactPortal;
        tabbedControls.push(child.props.title);
    });
    const tabbedControlElements = tabbedControls.map((item, i) => (
        <TabbedControl
            active={active === i}
            index={i}
            setActive={setActive}
            title={item}
            key={`tab-${i}`}
        />
    ));
    return (
        <div>
            <TabControls>{tabbedControlElements}</TabControls>
            <TabbedItemContainer>
                <div className="item">
                    {React.Children.toArray(children)[active]}
                </div>
            </TabbedItemContainer>
        </div>
    );
}

function TabbedControl({
    title,
    active,
    setActive,
    index,
}: {
    title: string;
    active: boolean;
    setActive: (i: number) => void;
    index: number;
}) {
    return (
        <TabbedControlButton
            active={active}
            onClick={() => {
                setActive(index);
            }}
        >
            {title}
        </TabbedControlButton>
    );
}

export function TabbedItem({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return <div>{children}</div>;
}
