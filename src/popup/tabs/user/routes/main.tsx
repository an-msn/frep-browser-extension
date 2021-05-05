import { Card } from '../../../components/ui';
import React, { useEffect, useState } from 'react';
import { LogoutIcon, PencilIcon } from '@heroicons/react/outline';
import styled from 'styled-components';
import md5 from 'md5';

interface UserBasic {
    displayName: string;
    userName: string;
    email: string;
    avatar: string | null;
}

const UserDataContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    padding-bottom: 2rem;

    .data {
        text-align: center;

        .image {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 1rem;

            img {
                width: 100%;
            }
        }

        h2 {
            font-size: 1.7rem;
            font-weight: bold;
        }

        p {
            font-size: 1rem;
            font-style: italic;
            font-family: 'Helvetica Neue', sans-serif;
        }
    }

    .logout,
    .edit-profile {
        position: absolute;
        top: 0rem;
        right: 22px;
        display: flex;
        color: ${(props) => props.theme.textAlt};
        align-items: center;
        cursor: pointer;

        p {
            font-size: 1rem;
        }

        svg {
            margin-left: 0.5rem;
        }
    }

    .edit-profile {
        top: auto;
        bottom: 0;
    }
`;

export default function UserManagement() {
    const [state, setState] = useState<UserBasic>({
        displayName: 'Akshay',
        userName: 'akzhy',
        email: 'hi@akzhy.com',
        avatar: null,
    });

    const updateState = (v: Partial<UserBasic>) =>
        setState((p) => ({ ...p, ...v }));

    useEffect(() => {
        const emailHash = md5(state.email);
        updateState({
            avatar: `https://www.gravatar.com/avatar/${emailHash}?d=retro`,
        });
    }, [state.email]);

    return (
        <div>
            <Card>
                <UserDataContainer>
                    <div className="data">
                        <div className="image">
                            <img src={state.avatar || ''} alt="Profile Url" />
                        </div>
                        <h2>{state.displayName}</h2>
                        <p>@{state.userName}</p>
                    </div>
                    <div className="logout">
                        <p>Logout</p>
                        <LogoutIcon className="icon" />
                    </div>
                    <div className="edit-profile">
                        <p>Edit Profile</p>
                        <PencilIcon className="icon" />
                    </div>
                </UserDataContainer>
            </Card>
        </div>
    );
}
