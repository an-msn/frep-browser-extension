import React from 'react';
import '@szhsin/react-menu/dist/index.css';
import { Menu, MenuButton, MenuHeader, MenuItem } from '@szhsin/react-menu';
import { DotsVerticalIcon, SortDescendingIcon } from '@heroicons/react/outline';
import styled from 'styled-components';

const CommentSortMenuContainer = styled.div`
    margin-left: 0.5rem;

    .menu-button {
        background-color: ${(props) => props.theme.secondaryLight};
        border: 0;
        color: ${(props) => props.theme.text};
        padding: 0.6rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
    }

    ul {
        background: ${(props) => props.theme.bg};

        .rc-menu__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
            color: ${(props) => props.theme.text};

            &.rc-menu__item--hover,
            &.rc-menu__item--active,
            &.rc-menu__item--focus {
                background-color: ${(props) => props.theme.bgLight};
            }

            button {
                background-color: transparent;
                color: ${(props) => props.theme.text};
                border: 0;
                cursor: pointer;
                transition: color 0.35s;

                &:hover {
                    color: ${(props) => props.theme.primary};
                }

                .icon {
                    width: 1rem;
                    height: 1rem;
                }
            }
        }
    }
`;

export default function CommentSortMenu() {
    return (
        <CommentSortMenuContainer>
            <Menu
                menuButton={
                    <MenuButton className="menu-button">
                        <DotsVerticalIcon className="sort-icon icon" />
                    </MenuButton>
                }
                theming="dark"
                align="end"
                offsetY={8}
            >
                <MenuHeader>Sort By</MenuHeader>
                <MenuItem>
                    <span>Votes</span>
                    <button>
                        <SortDescendingIcon className="icon" />
                    </button>
                </MenuItem>
                <MenuItem>
                    <span>Date</span>
                    <button>
                        <SortDescendingIcon className="icon" />
                    </button>
                </MenuItem>
            </Menu>
        </CommentSortMenuContainer>
    );
}
