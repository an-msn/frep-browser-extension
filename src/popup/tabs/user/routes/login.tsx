import React, { useState } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { Button, Card, TextField } from '@popup/components/ui';
import { LoginIcon } from '@heroicons/react/outline';
import firebase from 'firebase/app';
import 'firebase/auth';
import Toast from '@popup/components/toast';
import { toast } from 'react-toastify';
import Loader from '@popup/components/loader';

const LoginFormContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    padding: 0 2rem 2rem 2rem;

    .title {
        width: 100%;
        padding-top: 1rem;

        h2 {
            text-align: left;
            font-size: 1.4rem;
            margin-bottom: 1rem;
        }
    }

    form {
        width: 100%;
    }
`;

export default function UserLogin() {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: (val) => {
            const errors: { [x: string]: string } = {};
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

            firebase
                .auth()
                .signInWithEmailAndPassword(data.email, data.password)
                .then(() => {
                    successToast();
                })
                .catch((err) => {
                    if (
                        err.code === 'auth/wrong-password' ||
                        err.code === 'auth/user-not-found'
                    ) {
                        errorToast('Incorrect email or password');
                    } else {
                        errorToast();
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
    });

    const successToast = () =>
        toast.success('Login successfull, please wait..');
    const errorToast = (msg = 'Unable to login') => toast.error(msg);

    return (
        <div>
            <Card>
                <LoginFormContainer>
                    <div className="title">
                        <h2>Login</h2>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
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
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.errors.password &&
                                formik.getFieldMeta('password').touched &&
                                formik.errors.password
                            }
                        />
                        <Button
                            className="mt-md"
                            type="submit"
                            disabled={
                                Object.keys(formik.errors).length > 0 || loading
                            }
                        >
                            {!loading ? (
                                <React.Fragment>
                                    Login
                                    <LoginIcon className="ml-icon icon" />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    Submitting...
                                    <Loader className="ml-icon icon" />
                                </React.Fragment>
                            )}
                        </Button>
                    </form>
                </LoginFormContainer>
            </Card>
            <Toast />
        </div>
    );
}
