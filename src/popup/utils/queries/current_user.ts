import { gql } from '@apollo/client';

const CURRENT_USER = gql`
    #graphql
    query UserQuery {
        User {
            id
            name
            email
            username
            avatar
            isAdmin
        }
    }
`;

export default CURRENT_USER;
