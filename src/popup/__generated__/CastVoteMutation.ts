/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CastVoteMutation
// ====================================================

export interface CastVoteMutation_castVote {
  __typename: "Votes";
  own: number | null;
  up: number;
  down: number;
}

export interface CastVoteMutation {
  castVote: CastVoteMutation_castVote;
}

export interface CastVoteMutationVariables {
  comment: string;
  vote: number;
}
