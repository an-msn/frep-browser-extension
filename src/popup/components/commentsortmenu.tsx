import React, { useState } from 'react';
import '@szhsin/react-menu/dist/index.css';
import { Menu, MenuButton, MenuHeader, MenuItem } from '@szhsin/react-menu';
import {
    DotsVerticalIcon,
    SortAscendingIcon,
    SortDescendingIcon,
} from '@heroicons/react/outline';
import styled from 'styled-components';
import {
    GetCommentsQuery,
    GetCommentsQueryVariables,
} from '@popup/__generated__/GetCommentsQuery';
import { ApolloQueryResult } from '@apollo/client';
import { AllCommentsSortBy, SortOrder } from '@popup/__generated__/globalTypes';

const CommentSortMenuContainer = styled.div`
    margin-left: 0.5rem;

    .menu-button {
        display: inline-flex;
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

            &.active {
                background-color: ${(props) => props.theme.secondaryLight};
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

type SortTypes = 'date' | 'score';
type SortOrders = 'asc' | 'desc';

export default function CommentSortMenu({
    refetch,
}: {
    refetch:
        | ((
              variables?: Partial<GetCommentsQueryVariables> | undefined
          ) => Promise<ApolloQueryResult<GetCommentsQuery>>)
        | undefined;
}) {
    const [sorting, setSorting] = useState<
        Record<SortTypes, { name: string; order: SortOrders; active: boolean }>
    >({
        score: { name: 'Votes', order: 'desc', active: true },
        date: { name: 'Date', order: 'desc', active: false },
    });

    const updateSorting = (
        type: SortTypes,
        v: Partial<{ name: string; order: SortOrders; active: boolean }>
    ) =>
        setSorting((p) => {
            const prevs = p;
            Object.keys(prevs).forEach((_prv) => {
                const prv = _prv as SortTypes;
                prevs[prv].active = false;
            });
            return { ...prevs, [type]: { ...p[type], ...v } };
        });

    const handleSort = (type: SortTypes, order: SortOrders) => {
        let newOrder = sorting[type].active
            ? sorting[type].order === 'asc'
                ? 'desc'
                : 'asc'
            : order;

        if (refetch)
            refetch({
                sort: {
                    sortBy: AllCommentsSortBy[type],
                    order: SortOrder[newOrder],
                },
            }).then(() => {
                updateSorting(type, {
                    order: newOrder,
                    active: true,
                });
            });
    };

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
                {(() => {
                    return Object.keys(sorting).map((_item) => {
                        const item = _item as SortTypes;
                        return (
                            <MenuItem
                                key={`comment-sorting-${item}`}
                                onClick={() => {
                                    handleSort(item, sorting[item].order);
                                }}
                                className={sorting[item].active ? 'active' : ''}
                            >
                                <span>{sorting[item].name}</span>
                                <button
                                    onClick={(e) => {
                                        handleSort(item, sorting[item].order);
                                        e.stopPropagation();
                                    }}
                                >
                                    {sorting[item].order === 'desc' ? (
                                        <SortDescendingIcon className="icon" />
                                    ) : (
                                        <SortAscendingIcon className="icon" />
                                    )}
                                </button>
                            </MenuItem>
                        );
                    });
                })()}
            </Menu>
        </CommentSortMenuContainer>
    );
}
