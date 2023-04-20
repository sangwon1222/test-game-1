// import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import GlobalStyles from '@/assets/styles/global';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <StrictMode>
  <div>
    <GlobalStyles />
    <App />
  </div>
  // </StrictMode>
);
