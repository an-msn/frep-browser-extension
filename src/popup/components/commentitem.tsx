import React from 'react';
import styled from 'styled-components';

const CommentItemContainer = styled.div`
    background: ${(props) => props.theme.bgLight};
    margin-top: 1rem;

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
`;

export default function CommentItem({
    comment,
    username,
    name,
    avatar,
}: {
    comment: string;
    username: string;
    name: string;
    avatar: string;
}) {
    return (
        <CommentItemContainer>
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
        </CommentItemContainer>
    );
}
