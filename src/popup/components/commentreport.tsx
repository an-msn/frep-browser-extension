import { useMutation } from '@apollo/client';
import { FlagIcon, XIcon } from '@heroicons/react/outline';
import REPORT_COMMENT from '@popup/utils/queries/report_comment';
import {
    ReportCommentMutation,
    ReportCommentMutationVariables,
} from '@popup/__generated__/ReportCommentMutation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
                            margin: 0.8rem 0;
                        }

                        .custom-message {
                            flex-basis: 100%;
                            margin-top: 1rem;
                        }
                    }
                    .report-comment-button {
                        margin-top: 2rem;

                        .error {
                            margin-top: -1rem;
                            margin-bottom: 1rem;
                            font-size: 1rem;
                            border-radius: 4px;
                            padding: 0.5rem;
                            background: ${(props) => props.theme.errorLight};
                            color: ${(props) => props.theme.errorDark};
                        }
                    }
                }
            }
        }
    }
`;

export default function CommentReport({ commentId }: { commentId: string }) {
    const reportMessages = [
        'This comment is spam',
        'This comment is offensive or inappropriate',
        'This comment contains fake information',
        'Other, specify',
    ];

    const [reportComment] = useMutation<
        ReportCommentMutation,
        ReportCommentMutationVariables
    >(REPORT_COMMENT);
    const [reportBoxOpen, setReportBoxOpen] = useState(false);
    const [activeReportMessage, setActiveReportMessage] = useState(0);
    const [specifiedErrorMessage, setSpecifiedErrorMessage] = useState('');
    const [error, setError] = useState<'message-short' | 'network' | false>(
        false
    );
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (error === 'message-short' && specifiedErrorMessage) {
            if (specifiedErrorMessage.trim().length >= 10) {
                setError(false);
            }
        }
    }, [error, specifiedErrorMessage]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        let message = reportMessages[activeReportMessage];

        if (activeReportMessage === reportMessages.length - 1) {
            if (specifiedErrorMessage.trim().length < 10) {
                setError('message-short');
                setSubmitting(false);
                return;
            }
            message = specifiedErrorMessage;
        }

        reportComment({
            variables: {
                comment: commentId,
                message: message,
            },
        })
            .then((res) => {
                if (res) {
                    toast.success('Comment reported');
                } else {
                    toast.error('An error occured while reporting');
                }
            })
            .catch(() => {
                toast.error('An error occured while reporting');
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

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
                                <form onSubmit={handleSubmit}>
                                    <ul className="report-messages">
                                        {reportMessages.map((msg, i) => (
                                            <li
                                                key={`report-comment-message-${i}`}
                                            >
                                                <RadioButton
                                                    name="report-option"
                                                    aria-label={msg}
                                                    label={msg}
                                                    active={
                                                        i ===
                                                        activeReportMessage
                                                    }
                                                    onChange={() => {
                                                        setActiveReportMessage(
                                                            i
                                                        );
                                                    }}
                                                />
                                                {i ===
                                                    reportMessages.length - 1 &&
                                                    i ===
                                                        activeReportMessage && (
                                                        <div className="custom-message">
                                                            <TextArea
                                                                label="Message"
                                                                value={
                                                                    specifiedErrorMessage
                                                                }
                                                                onChange={(e) =>
                                                                    setSpecifiedErrorMessage(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="report-comment-button">
                                        {error && (
                                            <React.Fragment>
                                                {(() => {
                                                    if (
                                                        activeReportMessage ===
                                                            reportMessages.length -
                                                                1 &&
                                                        error ===
                                                            'message-short'
                                                    ) {
                                                        return (
                                                            <p className="error">
                                                                Enter a message
                                                                with atleast 10
                                                                characters
                                                            </p>
                                                        );
                                                    }

                                                    if (error === 'network') {
                                                        return (
                                                            <p className="error">
                                                                An unexpected
                                                                error occured
                                                            </p>
                                                        );
                                                    }

                                                    return null;
                                                })()}
                                            </React.Fragment>
                                        )}
                                        <SubmitButton
                                            disabled={submitting}
                                            titleLoading="Reporting..."
                                            loading={submitting}
                                            title="Report"
                                        ></SubmitButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CommentReportContainer>
    );
}
