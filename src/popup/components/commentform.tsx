import { useMutation } from '@apollo/client';
import { ArrowRightIcon } from '@heroicons/react/outline';
import GET_COMMENTS from '@popup/utils/queries/get_comments';
import INSERT_COMMENT from '@popup/utils/queries/insert_comment';
import { CreateCommentMutation } from '@popup/__generated__/CreateCommentMutation';
import { GetCommentsQuery } from '@popup/__generated__/GetCommentsQuery';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Toast from './toast';
import { SubmitButton, TextArea } from './ui';

const CommentFormContainer = styled.div`
    div {
        padding: 1rem 0;

        form {
            width: 100%;
        }
    }
`;

export default function CommentForm({
    isReply = false,
    parentId,
}: {
    isReply?: boolean;
    parentId?: string;
}) {
    const [addComment] = useMutation<CreateCommentMutation>(INSERT_COMMENT, {
        update(cache, { data, extensions, context }) {
            if (data?.createComment) {
                const newData = data.createComment;
                const existingCache = cache.readQuery<GetCommentsQuery>({
                    query: GET_COMMENTS,
                    variables: {
                        website_url: newData.website_url,
                    },
                });

                if (existingCache && newData) {
                    cache.writeQuery({
                        query: GET_COMMENTS,
                        variables: {
                            website_url: newData.website_url,
                        },
                        data: {
                            allComments: [
                                ...(existingCache.allComments || []),
                                newData,
                            ],
                        },
                    });
                }
            }
        },
    });
    const [loading, setLoading] = useState(false);

    const successToast = () =>
        toast.success('Comment posted', {
            autoClose: 3000,
        });
    const errorToast = (msg = 'Unable to post comment') => toast.error(msg);

    const formik = useFormik({
        initialValues: {
            comment: '',
            website_url: '',
        },
        onSubmit: (values) => {
            setLoading(true);
            addComment({
                variables: {
                    comment: values.comment,
                    website_url: values.website_url,
                    ...(parentId && {
                        parent: parentId,
                    }),
                },
            })
                .then((data) => {
                    formik.resetForm();
                    successToast();
                })
                .catch((err) => {
                    console.log(err);
                    errorToast();
                })
                .finally(() => {
                    setLoading(false);
                });
        },
    });

    useEffect(() => {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
            },
            (tabs) => {
                const tab = tabs[0];
                formik.setFieldValue('website_url', tab.url);
            }
        );
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <h2>{isReply ? 'Post reply' : 'Post a comment'}</h2>
            <CommentFormContainer>
                <form onSubmit={formik.handleSubmit}>
                    <TextArea
                        label="Comment"
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        parentClass="mb-0"
                        rows={4}
                    />
                    <SubmitButton
                        title="Post Comment"
                        titleLoading="Posting comment..."
                        disabled={loading}
                        loading={loading}
                        submitIcon={<ArrowRightIcon />}
                    />
                </form>
            </CommentFormContainer>
        </div>
    );
}
