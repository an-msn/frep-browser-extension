import { ArrowLeftIcon } from '@heroicons/react/outline';
import { Card } from '@popup/components/ui';
import UserEditBasicInfo from '@popup/components/usereditbasic';
import UserEditPassword from '@popup/components/usereditpassword';
import { store } from '@popup/utils/appstore';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const EditProfileContainer = styled.div`
    .header {
        display: flex;
        align-items: center;

        svg {
            color: ${(props) => props.theme.text};
            margin-bottom: -0.1rem;
        }

        h2 {
            margin-left: 1rem;
        }
    }

    .basic-info,
    .password {
        margin-top: 1rem;
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
`;

export default function EditProfile() {
    const [userData, setUserData] = useState(store.state.user);

    useEffect(() => {
        const unsub = store.listen('user:set', (s) => {
            setUserData(s.user);
        });

        return () => {
            unsub();
        };
    }, []);
    return (
        <EditProfileContainer>
            <Card className="header">
                <Link to="/">
                    <ArrowLeftIcon className="icon" />
                </Link>
                <h2>Edit Profile</h2>
            </Card>
            <Card className="basic-info">
                {userData && <UserEditBasicInfo user={userData} />}
            </Card>
            <Card className="password">
                {userData && <UserEditPassword user={userData} />}
            </Card>
        </EditProfileContainer>
    );
}
