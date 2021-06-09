import { useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import DELETE_COMMENT from '@popup/utils/queries/delete_comment';
import GET_COMMENTS from '@popup/utils/queries/get_comments';
import {
    DeleteCommentMutation,
    DeleteCommentMutationVariables,
} from '@popup/__generated__/DeleteCommentMutation';
import { GetCommentsQuery } from '@popup/__generated__/GetCommentsQuery';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Button } from './ui';

const CommentDeleteContainer = styled.div`
    margin-right: 1rem;

    .button {
        padding: 0.8rem;
    }
`;

export default function CommentDelete({
    website_url,
    commentId,
}: {
    website_url: string;
    commentId: string;
}) {
    const [deleting, setDeleting] = useState(false);
    const [deleteComment] = useMutation<
        DeleteCommentMutation,
        DeleteCommentMutationVariables
    >(DELETE_COMMENT, {
        update(cache, { data, extensions, context }) {
            if (data?.deleteComment) {
                const existingCache = cache.readQuery<GetCommentsQuery>({
                    query: GET_COMMENTS,
                    variables: {
                        website_url: website_url,
                    },
                });

                if (existingCache && data.deleteComment) {
                    const allComments = [...existingCache.allComments];
                    const deletedComment = allComments.findIndex(
                        (i) => i.id === commentId
                    );

                    if (deletedComment >= 0) {
                        allComments[deletedComment] = {
                            ...allComments[deletedComment],
                            comment: '[deleted]',
                            deleted: true,
                        };

                        cache.writeQuery({
                            query: GET_COMMENTS,
                            variables: {
                                website_url: website_url,
                            },
                            data: {
                                allComments: allComments,
                            },
                        });
                    }
                }
            }
        },
    });

    return (
        <CommentDeleteContainer>
            <Button
                className="secondary"
                disabled={deleting}
                onClick={() => {
                    const confirmAction = window.confirm(
                        'Delete this comment?'
                    );

                    if (confirmAction) {
                        setDeleting(true);
                        deleteComment({
                            variables: {
                                comment: commentId,
                            },
                        })
                            .then((res) => {
                                console.log(res);
                                if (res) {
                                    toast.success(
                                        'Comment deleted successfully'
                                    );
                                } else {
                                    toast.error('Error deleting comment');
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                toast.error('Error deleting comment');
                            })
                            .finally(() => {
                                setDeleting(false);
                            });
                    }
                }}
            >
                <TrashIcon className="icon--small" />
            </Button>
        </CommentDeleteContainer>
    );
}
