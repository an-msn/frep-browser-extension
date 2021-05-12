import { gql } from '@apollo/client';

const CREATE_USER = gql`
    #graphql
    mutation CreateUserMutation(
        $name: String!
        $username: String!
        $email: String!
        $password: String!
    ) {
        createUser(
            name: $name
            username: $username
            email: $email
            password: $password
        ) {
            token
        }
    }
`;

export default CREATE_USER;
