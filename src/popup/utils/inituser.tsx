import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { store } from './appstore';
import { UserQuery } from '@popup/__generated__/UserQuery';

const USER = gql`
    #graphql
    query UserQuery {
        user {
            uid
            name
            email
            username
        }
    }
`;

export default function InitUser() {
    const { loading, error, data } = useQuery<UserQuery>(USER);

    console.log('init user');
    if (loading) {
        store.dispatch('user:loading', true);
    } else if (error) {
        console.log(error);
    } else if (data) {
        store.dispatch('user:set', data.user);
    }

    return <React.Fragment></React.Fragment>;
}
