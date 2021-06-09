/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserBasicMutation
// ====================================================

export interface UpdateUserBasicMutation_updateUserBasicInfo {
  __typename: "User";
  name: string;
  email: string | null;
}

export interface UpdateUserBasicMutation {
  updateUserBasicInfo: UpdateUserBasicMutation_updateUserBasicInfo | null;
}

export interface UpdateUserBasicMutationVariables {
  name: string;
  email: string;
  password: string;
}
