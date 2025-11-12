import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdditionalInfoArea from '../AdditionalInfoArea';

describe('AdditionalInfoArea', () => {
  test('renders description and allows editing', async () => {
    const currentInfo = { content: 'Saved content', lastUpdated: 'now' };
    const onSubmit = jest.fn();
    render(<AdditionalInfoArea onSubmit={onSubmit} currentInfo={currentInfo} />);

    // initial display mode
    expect(screen.getByText(/Saved content/)).toBeInTheDocument();
    const editBtn = screen.getByRole('button', { name: /✏️ Edit/i });
    await userEvent.click(editBtn);

    // now textarea appears pre-filled
    const textarea = screen.getByLabelText(/Work Experience & Skills:/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('Saved content');

    // modify and save
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'Updated content');
    const saveBtn = screen.getByRole('button', { name: /Save Information/i });
    await userEvent.click(saveBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toHaveProperty('content', 'Updated content');
  });

  test('shows validation error on empty submit', async () => {
    const onSubmit = jest.fn();
    render(<AdditionalInfoArea onSubmit={onSubmit} currentInfo={null} />);

  const textarea = screen.getByPlaceholderText(/e.g., Leadership in cross-functional teams/i);
  expect(textarea).toBeInTheDocument();
    const saveBtn = screen.getByRole('button', { name: /Save Information/i });
    // submit while empty
    await userEvent.click(saveBtn);

    expect(screen.getByText(/Please enter your additional work experience and skills/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('cancel discards edits and returns to view mode if content existed', async () => {
    const currentInfo = { content: 'Old content' };
    render(<AdditionalInfoArea onSubmit={jest.fn()} currentInfo={currentInfo} />);

    await userEvent.click(screen.getByRole('button', { name: /✏️ Edit/i }));
    const textarea = screen.getByLabelText(/Work Experience & Skills:/i);
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'New content');

    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    // should return to view mode displaying old content
    expect(screen.getByText(/Old content/)).toBeInTheDocument();
  });
});
