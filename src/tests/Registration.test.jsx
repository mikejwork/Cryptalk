import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen, cleanup, fireEvent } from '@testing-library/react'

import App from '../App';

import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);

afterEach(cleanup)

describe("Registration", () => {
  it("renders", async () => {
    const { container } = render(<App/>);
    expect(await screen.findByText(/Secure messaging and voice chat for teams./i)).toBeInTheDocument()

    const login = await container.querySelector('a[href="/authentication"]');
    expect(login).toBeTruthy();

    fireEvent.click(login);

    expect(await screen.findByText(/Login/i)).toBeInTheDocument()

    const registration_link = await screen.findByText(/Don't have an account?/i);
    expect(registration_link).toBeTruthy();

    fireEvent.click(registration_link);

    expect(await screen.findByText(/I confirm that i have read/i)).toBeInTheDocument()
  })

  it("renders the Terms & Conditions", async () => {
    render(<App/>);
    const registration_link = await screen.findByText(/Don't have an account?/i);
    expect(registration_link).toBeTruthy();

    fireEvent.click(registration_link);

    expect(await screen.findByText(/I confirm that i have read/i)).toBeInTheDocument()

    const terms_link = await screen.findByText(/Terms & Conditions/i);
    expect(terms_link).toBeTruthy();

    fireEvent.click(terms_link);

    expect(await screen.findByText(/By using this Site, you indicate that you have read and understand/i)).toBeInTheDocument()
  })

  it("renders the Privacy Policy", async () => {
    render(<App/>);
    const registration_link = await screen.findByText(/Don't have an account?/i);
    expect(registration_link).toBeTruthy();

    fireEvent.click(registration_link);

    expect(await screen.findByText(/I confirm that i have read/i)).toBeInTheDocument()

    const privacy_link = await screen.findByText(/Privacy Policy/i);
    expect(privacy_link).toBeTruthy();

    fireEvent.click(privacy_link);

    expect(await screen.findByText(/Cryptalk is committed to providing quality services to you and this policy outlines/i)).toBeInTheDocument()
  })
});
