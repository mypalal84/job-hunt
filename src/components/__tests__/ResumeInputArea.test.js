import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeInputArea from '../ResumeInputArea';

function mockFile(name, size, type = 'application/pdf') {
  return new File(['dummy content'], name, { type, lastModified: Date.now() });
}

describe('ResumeInputArea', () => {
  let OriginalFileReader;
  beforeEach(() => {
    // Save original and mock global FileReader
    OriginalFileReader = global.FileReader;
    class MockReader {
      constructor() {
        this.onload = null;
        this.result = null;
      }
      readAsArrayBuffer() {
        const buf = new ArrayBuffer(8);
        this.result = buf;
        setTimeout(() => {
          if (typeof this.onload === 'function') {
            this.onload({ target: { result: this.result } });
          }
        }, 0);
      }
    }
    global.FileReader = MockReader;
  });

  afterEach(() => {
    // restore original FileReader to avoid affecting other tests
    global.FileReader = OriginalFileReader;
  });

  test('text mode: shows error when empty and submits valid text', async () => {
    const onSubmit = jest.fn();
    render(<ResumeInputArea onSubmit={onSubmit} currentResume={null} />);

    const saveBtn = screen.getByRole('button', { name: /Save Resume Text/i });
    await userEvent.click(saveBtn);
    expect(screen.getByText(/Please enter your resume text/i)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Paste your resume text here.../i);
    await userEvent.type(textarea, 'Resume content...');
    await userEvent.click(saveBtn);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ type: 'text', content: 'Resume content...' });
    expect(textarea).toHaveValue('');
  });

  test('upload mode: accepts valid pdf and calls onSubmit', async () => {
    const onSubmit = jest.fn();
    render(<ResumeInputArea onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /Upload File/i }));
      const file = mockFile('resume.pdf', 1024, 'application/pdf');

      const fileInput = screen.getByTestId('resume-file-input');
      await userEvent.upload(fileInput, file);

  // wait for the file name to appear (FileReader onload should populate file info)
  await screen.findByText(/resume.pdf/i);

  const saveBtn = screen.getByRole('button', { name: /Save Resume File/i });
  await userEvent.click(saveBtn);

  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const callArg = onSubmit.mock.calls[0][0];
    expect(callArg).toHaveProperty('type', 'file');
    expect(callArg).toHaveProperty('fileName', 'resume.pdf');
    expect(callArg).toHaveProperty('fileType', 'application/pdf');
  });

  test('upload mode: rejects invalid type', async () => {
    const onSubmit = jest.fn();
    render(<ResumeInputArea onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /Upload File/i }));
    const file = mockFile('image.png', 1024, 'image/png');

  const fileInput = screen.getByTestId('resume-file-input');
  await userEvent.upload(fileInput, file);

    expect(await screen.findByText(/Please upload a PDF or DOCX file/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('upload mode: rejects too large file (>5MB)', async () => {
    const onSubmit = jest.fn();
    render(<ResumeInputArea onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /Upload File/i }));
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.pdf', { type: 'application/pdf' });
    Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 });

  const fileInput = screen.getByTestId('resume-file-input');
  await userEvent.upload(fileInput, bigFile);

    expect(await screen.findByText(/File size must be less than 5MB/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('shows current resume indicator when provided', () => {
    const currentResume = { type: 'file', fileName: 'resume.pdf' };
    render(<ResumeInputArea onSubmit={jest.fn()} currentResume={currentResume} />);
    expect(screen.getByText(/File: resume.pdf/i)).toBeInTheDocument();
  });
});
