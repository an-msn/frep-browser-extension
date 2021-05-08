import { GetCommentsQuery_allComments } from './__generated__/GetCommentsQuery';

export type CommentTree = {
    childNodes: CommentTree[];
} & GetCommentsQuery_allComments;
