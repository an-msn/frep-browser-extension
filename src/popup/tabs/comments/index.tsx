import { useLazyQuery } from '@apollo/client';
import CommentForm from '@popup/components/commentform';
import CommentItem from '@popup/components/commentitem';
import { Card } from '@popup/components/ui';
import { CommentTree } from '@popup/types';
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

    const createDataTree = () => {
        const hashTable = Object.create(null);
        data?.allComments.forEach(
            (aData) => (hashTable[aData.id] = { ...aData, childNodes: [] })
        );
        const dataTree: any[] = [];
        data?.allComments.forEach((aData) => {
            if (aData.parent)
                hashTable[aData.parent].childNodes.push(hashTable[aData.id]);
            else dataTree.push(hashTable[aData.id]);
        });
        return dataTree as CommentTree[];
    };

    const commentTree = createDataTree();

    const comments = commentTree.map((item) => (
        <CommentItem
            comment={item.comment}
            {...item.user}
            childNodes={item.childNodes}
            id={item.id}
            key={item.id}
            votes={item.votes}
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
