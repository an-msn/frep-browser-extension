import { useQuery } from '@apollo/client';
import PageHeader from '@popup/components/pageheader';
import { Button, Card } from '@popup/components/ui';
import GET_ALL_USERS from '@popup/utils/queries/all_users';
import { GetUsers } from '@popup/__generated__/GetUsers';
import firebase from 'firebase';
import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const AdminUsersContainer = styled.div``;

export default function AdminUsers() {
    const router = useHistory();

    const { loading, error, data } = useQuery<GetUsers>(GET_ALL_USERS);

    return (
        <AdminUsersContainer>
            <PageHeader
                title="Users"
                backAction={() => {
                    router.goBack();
                }}
            />
            {(() => {
                if (loading) {
                    return <p>Loading</p>;
                }

                if (error) {
                    return <p>An error occured</p>;
                }

                return (
                    <div className="users">
                        {data?.allUsers.map((user) => (
                            <UserCard {...user} key={user.id} />
                        ))}
                    </div>
                );
            })()}
        </AdminUsersContainer>
    );
}

const UserCard = ({
    name,
    username,
    id,
    isAdmin,
    banned,
}: {
    name: string;
    username: string;
    id: string;
    isAdmin: boolean | null;
    banned: boolean;
}) => {
    const currentUserId = firebase.auth().currentUser?.uid;

    return (
        <Card>
            <div>
                <p className="name">{name}</p>
                <p className="username">{username}</p>
            </div>
            <div>
                <div className="admin-access">
                    {(() => {
                        if (id !== currentUserId) {
                            if (isAdmin)
                                return (
                                    <Button className="secondary">
                                        Remove Admin
                                    </Button>
                                );
                            return (
                                <Button className="secondary">
                                    Make Admin
                                </Button>
                            );
                        }
                        return null;
                    })()}
                </div>
                <div className="manage-bans">
                    {(() => {
                        if (id !== currentUserId) {
                            if (banned)
                                return (
                                    <Button className="secondary">Unban</Button>
                                );
                            return (
                                <React.Fragment>
                                    <Button className="secondary">
                                        Warn ban
                                    </Button>
                                    <Button className="secondary">Ban</Button>
                                </React.Fragment>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>
        </Card>
    );
};
