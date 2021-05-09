import { gql } from '@apollo/client';

const CAST_VOTE = gql`
    #graphql
    mutation CastVoteMutation($comment: ID!, $vote: Int!) {
        castVote(comment: $comment, vote: $vote) {
            own
            up
            down
        }
    }
`;

export default CAST_VOTE;
