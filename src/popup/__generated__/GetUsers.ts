/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_allUsers {
  __typename: "User";
  id: string;
  name: string;
  username: string;
  isAdmin: boolean | null;
  banned: boolean;
}

export interface GetUsers {
  allUsers: GetUsers_allUsers[];
}
