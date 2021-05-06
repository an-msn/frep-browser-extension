import React, { useEffect, useState } from 'react';
import { TabbedItem, Tabs } from './components/tabs';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
    ApolloClient,
    createHttpLink,
    from,
    InMemoryCache,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import ImageFiltering from './tabs/imagefiltering';
import theme from './utils/theme';
import UserTab from './tabs/user';
import './utils/firebase';
import firebase from 'firebase';
import InitUser from './utils/inituser';

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

const httpLink = createHttpLink({
    uri: 'http://localhost:7000/api',
});

const Popup = () => {
    const [token, setToken] = useState('');

    console.log('Render');

    useEffect(() => {
        firebase.auth().onAuthStateChanged((u) => {
            if (u) {
                u.getIdToken().then((t) => {
                    console.log('Setting token');
                    setToken(t);
                });
            } else {
                setToken('');
                client.clearStore();
            }
        });
        // eslint-disable-next-line
    }, []);

    const authLink = setContext(async (_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    });

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: from([authLink, httpLink]),
    });

    return (
        <div className="App">
            <ApolloProvider client={client}>
                {token && <InitUser />}
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
                                <UserTab />
                            </TabbedItem>
                        </Tabs>
                    </Main>
                </ThemeProvider>
            </ApolloProvider>
        </div>
    );
};

export default Popup;
