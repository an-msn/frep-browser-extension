/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCommentsQuery
// ====================================================

export interface GetCommentsQuery_allComments_user {
  __typename: "User";
  id: string;
  username: string;
  name: string;
  avatar: string;
}

export interface GetCommentsQuery_allComments {
  __typename: "Comment";
  id: string;
  comment: string;
  user: GetCommentsQuery_allComments_user;
}

export interface GetCommentsQuery {
  allComments: GetCommentsQuery_allComments[];
}

export interface GetCommentsQueryVariables {
  website_url: string;
}
