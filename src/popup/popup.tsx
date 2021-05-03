import React from 'react';
import { TabbedItem, Tabs } from './components/tabs';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import ImageFiltering from './routes/imagefiltering';
import theme from './utils/theme';
import UserManagement from './routes/user';

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    @font-face {
        font-family: Rubik;
        src: url('../assets/fonts/rubik.ttf') format('truetype-variations');
        font-weight: 1 999;
        font-style: oblique 0deg 20deg;
    }

    body {
        font-family: 'Rubik', sans-serif;
        font-style: normal;
    }
`;

const Main = styled.div`
    background: ${(props) => props.theme.bg};
    color: ${(props) => props.theme.text};
    width: 600px;
`;

const Popup = () => {
    return (
        <div className="App">
            <ThemeProvider theme={theme.dark}>
                <GlobalStyles />
                <Main>
                    <Tabs>
                        <TabbedItem title="Image Filtering">
                            <ImageFiltering />
                        </TabbedItem>
                        <TabbedItem title="Comments">
                            <h2>Comments</h2>
                        </TabbedItem>
                        <TabbedItem title="User">
                            <UserManagement />
                        </TabbedItem>
                    </Tabs>
                </Main>
            </ThemeProvider>
        </div>
    );
};

export default Popup;
