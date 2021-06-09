/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_User {
  __typename: "User";
  id: string;
  name: string;
  email: string | null;
  username: string;
  avatar: string;
  isAdmin: boolean | null;
}

export interface UserQuery {
  User: UserQuery_User | null;
}
