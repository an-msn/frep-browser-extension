import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/outline';
import { useMutation } from '@apollo/client';
import { User } from '@popup/utils/appstore';
import React, { useState } from 'react';
import { Button } from './ui';
import CAST_VOTE from '@popup/utils/queries/cast_vote';
import GET_COMMENTS from '@popup/utils/queries/get_comments';
import {
    CastVoteMutation,
    CastVoteMutationVariables,
} from '@popup/__generated__/CastVoteMutation';
import { GetCommentsQuery } from '@popup/__generated__/GetCommentsQuery';
import styled from 'styled-components';
import Toast from './toast';
import { toast } from 'react-toastify';

const VoteButtons = styled.div`
    display: flex;
    align-items: center;

    .secondary .button {
        padding-left: 0.8rem;
        padding-right: 0.8rem;
        background-color: transparent;
        border: 2px solid transparent;
        transition: 0.35s border;

        svg {
            height: 1rem;
            width: 1rem;
        }

        &:hover,
        &:active,
        &:focus {
            border: 2px solid ${(props) => props.theme.secondary};
        }
    }

    p {
        font-size: 1rem;
        padding: 0 0.8rem;
    }

    .active button {
        color: ${(props) => props.theme.primary};
    }

    .holding button {
        animation: holding 1s infinite;
    }

    @keyframes holding {
        0% {
            border: 2px solid ${(props) => props.theme.primary};
        }

        100% {
            border: 2px solid ${(props) => props.theme.primaryLight};
        }
    }
`;

export default function CommentVotes({
    user,
    commentData,
    votes,
}: {
    user: User | null;
    commentData: {
        id: string;
        website_url: string;
    };
    votes: {
        up: number;
        down: number;
        own: number | null;
    };
}) {
    const [voteState, setVoteState] = useState<
        'neutral' | 'upvoting' | 'downvoting'
    >('neutral');

    const [castVote] = useMutation<CastVoteMutation, CastVoteMutationVariables>(
        CAST_VOTE,
        {
            update(cache, { data, extensions, context }) {
                if (data?.castVote) {
                    const existingCache = cache.readQuery<GetCommentsQuery>({
                        query: GET_COMMENTS,
                        variables: {
                            website_url: commentData.website_url,
                        },
                    });

                    if (existingCache) {
                        const allComments = [...existingCache.allComments];
                        const updatedComment = allComments.findIndex(
                            (comment) => comment.id === commentData.id
                        );

                        if (updatedComment > -1) {
                            allComments[updatedComment] = {
                                ...allComments[updatedComment],
                                votes: data.castVote,
                            };

                            cache.writeQuery({
                                query: GET_COMMENTS,
                                variables: {
                                    website_url: commentData.website_url,
                                },
                                data: {
                                    allComments: allComments,
                                },
                            });
                        }
                    }
                }
            },
        }
    );

    const handleVote = (action: 'up' | 'down') => {
        setVoteState(action === 'up' ? 'upvoting' : 'downvoting');
        const voteAction = (() => {
            if (action === 'up') {
                if (votes.own === 1) return 0;
                return 1;
            }

            if (votes.own === -1) return 0;
            return -1;
        })();

        castVote({
            variables: {
                comment: commentData.id,
                vote: voteAction,
            },
        })
            .then((data) => {
                if (data.errors) {
                    setVoteState('neutral');
                    toast.error('An unexpected error occured');
                }
                setVoteState('neutral');
            })
            .catch((err) => {
                if (
                    err.networkError.result.errors[0]?.message === 'own-comment'
                ) {
                    toast.error('Cannot vote on own comment');
                }
                setVoteState('neutral');
            });
    };

    return (
        <VoteButtons>
            <Button
                className={`secondary upvote ${votes.own === 1 && 'active'} ${
                    voteState === 'upvoting' && 'holding'
                }`}
                disabled={user === null || voteState !== 'neutral'}
                onClick={() => handleVote('up')}
            >
                <ArrowUpIcon />
            </Button>
            <p>{votes.up - votes.down}</p>
            <Button
                className={`secondary downvote ${
                    votes.own === -1 && 'active'
                } ${voteState === 'downvoting' && 'holding'}`}
                disabled={user === null || voteState !== 'neutral'}
                onClick={() => handleVote('down')}
            >
                <ArrowDownIcon />
            </Button>
        </VoteButtons>
    );
}
