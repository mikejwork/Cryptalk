import * as React from 'react';
import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent, act} from '@testing-library/react'

import App from '../App';

import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);

afterEach(cleanup)

describe("Login", () => {
  it("renders", async () => {
    const { container } = render(<App/>);
    expect(await screen.findByText(/Secure messaging and voice chat for teams./i)).toBeInTheDocument()

    const login = await container.querySelector('a[href="/authentication"]');
    expect(login).toBeTruthy();

    fireEvent.click(login);

    expect(await screen.findByText(/Login/i)).toBeInTheDocument()
  })

  it("username field rendered", async () => {
    const { container } = render(<App/>);

    expect(await screen.findByText(/Login/i)).toBeInTheDocument()

    const username_field = await container.querySelector('input[name="username"]');
    expect(username_field).toBeInTheDocument();
  })

  it("password field rendered", async () => {
    const { container } = render(<App/>);

    expect(await screen.findByText(/Login/i)).toBeInTheDocument()

    const password_field = await container.querySelector('input[name="password"]');
    expect(password_field).toBeInTheDocument();
  })

  it("user can login", async () => {
    const { container } = render(<App/>);

    expect(await screen.findByText(/Login/i)).toBeInTheDocument()

    const username_field = await container.querySelector('input[name="username"]');
    const password_field = await container.querySelector('input[name="password"]');

    fireEvent.change(username_field, { target: { value: 'developer' } })
    fireEvent.change(password_field, { target: { value: 'developer' } })

    expect(username_field).toHaveValue("developer");
    expect(password_field).toHaveValue("developer");

    await act (async () => {
      const node = screen.getByText("Sign in");
      fireEvent.click(node)
    });
  })
});
