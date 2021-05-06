import CommentForm from '@popup/components/commentform';
import { Card } from '@popup/components/ui';
import { store } from '@popup/utils/appstore';
import React, { useEffect, useState } from 'react';

export default function CommentsPage() {
    const [user, setUser] = useState(store.state.user);

    useEffect(() => {
        store.listen('user:set', (state) => {
            setUser(state.user);
        });
    }, []);

    return (
        <Card>
            <h1>Comments</h1>
            {user && <CommentForm />}
        </Card>
    );
}
