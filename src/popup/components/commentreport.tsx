import { FlagIcon, XIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, RadioButton, SubmitButton, TextArea } from './ui';

const CommentReportContainer = styled.div`
    margin-right: 0.8rem;

    .report-action {
        .button {
            padding: 0.8rem 0.9rem;
        }
    }

    .lightbox {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 99;

        .content-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;

            .data {
                width: 90%;
                max-height: 80%;
                border-radius: 4px;
                padding: 1rem;
                background: ${(props) => props.theme.bgLight};
                position: relative;

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid ${(props) => props.theme.secondary};

                    .close-button .button {
                        padding: 0.8rem;
                    }
                }

                .content {
                    padding: 1rem;

                    .report-messages {
                        list-style: none;

                        li {
                            display: flex;
                            align-items: center;
                            flex-wrap: wrap;
                            margin: 0.8rem 0;

                            p {
                                display: inline-block;
                                font-size: 1rem;
                                margin-left: 0.5rem;
                            }
                        }

                        .custom-message {
                            flex-basis: 100%;
                            margin-top: 1rem;
                        }
                    }
                    .report-comment-button {
                        margin-top: 2rem;
                    }
                }
            }
        }
    }
`;

export default function CommentReport() {
    const [reportBoxOpen, setReportBoxOpen] = useState(false);

    const reportMessages = [
        'This comment is spam',
        'This comment is offensive or inappropriate',
        'This comment is fake',
        'Other, specify',
    ];

    const [activeReportMessage, setActiveReportMessage] = useState(0);

    return (
        <CommentReportContainer>
            <Button
                className="secondary report-action"
                onClick={() => setReportBoxOpen(true)}
            >
                <FlagIcon className="icon--small" />
            </Button>
            {reportBoxOpen && (
                <div
                    className="lightbox"
                    onClick={(e) => {
                        const target = e.target as HTMLDivElement;
                        if (
                            target &&
                            target.classList.contains('content-container')
                        ) {
                            setReportBoxOpen(false);
                        }
                    }}
                >
                    <div className="content-container">
                        <div className="data">
                            <div className="header">
                                <h2>Report Comment</h2>
                                <div className="close-button">
                                    <Button
                                        className="secondary"
                                        onClick={() => setReportBoxOpen(false)}
                                    >
                                        <XIcon className="icon--small" />
                                    </Button>
                                </div>
                            </div>
                            <div className="content">
                                <ul className="report-messages">
                                    {reportMessages.map((msg, i) => (
                                        <li key={`report-comment-message-${i}`}>
                                            <RadioButton
                                                name="report-option"
                                                aria-label={msg}
                                                active={
                                                    i === activeReportMessage
                                                }
                                                onChange={() => {
                                                    setActiveReportMessage(i);
                                                }}
                                            />
                                            <p>{msg}</p>
                                            {i === reportMessages.length - 1 &&
                                                i === activeReportMessage && (
                                                    <div className="custom-message">
                                                        <TextArea label="Message" />
                                                    </div>
                                                )}
                                        </li>
                                    ))}
                                </ul>
                                <div className="report-comment-button">
                                    <SubmitButton title="Report"></SubmitButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CommentReportContainer>
    );
}
