import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './app/app';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Set up the context link to add headers
const authLink = setContext((_, { headers }) => {
  // Get the token from local storage or any other secure place
  const token = '';

  // Return the headers with the Authorization token if it exists
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Combine authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>
);
