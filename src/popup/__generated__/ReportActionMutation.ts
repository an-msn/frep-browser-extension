/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReportActions } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReportActionMutation
// ====================================================

export interface ReportActionMutation {
  reportAction: boolean | null;
}

export interface ReportActionMutationVariables {
  id: string;
  action: ReportActions;
}
