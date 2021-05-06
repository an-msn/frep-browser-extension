import { useMutation } from '@apollo/client';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { useFormik } from 'formik';
import gql from 'graphql-tag';
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

const INSERT_COMMENT = gql`
    #graphql
    mutation CreateCommentMutation(
        $comment: String!
        $website_url: String!
        $parent: Int
    ) {
        createComment(
            website_url: $website_url
            comment: $comment
            parent: $parent
        ) {
            id
        }
    }
`;

export default function CommentForm() {
    const [addComment] = useMutation(INSERT_COMMENT);
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
                },
            })
                .then((data) => {
                    console.log(data);
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
            <h2>Post a comment</h2>
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
            <Toast />
        </div>
    );
}
