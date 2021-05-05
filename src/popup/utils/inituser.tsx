import React from 'react';
import { useQuery, gql } from '@apollo/client';

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
    const { loading, error, data } = useQuery(USER);

    if (loading) {
        console.log('Loading');
    }

    if (error) {
        console.log(error);
    }

    if (data) {
        console.log(data);
    }

    return <React.Fragment></React.Fragment>;
}
