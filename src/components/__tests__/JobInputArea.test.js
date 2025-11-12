import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobInputArea from '../JobInputArea';

describe('JobInputArea', () => {
  test('renders mode buttons and switches modes', async () => {
    render(<JobInputArea onSubmit={jest.fn()} />);
    // use test ids for mode buttons
    const addUrlModeBtn = screen.getByTestId('mode-add-url');
    const pasteDescBtn = screen.getByTestId('mode-paste-description');
    expect(addUrlModeBtn).toBeInTheDocument();
    expect(pasteDescBtn).toBeInTheDocument();

    // switch to description mode
    await userEvent.click(pasteDescBtn);
    expect(screen.getByLabelText(/Job Description:/i)).toBeInTheDocument();
  });

  test('shows error on empty url submit', async () => {
    const onSubmit = jest.fn();
    render(<JobInputArea onSubmit={onSubmit} />);
    // ensure in URL mode, submit empty — find submit button inside the form by test id
    const input = screen.getByPlaceholderText('https://example.com/job-posting');
    expect(input).toBeInTheDocument();
    const form = screen.getByTestId('job-form');
    const submitBtn = within(form).getByRole('button', { name: /Add URL/i });
    await userEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter a URL/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('validates malformed URL and accepts valid URL', async () => {
    const onSubmit = jest.fn();
    render(<JobInputArea onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('https://example.com/job-posting');
    // type invalid URL
    await userEvent.type(input, 'not-a-url');
    // submit (last button)
  const form = screen.getByTestId('job-form');
  let submitBtn = within(form).getByRole('button', { name: /Add URL/i });
  await userEvent.click(submitBtn);

    expect(screen.getByText(/Please enter a valid URL/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    // type valid URL
    await userEvent.clear(input);
    await userEvent.type(input, 'https://example.com/job');
  submitBtn = within(form).getByRole('button', { name: /Add URL/i });
  await userEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ url: 'https://example.com/job', description: '' });
  });

  test('submitting description calls onSubmit and clears textarea', async () => {
    const onSubmit = jest.fn();
    render(<JobInputArea onSubmit={onSubmit} />);

    // switch to description mode
    await userEvent.click(screen.getByRole('button', { name: /Paste Description/i }));
    const textarea = screen.getByPlaceholderText(/Paste the job description here.../i);
    await userEvent.type(textarea, 'This is the job description');

    const submitBtn = screen.getByRole('button', { name: /Save Description/i });
    await userEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith({ url: '', description: 'This is the job description' });
    expect(textarea).toHaveValue('');
  });
});
