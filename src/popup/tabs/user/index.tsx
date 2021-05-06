import { store } from '@popup/utils/appstore';
import React, { useEffect, useState } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import UserLogin from './routes/login';
import UserManagement from './routes/main';

export default function UserTab() {
    const [userState, setUserState] = useState({
        user: store.state.user,
        loading: store.state.userLoading,
    });

    useEffect(() => {
        store.listen('user:set', (s) => {
            setUserState({
                loading: s.userLoading,
                user: s.user,
            });
        });
    }, []);

    if (userState.loading) {
        return <div>Loading...</div>;
    }

    return (
        <MemoryRouter>
            {userState.user ? (
                <Route path="/">
                    <UserManagement />
                </Route>
            ) : (
                <Route path="/">
                    <UserLogin />
                </Route>
            )}
        </MemoryRouter>
    );
}
