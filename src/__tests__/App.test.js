import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

test('adding a job via JobInputArea appears in Saved Job Listings', async () => {
  render(<App />);

  // Switch to description mode and add a job
  await userEvent.click(screen.getByRole('button', { name: /Paste Description/i }));
  const textarea = screen.getByPlaceholderText(/Paste the job description here.../i);
  await userEvent.type(textarea, 'Tester job description');
  const submitBtn = screen.getByRole('button', { name: /Save Description/i });
  await userEvent.click(submitBtn);

  // The listing should appear in the main area
  expect(await screen.findByText(/Saved Job Listings/i)).toBeInTheDocument();
  expect(screen.getByText(/Tester job description/i)).toBeInTheDocument();
});
