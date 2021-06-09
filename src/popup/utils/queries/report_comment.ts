import { gql } from '@apollo/client';

const REPORT_COMMENT = gql`
    #graphql
    mutation ReportCommentMutation($comment: ID!, $message: String!) {
        reportComment(comment: $comment, message: $message)
    }
`;

export default REPORT_COMMENT;
