import React from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
    width: 2rem;
    height: 2rem;
    transform-origin: 50% 50%;
    animation: rotate 1s infinite linear;

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

export default function Loader(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <LoaderContainer {...props}>
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="100%"
                height="100%"
                viewBox="0 0 50 50"
                xmlSpace="preserve"
            >
                <path
                    fill="currentColor"
                    d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
                ></path>
            </svg>
        </LoaderContainer>
    );
}
