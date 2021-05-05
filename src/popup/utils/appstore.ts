import vegemite from 'vegemite';

export interface User {
    name: string;
    email: string;
    uid: string;
    username: string;
}

interface EventMap {
    'set:user': User | null;
}

interface Store {
    user: User | null;
}

const store = vegemite<EventMap, Store>({
    user: null,
});

export { store };
