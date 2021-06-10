import { gql } from '@apollo/client';

const REPORT_ACTION = gql`
    #graphql
    mutation ReportActionMutation($id: String!, $action: ReportActions!) {
        reportAction(id: $id, action: $action)
    }
`;

export default REPORT_ACTION;
