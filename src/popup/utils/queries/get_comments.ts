import { gql } from '@apollo/client';

const GET_COMMENTS = gql`
    query GetCommentsQuery($website_url: String!) {
        allComments(url: $website_url) {
            id
            comment
            user {
                id
                username
                name
                avatar
            }
        }
    }
`;

export default GET_COMMENTS;
