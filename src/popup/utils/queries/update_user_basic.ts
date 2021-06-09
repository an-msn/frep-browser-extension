import { gql } from '@apollo/client';

const UPDATE_USER_BASIC = gql`
    #graphql
    mutation UpdateUserBasicMutation(
        $name: String!
        $email: String!
        $password: String!
    ) {
        updateUserBasicInfo(name: $name, email: $email, password: $password) {
            name
            email
        }
    }
`;

export default UPDATE_USER_BASIC;
