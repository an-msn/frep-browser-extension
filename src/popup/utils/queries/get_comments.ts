import { gql } from '@apollo/client';

const GET_COMMENTS = gql`
    query GetCommentsQuery($website_url: String!) {
        allComments(url: $website_url) {
            id
            comment
            parent
            date
            votes {
                up
                down
                own
            }
            website_url
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
