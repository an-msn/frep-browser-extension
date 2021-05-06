/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user {
  __typename: "User";
  uid: string;
  name: string;
  email: string;
  username: string;
}

export interface UserQuery {
  user: UserQuery_user | null;
}
