import { store } from '@popup/utils/appstore';
import React, { useEffect, useState } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import UserLogin from './routes/login';
import UserManagement from './routes/main';
import UserRegister from './routes/register';

export default function UserTab() {
    const [userState, setUserState] = useState({
        user: store.state.user,
        loading: store.state.userLoading,
    });

    useEffect(() => {
        const unsub = store.listen('user:set', (s) => {
            setUserState({
                loading: s.userLoading,
                user: s.user,
            });
        });

        return () => {
            unsub();
        };
    }, []);

    if (userState.loading) {
        return <div>Loading...</div>;
    }

    return (
        <MemoryRouter>
            {userState.user ? (
                <Route path="/" exact>
                    <UserManagement />
                </Route>
            ) : (
                <React.Fragment>
                    <Route path="/" exact>
                        <UserLogin />
                    </Route>
                    <Route path="/register">
                        <UserRegister />
                    </Route>
                </React.Fragment>
            )}
        </MemoryRouter>
    );
}
