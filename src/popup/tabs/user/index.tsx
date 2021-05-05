import { store } from '@popup/utils/appstore';
import React, { useState } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import UserLogin from './routes/login';

export default function UserManagement() {
    const [user, setUser] = useState(store.state.user);
    return (
        <MemoryRouter>
            {!user ? (
                <Route path="/">
                    <UserLogin />
                </Route>
            ) : (
                <Route path="/">
                    <UserManagement />
                </Route>
            )}
        </MemoryRouter>
    );
}
