import vegemite from 'vegemite';

export interface User {
    name: string;
    email: string;
    uid: string;
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
    console.log(action);
    if (action) {
        state.user = action;
        state.userLoading = false;
    }
});

store.on('user:loading', (state, action) => {
    state.userLoading = action;
});

export { store };
