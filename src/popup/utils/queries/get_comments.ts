import { gql } from '@apollo/client';

const GET_COMMENTS = gql`
    query GetCommentsQuery($website_url: String!, $sort: AllCommentsSort) {
        allComments(url: $website_url, sort: $sort) {
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
            deleted
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
