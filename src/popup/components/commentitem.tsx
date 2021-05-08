import { useMutation } from '@apollo/client';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/outline';
import { CommentTree } from '@popup/types';
import { store } from '@popup/utils/appstore';
import CREATE_VOTE from '@popup/utils/queries/create_vote';
import GET_COMMENTS from '@popup/utils/queries/get_comments';
import { GetCommentsQuery } from '@popup/__generated__/GetCommentsQuery';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CommentForm from './commentform';
import { Button } from './ui';

const CommentItemContainer = styled.div`
    background: ${(props) => props.theme.bgLight};
    margin-top: 1rem;
    border-radius: 4px;

    .meta {
        display: flex;
        padding: 0.8rem;
        align-items: center;

        .image {
            width: 2.6rem;
            height: 2.6rem;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 1rem;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .info {
            h3 {
                font-size: 1.1rem;
                color: ${(props) => props.theme.textLight};
            }

            p {
                font-size: 0.8rem;
                color: ${(props) => props.theme.textAlt};
                margin-top: 0.2rem;
            }
        }
    }

    .comment {
        margin-top: 0.5rem;
        padding: 0 1.4rem 1rem 1.4rem;
        border-radius: 4px;
        font-size: 1rem;
    }

    .footer {
        padding: 0.5rem 1rem;
        border-top: 2px solid ${(props) => props.theme.secondaryLight};
        display: flex;
        justify-content: space-between;
        align-items: center;

        .vote-buttons {
            display: flex;
            align-items: center;

            button {
                padding-left: 0.8rem;
                padding-right: 0.8rem;
                background: transparent;
                border: 1px solid transparent;
                transition: 0.35s border;

                svg {
                    height: 1rem;
                    width: 1rem;
                }

                &:hover,
                &:active,
                &:focus {
                    border: 1px solid ${(props) => props.theme.secondary};
                }
            }

            p {
                font-size: 1rem;
                padding: 0 0.5rem;
            }

            .active button {
                color: ${(props) => props.theme.primary};
            }
        }
    }

    .reply {
        padding: 1rem;
    }

    .replies {
        padding: 1rem;

        .comment-item-container {
            border: 1px solid ${(props) => props.theme.secondary};
        }
    }
`;

export default function CommentItem({
    comment,
    username,
    name,
    avatar,
    id,
    childNodes,
    votes,
}: {
    comment: string;
    username: string;
    name: string;
    avatar: string;
    id: string;
    childNodes: CommentTree[];
    votes: {
        up: number;
        down: number;
        own: number | null;
    };
}) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [user, setUser] = useState(store.state.user);

    const [createVote] = useMutation(CREATE_VOTE, {
        update(cache, { data, extensions, context }) {
            if (data?.createComment) {
                const existingCache = cache.readQuery<GetCommentsQuery>({
                    query: GET_COMMENTS,
                    variables: {
                        // website_url: newData.website_url,
                    },
                });

                if (existingCache && data) {
                    cache.writeQuery({
                        query: GET_COMMENTS,
                        variables: {
                            // website_url: newData.website_url,
                        },
                        data: {
                            // allComments: [
                            //     ...(existingCache.allComments || []),
                            //     newData,
                            // ],
                        },
                    });
                }
            }
        },
    });

    const replies = childNodes.map((item) => (
        <CommentItem
            {...item.user}
            id={item.id}
            comment={item.comment}
            key={item.id}
            childNodes={item.childNodes}
            votes={item.votes}
        />
    ));

    useEffect(() => {
        const removeListener = store.listen('user:set', (state) => {
            setUser(state.user);
        });

        return () => {
            removeListener();
        };
    }, []);

    return (
        <CommentItemContainer className="comment-item-container">
            <div className="meta">
                <div className="image">
                    <img src={avatar} alt="Avatar" />
                </div>
                <div className="info">
                    <h3>{name}</h3>
                    <p>{username}</p>
                </div>
            </div>
            <div className="comment">{comment}</div>
            <div className="footer">
                <div className="vote-buttons">
                    <Button className="secondary upvote active">
                        <ArrowUpIcon />
                    </Button>
                    <p>{votes.up + votes.down}</p>
                    <Button className="secondary downvote">
                        <ArrowDownIcon />
                    </Button>
                </div>
                <div className="actions">
                    <Button
                        className="secondary"
                        onClick={() => setReplyOpen(!replyOpen)}
                        disabled={user === null}
                        title={!user ? 'Login to reply to comment' : ''}
                    >
                        {replyOpen ? 'Cancel Reply' : ' Reply'}
                    </Button>
                </div>
            </div>
            {replyOpen && (
                <div className="reply">
                    <CommentForm parentId={id} isReply={true} />
                </div>
            )}
            {replies.length > 0 && <div className="replies">{replies}</div>}
        </CommentItemContainer>
    );
}
