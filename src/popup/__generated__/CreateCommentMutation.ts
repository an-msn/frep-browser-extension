/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCommentMutation
// ====================================================

export interface CreateCommentMutation_createComment {
  __typename: "CreateCommentReturn";
  id: number;
}

export interface CreateCommentMutation {
  createComment: CreateCommentMutation_createComment | null;
}

export interface CreateCommentMutationVariables {
  comment: string;
  website_url: string;
  parent?: number | null;
}
