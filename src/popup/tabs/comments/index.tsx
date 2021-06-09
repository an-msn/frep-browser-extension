import { useLazyQuery } from '@apollo/client';
import { CollectionIcon } from '@heroicons/react/outline';
import CommentForm from '@popup/components/commentform';
import CommentItem from '@popup/components/commentitem';
import CommentSortMenu from '@popup/components/commentsortmenu';
import Loader from '@popup/components/loader';
import { Button, Card } from '@popup/components/ui';
import { CommentTree } from '@popup/types';
import { store } from '@popup/utils/appstore';
import GET_COMMENTS from '@popup/utils/queries/get_comments';
import {
    GetCommentsQuery,
    GetCommentsQueryVariables,
} from '@popup/__generated__/GetCommentsQuery';
import React, { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .right-side {
        display: flex;
        align-items: center;
    }
`;

const CommentListDiv = styled.div`
    margin-top: 1rem;
`;

const NoComments = styled.div`
    text-align: center;
    margin-top: 1rem;

    .icon {
        display: inline-block;

        svg {
            width: 2.4rem;
            height: 2.4rem;
        }
    }

    h3 {
        font-size: 1.2rem;
        margin-top: 0.6rem;
    }
`;

const LoadingComments = styled.div`
    margin-top: 1rem;
    text-align: center;

    .icon {
        display: inline-block;
    }

    p {
        font-size: 1rem;
        margin-top: 0.6rem;
    }
`;

const CommentList = ({ children }: { children: ReactNode }) => {
    return <CommentListDiv>{children}</CommentListDiv>;
};

export default function CommentsPage() {
    const [user, setUser] = useState(store.state.user);
    const [commentFormShown, setCommentFormShown] = useState(false);

    const [getComments, { loading, data, refetch }] = useLazyQuery<
        GetCommentsQuery,
        GetCommentsQueryVariables
    >(GET_COMMENTS);

    useEffect(() => {
        const removeListener = store.listen('user:set', (state) => {
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

        return () => {
            removeListener();
        };
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
            user={item.user}
            childNodes={item.childNodes}
            id={item.id}
            key={item.id}
            votes={item.votes}
            website_url={item.website_url}
            date={item.date}
            commentDeleted={item.deleted}
        />
    ));

    return (
        <MainContainer>
            <Card className="header">
                <h1>Comments</h1>
                <div className="right-side">
                    {user && (
                        <Button
                            className="secondary"
                            onClick={() =>
                                setCommentFormShown(!commentFormShown)
                            }
                        >
                            {commentFormShown
                                ? 'Close comment form'
                                : 'Add a comment'}
                        </Button>
                    )}
                    <CommentSortMenu refetch={refetch} />
                </div>
            </Card>
            {user && commentFormShown && (
                <Card className="mt-md">
                    <CommentForm />
                </Card>
            )}
            {loading ? (
                <LoadingComments>
                    <Card>
                        <div className="icon">
                            <Loader />
                        </div>
                        <p>Loading Comments</p>
                    </Card>
                </LoadingComments>
            ) : (
                <React.Fragment>
                    {!data?.allComments || data.allComments?.length === 0 ? (
                        <NoComments>
                            <Card>
                                <div className="icon">
                                    <CollectionIcon />
                                </div>
                                <h3>No Comments Yet.</h3>
                            </Card>
                        </NoComments>
                    ) : (
                        <CommentList>{comments}</CommentList>
                    )}
                </React.Fragment>
            )}
        </MainContainer>
    );
}
