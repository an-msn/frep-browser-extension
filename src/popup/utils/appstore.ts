import vegemite from 'vegemite';

export interface User {
    name: string;
    email: string;
    id: string;
    username: string;
    avatar: string;
}

interface EventMap {
    'user:set': User | null;
    'user:loading': boolean;
}

interface Store {
    userLoading: boolean;
    user: User | null;
}

const store = vegemite<EventMap, Store>({
    userLoading: true,
    user: null,
});

store.on('user:set', (state, action) => {
    state.user = action;
    state.userLoading = false;
});

store.on('user:loading', (state, action) => {
    state.userLoading = action;
});

export { store };
