/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCommentMutation
// ====================================================

export interface CreateCommentMutation_createComment_user {
  __typename: "User";
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface CreateCommentMutation_createComment {
  __typename: "Comment";
  id: string;
  comment: string;
  date: string;
  website_url: string;
  parent: string | null;
  user: CreateCommentMutation_createComment_user;
}

export interface CreateCommentMutation {
  createComment: CreateCommentMutation_createComment | null;
}

export interface CreateCommentMutationVariables {
  comment: string;
  website_url: string;
  parent?: string | null;
}
