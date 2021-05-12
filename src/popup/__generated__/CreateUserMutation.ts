/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUserMutation
// ====================================================

export interface CreateUserMutation_createUser {
  __typename: "Token";
  token: string;
}

export interface CreateUserMutation {
  createUser: CreateUserMutation_createUser;
}

export interface CreateUserMutationVariables {
  name: string;
  username: string;
  email: string;
  password: string;
}
