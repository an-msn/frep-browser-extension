import { gql } from '@apollo/client';

const DELETE_COMMENT = gql`
    #graphql
    mutation DeleteCommentMutation($comment: String!) {
        deleteComment(comment: $comment)
    }
`;

export default DELETE_COMMENT;
