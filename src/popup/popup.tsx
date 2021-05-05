import React, { useEffect } from 'react';
import { TabbedItem, Tabs } from './components/tabs';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import ImageFiltering from './tabs/imagefiltering';
import theme from './utils/theme';
import UserManagement from './tabs/user';
import './utils/firebase';
import firebase from 'firebase';

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

    .icon {
        width: 1.4rem;
        height: 1.4rem;
    }

    .ml-icon {
        margin-left: 1rem;
    }

    .mr-icon {
        margin-right: 1rem;
    }

    .mt-md {
        margin-top: 1rem;
    }
`;

const Main = styled.div`
    background: ${(props) => props.theme.bg};
    color: ${(props) => props.theme.text};
    width: 600px;
`;

const Popup = () => {
    useEffect(() => {
        firebase.auth().onAuthStateChanged((u) => {
            if (u) {
                console.log(u?.uid);
            } else {
                console.log('Not logged in');
            }
        });
    }, []);

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
