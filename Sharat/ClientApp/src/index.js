import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
    <Provider store={store}>
            <BrowserRouter>
            <App />
        </BrowserRouter>
        </Provider>
    </React.StrictMode>
    , document.getElementById('root'));

registerServiceWorker();
