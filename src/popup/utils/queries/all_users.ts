import { gql } from '@apollo/client';

const GET_ALL_USERS = gql`
    query GetUsers {
        allUsers {
            id
            name
            username
            isAdmin
            banned
        }
    }
`;

export default GET_ALL_USERS;
