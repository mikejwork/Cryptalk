import * as React from 'react';
import '@testing-library/jest-dom';
import * as ReactTests from '@testing-library/react'

import App from '../App';

import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);

afterEach(ReactTests.cleanup)

describe("Login", () => {
  it("renders", async () => {
    const { container } = ReactTests.render(<App/>);
    expect(await ReactTests.screen.findByText(/Secure messaging and voice chat for teams./i)).toBeInTheDocument()

    const login = await container.querySelector('a[href="/authentication"]');
    expect(login).toBeTruthy();

    ReactTests.fireEvent.click(login);

    expect(await ReactTests.screen.findByText(/Login/i)).toBeInTheDocument()
  })

  it("username field rendered", async () => {
    const { container } = ReactTests.render(<App/>);

    expect(await ReactTests.screen.findByText(/Login/i)).toBeInTheDocument()

    const username_field = await container.querySelector('input[name="username"]');
    expect(username_field).toBeInTheDocument();
  })

  it("password field rendered", async () => {
    const { container } = ReactTests.render(<App/>);

    expect(await ReactTests.screen.findByText(/Login/i)).toBeInTheDocument()

    const password_field = await container.querySelector('input[name="password"]');
    expect(password_field).toBeInTheDocument();
  })

  it("user can login", async () => {
    const { container } = ReactTests.render(<App/>);

    expect(await ReactTests.screen.findByText(/Login/i)).toBeInTheDocument()

    const username_field = await container.querySelector('input[name="username"]');
    const password_field = await container.querySelector('input[name="password"]');

    ReactTests.fireEvent.change(username_field, { target: { value: 'developer' } })
    ReactTests.fireEvent.change(password_field, { target: { value: 'developer' } })

    expect(username_field).toHaveValue("developer");
    expect(password_field).toHaveValue("developer");

    await ReactTests.act (async () => {
      const node = ReactTests.screen.getByText("Sign in");
      ReactTests.fireEvent.click(node)
    });
  })
});
