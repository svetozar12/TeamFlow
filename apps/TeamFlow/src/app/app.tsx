// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { SetList, SetForm } from '@team-flow/feature-sets';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
export function App() {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache,
  });

  return (
    <ApolloProvider client={client}>
      Hello to Team Flow
      <SetForm />
      <SetList />
    </ApolloProvider>
  );
}

export default App;
