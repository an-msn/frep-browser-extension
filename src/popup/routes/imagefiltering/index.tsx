import { Card } from '../../components/ui';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Switch from '../../components/switch';

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default function ImageFiltering() {
    const [filteringEnabled, setFilteringEnabled] = useState(false);

    const changeFiltering = () => {
        chrome.runtime.sendMessage(
            {
                action: 'update-image-filtering-options',
                options: {
                    enableFiltering: !filteringEnabled,
                },
            },
            () => {
                setFilteringEnabled(!filteringEnabled);
            }
        );
    };

    useEffect(() => {
        chrome.runtime.sendMessage(
            { action: 'get-image-filtering-options' },
            (res) => {
                if (res.options.enableFiltering) {
                    setFilteringEnabled(res.options.enableFiltering);
                }
            }
        );
    }, []);

    return (
        <div>
            <Card>
                <Header>
                    <h2>Image Filtering</h2>
                    <Switch
                        checked={filteringEnabled}
                        onChange={changeFiltering}
                    />
                </Header>
            </Card>
        </div>
    );
}
