import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TabbedItem, Tabs } from './components/tabs';
import Toast from './components/toast';
import AdminTab from './tabs/admin';
import CommentsPage from './tabs/comments';
import ImageFiltering from './tabs/imagefiltering';
import UserTab from './tabs/user';
import { store } from './utils/appstore';
import CURRENT_USER from './utils/queries/current_user';
import { UserQuery } from './__generated__/UserQuery';

const MainContainer = styled.div`
    background: ${(props) => props.theme.bg};
    color: ${(props) => props.theme.text};
    width: 600px;
`;

export default function Main({ token }: { token: string }) {
    const [getCurrentUser, { loading, data, error }] = useLazyQuery<UserQuery>(
        CURRENT_USER,
        {
            fetchPolicy: 'no-cache',
        }
    );

    useEffect(() => {
        if (token.length > 1) {
            store.dispatch('user:loading', true);
            getCurrentUser();
        }
    }, [token, getCurrentUser]);

    if (!loading && !error) {
        if (data?.User) {
            store.dispatch('user:set', {
                ...data.User,
                email: data.User?.email as string,
                isAdmin: data.User.isAdmin === true,
            });
        } else {
            store.dispatch('user:set', null);
        }
    }

    return (
        <MainContainer>
            <Tabs>
                <TabbedItem title="Image Filtering">
                    <ImageFiltering />
                </TabbedItem>
                <TabbedItem title="Comments">
                    <CommentsPage />
                </TabbedItem>
                <TabbedItem title="User">
                    <UserTab />
                </TabbedItem>
                {data?.User?.isAdmin && (
                    <TabbedItem title="Admin">
                        <AdminTab />
                    </TabbedItem>
                )}
            </Tabs>
            <Toast />
        </MainContainer>
    );
}
