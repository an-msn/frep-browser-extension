import { gql } from '@apollo/client';

const GET_ALL_REPORTS = gql`
    query GetAllReports {
        allReports {
            comment {
                comment
                user {
                    username
                    name
                }
                website_url
            }
            user {
                id
                username
                name
            }
            message
            actionTaken
        }
    }
`;

export default GET_ALL_REPORTS;
