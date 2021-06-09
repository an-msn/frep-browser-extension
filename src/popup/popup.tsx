import React, { useEffect, useState } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
    ApolloClient,
    createHttpLink,
    from,
    InMemoryCache,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import theme from './utils/theme';
import './utils/firebase';
import firebase from 'firebase';
import { store } from './utils/appstore';
import Main from './main';

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

        &--small {
            width: 1rem;
            height: 1rem;
        }
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

    .mb-0 {
        margin-bottom: 0rem;
    }

    ::-webkit-scrollbar {
        width: 8px;
        background: hsl(256, 11%, 5%);
    }

    ::-webkit-scrollbar-thumb {
        background: hsl(256, 11%, 25%);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-corner {
        background: hsl(255, 100%, 15%);
    }
`;

const httpLink = createHttpLink({
    uri: 'http://localhost:7000/api',
});

const Popup = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        firebase.auth().onAuthStateChanged((u) => {
            if (u) {
                u.getIdToken().then((t) => {
                    setToken(t);
                });
            } else {
                setToken('');
                store.dispatch('user:set', null);
                console.log('Nulling user');
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
                <ThemeProvider theme={theme.dark}>
                    <GlobalStyles />
                    <Main token={token} />
                </ThemeProvider>
            </ApolloProvider>
        </div>
    );
};

export default Popup;
