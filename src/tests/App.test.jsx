import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react'

import App from '../App';

import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);

afterEach(cleanup)

describe("App", () => {
  it("renders", async () => {
    render(<App/>);
    expect(await screen.findByText(/Secure messaging and voice chat for teams./i)).toBeInTheDocument()
  })

  it("logs the user out by default", async () => {
    const { container } = render(<App/>);
    expect(await screen.findByText(/Secure messaging and voice chat for teams./i)).toBeInTheDocument()

    const username = await container.querySelector('Link[name="username"]')
    expect(username).toBe(null);
  })
});
