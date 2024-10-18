import React from 'react';
import ReactDOM from 'react-dom/client';
// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';

import './style/main.scss';
// const client = new ApolloClient({
//   uri: 'http://localhost/php_projects/scandiweb_store/backend/index.php',
//   cache: new InMemoryCache(),
// });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <App />

  </React.StrictMode>
);

