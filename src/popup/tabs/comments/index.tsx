import { useLazyQuery } from '@apollo/client';
import CommentForm from '@popup/components/commentform';
import CommentItem from '@popup/components/commentitem';
import { Card } from '@popup/components/ui';
import { store } from '@popup/utils/appstore';
import GET_COMMENTS from '@popup/utils/queries/get_comments';
import { GetCommentsQuery } from '@popup/__generated__/GetCommentsQuery';
import React, { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

const CommentListDiv = styled.div`
    margin-top: 1rem;
`;

const CommentList = ({ children }: { children: ReactNode }) => {
    return (
        <CommentListDiv>
            <h2>Comments</h2>
            {children}
        </CommentListDiv>
    );
};

export default function CommentsPage() {
    const [user, setUser] = useState(store.state.user);

    const [getComments, { loading, data }] = useLazyQuery<GetCommentsQuery>(
        GET_COMMENTS
    );

    useEffect(() => {
        store.listen('user:set', (state) => {
            setUser(state.user);
        });

        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
            },
            (tabs) => {
                const url = tabs[0].url;
                if (url) {
                    getComments({
                        variables: {
                            website_url: url,
                        },
                    });
                }
            }
        );
        // eslint-disable-next-line
    }, []);

    const comments = data?.allComments?.map((item) => (
        <CommentItem
            avatar={item?.user?.avatar as string}
            comment={item?.comment as string}
            name={item?.user?.name as string}
            username={item?.user?.username as string}
            key={item.id}
        />
    ));

    return (
        <div>
            <Card>
                <h1>Comments</h1>
            </Card>
            {user && (
                <Card className="mt-md">
                    <CommentForm />
                </Card>
            )}
            {loading ? (
                <div>Loading Comments</div>
            ) : (
                <React.Fragment>
                    {!data?.allComments || data.allComments?.length === 0 ? (
                        <p>No comments</p>
                    ) : (
                        <CommentList>{comments}</CommentList>
                    )}
                </React.Fragment>
            )}
        </div>
    );
}
