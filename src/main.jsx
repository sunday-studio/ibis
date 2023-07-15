import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppContextProvider } from './components/AppContext';

// styles
import './styles/_reset.scss';
import './styles/_base.scss';
import './styles/styles.scss';
import './styles/editor.scss';
import './styles/fonts.scss';
import './styles.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
);
