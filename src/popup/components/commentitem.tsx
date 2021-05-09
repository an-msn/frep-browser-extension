import { CommentTree } from '@popup/types';
import { store } from '@popup/utils/appstore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CommentForm from './commentform';
import CommentVotes from './commentvotes';
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
}: {
    comment: string;
    id: string;
    website_url: string;
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
                    <h3>{author.name}</h3>
                    <p>{author.username}</p>
                </div>
            </div>
            <div className="comment">{comment}</div>
            <div className="footer">
                <CommentVotes
                    commentData={{
                        id: id,
                        website_url: website_url,
                    }}
                    user={user}
                    votes={votes}
                />
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
