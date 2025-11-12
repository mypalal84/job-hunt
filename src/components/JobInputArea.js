import { useState } from 'react';
import './JobInputArea.css';

function JobInputArea({ onSubmit }) {
  const [inputMode, setInputMode] = useState('url'); // 'url' or 'description'
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (inputMode === 'url') {
      if (!url.trim()) {
        setError('Please enter a URL');
        return;
      }
      try {
        new URL(url);
      } catch (err) {
        setError('Please enter a valid URL');
        return;
      }
      onSubmit({ url, description: '' });
      setUrl('');
    } else {
      if (!description.trim()) {
        setError('Please enter a job description');
        return;
      }
      onSubmit({ url: '', description });
      setDescription('');
    }
  };

  return (
    <div className="job-input-area">
      <h2>Add Job Listing</h2>
      <div className="input-mode-selector">
        <button
          type="button"
          data-testid="mode-add-url"
          className={`mode-btn ${inputMode === 'url' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('url');
            setError('');
          }}
        >
          Add URL
        </button>
        <button
          type="button"
          data-testid="mode-paste-description"
          className={`mode-btn ${inputMode === 'description' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('description');
            setError('');
          }}
        >
          Paste Description
        </button>
      </div>

      <form onSubmit={handleSubmit} className="input-form" data-testid="job-form">
        {inputMode === 'url' ? (
          <div className="input-group">
            <label htmlFor="job-url">Job Posting URL:</label>
            <input
              id="job-url"
              type="text"
              placeholder="https://example.com/job-posting"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field"
            />
          </div>
        ) : (
          <div className="input-group">
            <label htmlFor="job-description">Job Description:</label>
            <textarea
              id="job-description"
              placeholder="Paste the job description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field textarea"
              rows="8"
            />
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-btn">
          {inputMode === 'url' ? 'Add URL' : 'Save Description'}
        </button>
      </form>
    </div>
  );
}

export default JobInputArea;
