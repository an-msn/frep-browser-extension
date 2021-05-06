/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCommentsQuery
// ====================================================

export interface GetCommentsQuery_comments_user {
  __typename: "User";
  uid: string;
  name: string;
  email: string | null;
  username: string;
  avatar: string;
}

export interface GetCommentsQuery_comments {
  __typename: "Comments";
  id: number;
  comment: string;
  url: string;
  user: GetCommentsQuery_comments_user | null;
}

export interface GetCommentsQuery {
  comments: (GetCommentsQuery_comments | null)[] | null;
}

export interface GetCommentsQueryVariables {
  website_url: string;
}
