import React from 'react';
import { render } from 'react-dom';

import Popup from './popup';

render(<Popup />, window.document.querySelector('#app-container'));

// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept();
}
