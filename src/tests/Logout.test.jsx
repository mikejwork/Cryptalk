import * as React from 'react';
import '@testing-library/jest-dom';
import * as ReactTests from '@testing-library/react'

import App from '../App';

import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);

afterEach(ReactTests.cleanup)

describe("Logout", () => {
  it("renders", async () => {
    const { container } = ReactTests.render(<App/>);
    expect(await ReactTests.screen.findByText(/Secure messaging and voice chat for teams./i)).toBeInTheDocument()

  })
});
