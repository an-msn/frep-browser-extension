/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllReports
// ====================================================

export interface GetAllReports_allReports_comment_user {
  __typename: "User";
  username: string;
  name: string;
}

export interface GetAllReports_allReports_comment {
  __typename: "Comment";
  comment: string;
  user: GetAllReports_allReports_comment_user;
  website_url: string;
}

export interface GetAllReports_allReports_user {
  __typename: "User";
  id: string;
  username: string;
  name: string;
}

export interface GetAllReports_allReports {
  __typename: "CommentReport";
  id: string;
  comment: GetAllReports_allReports_comment;
  user: GetAllReports_allReports_user;
  message: string;
  actionTaken: boolean;
}

export interface GetAllReports {
  allReports: GetAllReports_allReports[] | null;
}
