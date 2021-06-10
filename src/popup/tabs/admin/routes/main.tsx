import { FlagIcon, UsersIcon } from '@heroicons/react/outline';
import { Button, Card } from '@popup/components/ui';
import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const AdminMainContainer = styled.div`
    .item {
        margin: 1rem 0;

        & > div {
            width: 100%;

            .button {
                width: 100%;

                .icon {
                    margin-left: 1rem;
                }
            }
        }
    }
`;

export default function AdminMain() {
    const router = useHistory();

    return (
        <Card>
            <AdminMainContainer>
                <div className="item">
                    <Button
                        className="secondary"
                        onClick={() => router.push('/users')}
                    >
                        Users
                        <UsersIcon className="icon icon--small" />
                    </Button>
                </div>
                <div className="item">
                    <Button
                        className="secondary"
                        onClick={() => router.push('/reports')}
                    >
                        Reports
                        <FlagIcon className="icon icon--small" />
                    </Button>
                </div>
            </AdminMainContainer>
        </Card>
    );
}
