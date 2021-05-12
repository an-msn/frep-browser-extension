import React from 'react';
import { useQuery } from '@apollo/client';
import { store } from './appstore';
import { UserQuery } from '@popup/__generated__/UserQuery';
import CURRENT_USER from './queries/current_user';

export default function InitUser() {
    const { loading, error, data } = useQuery<UserQuery>(CURRENT_USER, {
        fetchPolicy: 'no-cache',
    });

    if (loading) {
        store.dispatch('user:loading', true);
    } else if (error) {
        console.log(error);
    } else if (data) {
        console.log(data);
        if (data.User) {
            store.dispatch('user:set', {
                ...data.User,
                email: data.User?.email as string,
            });
        } else {
            store.dispatch('user:set', null);
        }
    }

    return <React.Fragment></React.Fragment>;
}
