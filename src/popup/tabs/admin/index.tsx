import { store } from '@popup/utils/appstore';
import React, { useEffect, useState } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import AdminMain from './routes/main';
import AdminCommentReports from './routes/reports';
// import AdminUsers from './routes/users';

export default function AdminTab() {
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

    if (!userState.user?.isAdmin) {
        return null;
    }

    return (
        <MemoryRouter>
            <Route path="/" exact>
                <AdminMain />
            </Route>
            {/* <Route path="/users" exact>
                <AdminUsers />
            </Route> */}
            <Route path="/reports" exact>
                <AdminCommentReports />
            </Route>
        </MemoryRouter>
    );
}
