import { CloudUploadIcon } from '@heroicons/react/outline';
import { User } from '@popup/utils/appstore';
import firebase from 'firebase';
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

export default function UserEditPassword({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            newpassword: '',
            confirmnewpassword: '',
            currentpassword: '',
        },
        validate: (val) => {
            const errors: { [x: string]: string } = {};

            if (!val.newpassword) {
                errors.newpassword = 'Enter new password';
            }

            if (val.newpassword.length < 8) {
                errors.newpassword =
                    'Password must contain atleast 8 characters';
            }

            if (!val.confirmnewpassword) {
                errors.confirmnewpassword = 'Confirm new password';
            }

            if (val.confirmnewpassword !== val.newpassword) {
                errors.confirmnewpassword = "Passwords don't match";
            }

            if (!val.currentpassword) {
                errors.currentpassword = 'Enter current password';
            }

            return errors;
        },
        onSubmit: (data) => {
            setLoading(true);
            const cred = firebase.auth.EmailAuthProvider.credential(
                user.email,
                data.currentpassword
            );
            firebase
                .auth()
                .currentUser?.reauthenticateWithCredential(cred)
                .then(() => {
                    firebase
                        .auth()
                        .currentUser?.updatePassword(data.newpassword)
                        .then(() => {
                            toast.success('Password updated');
                        })
                        .catch((err) => {
                            console.log(err);
                            toast.error('Error updating password');
                        });
                })
                .catch((err) => {
                    console.log('Error', err);
                    if (err.code === 'auth/wrong-password') {
                        toast.error('Current password is wrong');
                    } else if (err.code === 'auth/too-many-requests') {
                        toast.error(
                            'Too many attempts, please wait a few moments'
                        );
                    } else {
                        toast.error('An unexpected error occured');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
    });
    return (
        <EditForm onSubmit={formik.handleSubmit}>
            <h3>Update Password</h3>
            <TextField
                label="New Password"
                name="newpassword"
                type="password"
                value={formik.values.newpassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.errors.newpassword &&
                    formik.getFieldMeta('newpassword').touched &&
                    formik.errors.newpassword
                }
            />
            <TextField
                label="Confirm New Password"
                name="confirmnewpassword"
                type="password"
                value={formik.values.confirmnewpassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.errors.confirmnewpassword &&
                    formik.getFieldMeta('confirmnewpassword').touched &&
                    formik.errors.confirmnewpassword
                }
            />
            <TextField
                label="Current Password"
                name="currentpassword"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    formik.errors.currentpassword &&
                    formik.getFieldMeta('currentpassword').touched &&
                    formik.errors.currentpassword
                }
            />
            <SubmitButton
                className="update-btn"
                title="Update Password"
                disabled={loading}
                loading={loading}
                submitIcon={<CloudUploadIcon />}
                titleLoading="Updating"
            />
        </EditForm>
    );
}
