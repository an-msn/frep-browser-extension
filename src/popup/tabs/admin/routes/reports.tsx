import { useMutation, useQuery } from '@apollo/client';
import PageHeader from '@popup/components/pageheader';
import { Button, Card } from '@popup/components/ui';
import GET_ALL_REPORTS from '@popup/utils/queries/all_reports';
import REPORT_ACTION from '@popup/utils/queries/report_action';
import { GetAllReports } from '@popup/__generated__/GetAllReports';
import { ReportActions } from '@popup/__generated__/globalTypes';
import {
    ReportActionMutation,
    ReportActionMutationVariables,
} from '@popup/__generated__/ReportActionMutation';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const AdminCommentReportsContainer = styled.div`
    .report-item {
        margin: 1rem 0;

        .comment-info {
            .user {
                display: flex;
                align-items: center;

                p {
                    font-size: 0.9rem;
                }

                .username {
                    margin-left: 1rem;
                    color: ${(props) => props.theme.textLight};
                }
            }
            .website {
                margin: 1rem 0;
                display: block;
                color: ${(props) => props.theme.text};
                text-decoration: none;
            }

            .comment {
                padding: 0.5rem;
                font-size: 0.9rem;
                background: ${(props) => props.theme.secondary};
                border-radius: 4px;
            }
        }
        .report-details {
            margin-top: 1rem;

            h4 {
                font-size: 1.05rem;
                margin: 0.5rem 0;
            }

            .user {
                display: flex;

                p {
                    font-size: 0.9rem;
                }

                .username {
                    margin-left: 1rem;
                    color: ${(props) => props.theme.textLight};
                }
            }

            .message {
                font-size: 0.9rem;
                padding: 0.5rem;
                background: ${(props) => props.theme.errorLight};
                color: #000;
                border-radius: 4px;
                margin: 1rem 0;
            }
        }

        .actions {
            display: flex;
            justify-content: space-between;
        }
    }
`;

export default function AdminCommentReports() {
    const history = useHistory();

    const { data, loading, error } = useQuery<GetAllReports>(GET_ALL_REPORTS);

    return (
        <AdminCommentReportsContainer>
            <PageHeader
                title="Comment Reports"
                backAction={() => history.goBack()}
            />
            {(() => {
                if (loading) {
                    return <p>Loading..</p>;
                }

                if (error) {
                    console.log(error);
                    return <p>An error occured</p>;
                }

                if (
                    !data ||
                    !data.allReports ||
                    data.allReports?.length === 0
                ) {
                    return <p>No data</p>;
                }

                return (
                    <div className="reports">
                        {data.allReports.map((item) => (
                            <ReportItem {...item} />
                        ))}
                    </div>
                );
            })()}
        </AdminCommentReportsContainer>
    );
}

const ReportItem = ({
    comment,
    user,
    message,
    id,
}: {
    comment: {
        comment: string;
        website_url: string;
        user: {
            name: string;
            username: string;
        };
    };
    user: {
        username: string;
        name: string;
    };
    message: string;
    id: string;
}) => {
    const [takingAction, setTakingAction] = useState(false);

    const [doReportAction] = useMutation<
        ReportActionMutation,
        ReportActionMutationVariables
    >(REPORT_ACTION);

    const handleAction = (action: ReportActions) => {
        setTakingAction(true);
        doReportAction({
            variables: {
                id: id,
                action: ReportActions[action],
            },
        })
            .then(() => {
                toast.success('Action completed');
            })
            .catch(() => {
                toast.error('Error taking action');
            })
            .finally(() => {
                setTakingAction(false);
            });
    };

    return (
        <Card className="report-item">
            <div className="comment-info">
                <div className="user">
                    <p className="name">{comment.user.name}</p>
                    <p className="username">@{comment.user.username}</p>
                </div>
                <a className="website" href={comment.website_url}>
                    {comment.website_url}
                </a>
                <div className="comment">{comment.comment}</div>
            </div>
            <div className="report-details">
                <h4>Reported By</h4>
                <div className="user">
                    <p>{user.name}</p>
                    <p className="username">{user.username}</p>
                </div>
                <div className="message">
                    <p>{message}</p>
                </div>
            </div>
            <div className="actions">
                <Button
                    className="secondary"
                    disabled={takingAction}
                    onClick={() => {
                        handleAction(ReportActions.REMOVE_COMMENT);
                    }}
                >
                    {takingAction ? 'Removing..' : 'Remove Comment'}
                </Button>
                <Button
                    className="secondary"
                    disabled={takingAction}
                    onClick={() => {
                        handleAction(ReportActions.DISCARD);
                    }}
                >
                    {takingAction ? 'Discarding..' : 'Discard'}
                </Button>
            </div>
        </Card>
    );
};
