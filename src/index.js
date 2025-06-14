import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DataProvider } from './dataContext';
import { ConfigProvider } from './configContext';
import { SharedStateProvider } from './sharedStateContext';
import { CucitoProvider } from './cucitoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SharedStateProvider>
      <DataProvider>
        <ConfigProvider>
          <CucitoProvider>
            <App/>
          </CucitoProvider>
        </ConfigProvider>
      </DataProvider>
    </SharedStateProvider>
  </React.StrictMode>
);

reportWebVitals();
