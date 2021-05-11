/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllCommentsSort } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetCommentsQuery
// ====================================================

export interface GetCommentsQuery_allComments_votes {
  __typename: "Votes";
  up: number;
  down: number;
  own: number | null;
}

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
  parent: string | null;
  date: string;
  votes: GetCommentsQuery_allComments_votes;
  website_url: string;
  user: GetCommentsQuery_allComments_user;
}

export interface GetCommentsQuery {
  allComments: GetCommentsQuery_allComments[];
}

export interface GetCommentsQueryVariables {
  website_url: string;
  sort?: AllCommentsSort | null;
}
