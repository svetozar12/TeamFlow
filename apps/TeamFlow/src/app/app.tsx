import { SetList, SetForm } from '@team-flow/feature-sets';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
