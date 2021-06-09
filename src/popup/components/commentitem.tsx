import { CommentTree } from '@popup/types';
import { store } from '@popup/utils/appstore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CommentForm from './commentform';
import CommentVotes from './commentvotes';
import { Button } from './ui';
import { formatDistanceToNow } from 'date-fns';
import CommentReport from './commentreport';
import CommentDelete from './commentdelete';

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
            .title {
                display: flex;
                align-items: center;

                .date {
                    padding-left: 0.8rem;
                    margin-left: 0.8rem;
                    font-size: 0.9rem;
                    color: ${(props) => props.theme.textSecondary};
                    position: relative;

                    &::before {
                        content: '';
                        position: absolute;
                        width: 0.4rem;
                        height: 0.4rem;
                        border-radius: 50%;
                        background: ${(props) => props.theme.secondaryLight};
                        top: calc(50% - 0.2rem);
                        left: 0;
                    }
                }
            }

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

        &.deleted {
            font-style: italic;
            opacity: 0.6;
        }
    }

    .footer {
        padding: 0.5rem 1rem;
        width: calc(100% - 2rem);
        margin: 0 auto;
        border-top: 2px solid ${(props) => props.theme.secondaryLight};
        display: flex;
        justify-content: space-between;
        align-items: center;

        .actions {
            display: flex;
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
    website_url,
    user: author,
    id,
    childNodes,
    votes,
    date,
    commentDeleted,
}: {
    comment: string;
    id: string;
    website_url: string;
    date: string;
    commentDeleted: boolean;
    childNodes: CommentTree[];
    user: {
        id: string;
        username: string;
        name: string;
        avatar: string;
    };
    votes: {
        up: number;
        down: number;
        own: number | null;
    };
}) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [user, setUser] = useState(store.state.user);

    const replies = childNodes.map((item) => (
        <CommentItem
            user={item.user}
            id={item.id}
            comment={item.comment}
            website_url={item.website_url}
            key={item.id}
            childNodes={item.childNodes}
            votes={item.votes}
            date={item.date}
            commentDeleted={item.deleted}
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
                    <img src={author.avatar} alt="Avatar" />
                </div>
                <div className="info">
                    <div className="title">
                        <h3>{author.name}</h3>
                        <div className="date">
                            {formatDistanceToNow(new Date(Number(date)))} ago
                        </div>
                    </div>
                    <p>{author.username}</p>
                </div>
            </div>
            <div className={`comment ${commentDeleted ? 'deleted' : ''}`}>
                {comment}
            </div>
            <div className="footer">
                <CommentVotes
                    commentData={{
                        id: id,
                        website_url: website_url,
                    }}
                    user={user}
                    votes={votes}
                    votesDisabled={
                        user === null || user.id === author.id || commentDeleted
                    }
                />
                <div className="actions">
                    {user && user?.id !== author.id && !commentDeleted && (
                        <CommentReport commentId={id} />
                    )}
                    {user && user.id === author.id && !commentDeleted && (
                        <CommentDelete
                            commentId={id}
                            website_url={website_url}
                        />
                    )}
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
