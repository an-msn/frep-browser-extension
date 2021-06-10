/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AllCommentsSortBy {
  date = "date",
  score = "score",
}

export enum ReportActions {
  DISCARD = "DISCARD",
  REMOVE_COMMENT = "REMOVE_COMMENT",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export interface AllCommentsSort {
  sortBy: AllCommentsSortBy;
  order?: SortOrder | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
