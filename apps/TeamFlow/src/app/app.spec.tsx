import { render } from '@testing-library/react';

import App from './app';
import { MockedProvider } from '@apollo/client/testing';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <App />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(
      <MockedProvider>
        <App />
      </MockedProvider>
    );
    expect(getByText(/Hello to Team Flow/gi)).toBeTruthy();
  });
});
