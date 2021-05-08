import { gql } from '@apollo/client';

const CREATE_VOTE = gql`
    #graphql
    mutation CreateVoteMutation($comment: ID!, $vote: Int!) {
        createVote(comment: $comment, vote: $vote)
    }
`;

export default CREATE_VOTE;
