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
        }
    }
`;

export default CURRENT_USER;
