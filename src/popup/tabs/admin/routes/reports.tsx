import { useQuery } from '@apollo/client';
import PageHeader from '@popup/components/pageheader';
import { Button, Card } from '@popup/components/ui';
import GET_ALL_REPORTS from '@popup/utils/queries/all_reports';
import { GetAllReports } from '@popup/__generated__/GetAllReports';
import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const AdminCommentReportsContainer = styled.div``;

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
                    return <p>An error occured</p>;
                }

                if (!data || !data.allReports) {
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
}) => {
    return (
        <Card className="report-item">
            <div className="comment-info">
                <div className="user">
                    <p className="name">{comment.user.name}</p>
                    <p className="username">{comment.user.username}</p>
                </div>
                <div className="website">{comment.website_url}</div>
                <div className="comment">{comment.comment}</div>
            </div>
            <div className="report-details">
                <div className="user">
                    <p>{user.name}</p>
                    <p>{user.username}</p>
                </div>
                <div className="message">
                    <p>{message}</p>
                </div>
            </div>
            <div className="actions">
                <Button className="secondary">Remove Comment</Button>
                <Button className="secondary">Discard</Button>
            </div>
        </Card>
    );
};
