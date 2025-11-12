import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Generate Application button', () => {
  test('is disabled until a job and a resume are provided, then enables and triggers action', async () => {
    render(<App />);

    const genBtn = screen.getByTestId('generate-btn');
    expect(genBtn).toBeInTheDocument();
    expect(genBtn).toBeDisabled();

    // Add a job (URL mode)
    const jobInput = screen.getByPlaceholderText('https://example.com/job-posting');
    expect(jobInput).toBeInTheDocument();
    const jobForm = screen.getByTestId('job-form');
    const addUrlBtn = within(jobForm).getByRole('button', { name: /Add URL/i });
    await userEvent.type(jobInput, 'https://example.com/job1');
    await userEvent.click(addUrlBtn);

    // still disabled because resume missing
    expect(genBtn).toBeDisabled();

    // Add resume via paste text (text mode is default)
    const resumeTextarea = screen.getByPlaceholderText(/Paste your resume text here.../i);
    const saveResumeBtn = screen.getByRole('button', { name: /Save Resume Text/i });
    await userEvent.type(resumeTextarea, 'My resume content');
    await userEvent.click(saveResumeBtn);

    // now button should enable
    await waitFor(() => expect(genBtn).toBeEnabled());

    // click it and check action message appears
    await userEvent.click(genBtn);
    expect(screen.getByText(/Ready to generate application materials/i)).toBeInTheDocument();
  });
});
