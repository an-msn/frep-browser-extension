import { gql } from '@apollo/client';

const INSERT_COMMENT = gql`
    #graphql
    mutation CreateCommentMutation(
        $comment: String!
        $website_url: String!
        $parent: ID
    ) {
        createComment(
            website_url: $website_url
            comment: $comment
            parent: $parent
        ) {
            id
            comment
            date
            website_url
            parent
            user {
                id
                name
                username
                avatar
            }
        }
    }
`;

export default INSERT_COMMENT;
