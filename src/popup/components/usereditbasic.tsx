import { ApolloError, useMutation } from '@apollo/client';
import { CloudUploadIcon } from '@heroicons/react/outline';
import { store, User } from '@popup/utils/appstore';
import CURRENT_USER from '@popup/utils/queries/current_user';
import UPDATE_USER_BASIC from '@popup/utils/queries/update_user_basic';
import {
    UpdateUserBasicMutation,
    UpdateUserBasicMutationVariables,
} from '@popup/__generated__/UpdateUserBasicMutation';
import { UserQuery } from '@popup/__generated__/UserQuery';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { SubmitButton, TextField } from './ui';

const EditForm = styled.form`
    & > h3 {
        font-size: 1.15rem;
    }

    .update-btn {
        margin-top: 2rem;
    }
`;

export default function UserEditBasicInfo({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);

    const [updateInfo] = useMutation<
        UpdateUserBasicMutation,
        UpdateUserBasicMutationVariables
    >(UPDATE_USER_BASIC, {
        update(cache, { data, extensions, context }) {
            console.log(data);
            if (data?.updateUserBasicInfo) {
                const existingCache = cache.readQuery<UserQuery>({
                    query: CURRENT_USER,
                });

                if (existingCache) {
                    console.log(existingCache);
                    cache.writeQuery({
                        query: CURRENT_USER,
                        data: {
                            User: {
                                ...existingCache.User,
                                ...data.updateUserBasicInfo,
                            },
                        },
                    });
                }
            }
        },
    });

    const formik = useFormik({
        initialValues: {
            name: user.name,
            email: user.email,
            password: '',
        },
        validate: (val) => {
            const errors: { [x: string]: string } = {};

            if (!val.name) {
                errors.name = 'Enter your name';
            }

            if (!val.email.match(/\S+@\S+\.\S+/)) {
                errors.email = 'Invalid email address';
            }

            if (!val.password) {
                errors.password = 'Enter your password';
            }

            return errors;
        },
        onSubmit: (data) => {
            setLoading(true);

            updateInfo({
                variables: data,
            })
                .then((res) => {
                    console.log(res);
                    if (res) {
                        store.dispatch('user:set', {
                            ...(store.state.user as User),
                            ...(res.data?.updateUserBasicInfo as {
                                name: string;
                                email: string;
                            }),
                        });
                        toast.success('Profile updated');
                    }
                })
                .catch((err: ApolloError) => {
                    if (err.graphQLErrors.length > 0) {
                        const message = err.graphQLErrors[0].message;
                        if (message === 'invalid-password') {
                            toast.error('Password is wrong');
                        } else {
                            toast.error('An unexpected error occured');
                        }
                        return;
                    }
                    toast.error('An unexpected error occured');
                })
                .finally(() => {
                    setLoading(false);
                });
        },
    });
    return (
        <EditForm onSubmit={formik.handleSubmit}>
            <h3>Basic Info</h3>
            <TextField
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.errors.name &&
                    formik.getFieldMeta('name').touched &&
                    formik.errors.name
                }
            />
            <TextField
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.errors.email &&
                    formik.getFieldMeta('email').touched &&
                    formik.errors.email
                }
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.errors.password &&
                    formik.getFieldMeta('password').touched &&
                    formik.errors.password
                }
            />
            <SubmitButton
                className="update-btn"
                title="Update Profile"
                disabled={loading}
                loading={loading}
                submitIcon={<CloudUploadIcon />}
                titleLoading="Updating"
            />
        </EditForm>
    );
}
