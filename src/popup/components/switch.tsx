import React from 'react';
import styled from 'styled-components';

const SwitchDiv = styled.div<{ active: boolean }>`
    display: inline-block;
    width: 48px;
    height: 24px;
    position: relative;

    .track {
        width: 100%;
        height: 8px;
        margin-top: 8px;
        border-radius: 8px;
        background-color: ${(props) =>
            props.active ? props.theme.primaryTrack : props.theme.bgTrack};
    }

    .thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        transition: background-color 0.35s, transform 0.35s;
        transform: ${(props) =>
            props.active ? 'translate(100%, 0%)' : 'translate(0%, 0%)'};
        background-color: ${(props) =>
            props.active ? props.theme.primaryThumb : props.theme.bgThumb};
    }
`;

export default function Switch({
    checked = false,
    onChange,
}: {
    checked?: boolean;
    onChange?: () => void;
}) {
    return (
        <SwitchDiv active={checked} onClick={onChange}>
            <div className="track"></div>
            <div className="thumb"></div>
        </SwitchDiv>
    );
}
