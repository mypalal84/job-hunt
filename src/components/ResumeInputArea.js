import { useState } from 'react';
import './ResumeInputArea.css';

function ResumeInputArea({ onSubmit, currentResume }) {
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'upload'
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setError('');
    setSuccess('');

    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    // Read file as base64 for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData({
        name: file.name,
        type: file.type,
        size: file.size,
        data: event.target.result
      });
      setFileName(file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resumeText.trim()) {
      setError('Please enter your resume text');
      return;
    }

    onSubmit({
      type: 'text',
      content: resumeText
    });

    setResumeText('');
    setSuccess('Resume text saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fileData) {
      setError('Please select a file first');
      return;
    }

    onSubmit({
      type: 'file',
      fileName: fileData.name,
      fileType: fileData.type,
      fileSize: fileData.size,
      data: fileData.data
    });

    setFileData(null);
    setFileName('');
    setSuccess(`Resume "${fileData.name}" saved successfully!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="resume-input-area">
      <div className="resume-header">
        <h2>Resume</h2>
        {currentResume && (
          <div className="current-resume-indicator">
            <span className="indicator-dot"></span>
            <span className="indicator-text">
              {currentResume.type === 'text' 
                ? 'Resume text saved' 
                : `File: ${currentResume.fileName}`}
            </span>
          </div>
        )}
      </div>

      <div className="input-mode-selector">
        <button
          type="button"
          className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('text');
            setError('');
            setSuccess('');
          }}
        >
          Paste Text
        </button>
        <button
          type="button"
          className={`mode-btn ${inputMode === 'upload' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('upload');
            setError('');
            setSuccess('');
          }}
        >
          Upload File
        </button>
      </div>

      {inputMode === 'text' ? (
        <form onSubmit={handleTextSubmit} className="input-form">
          <div className="input-group">
            <label htmlFor="resume-text">Paste Your Resume:</label>
            <textarea
              id="resume-text"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="input-field textarea"
              rows="12"
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="submit-btn">
            Save Resume Text
          </button>
        </form>
      ) : (
        <form onSubmit={handleFileSubmit} className="input-form">
          <div className="input-group">
            <label htmlFor="resume-file">Upload Resume (PDF or DOCX):</label>
            <div className="file-upload-wrapper">
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="file-input"
              />
              <div className="file-upload-label">
                {fileName ? (
                  <div className="file-info">
                    <span className="file-icon">📄</span>
                    <div className="file-details">
                      <p className="file-name">{fileName}</p>
                      <p className="file-size">
                        {(fileData.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="upload-icon">📁</span>
                    <p className="upload-text">
                      Click to select or drag and drop your resume
                    </p>
                    <p className="upload-hint">PDF or DOCX • Max 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button
            type="submit"
            className="submit-btn"
            disabled={!fileData}
          >
            Save Resume File
          </button>
        </form>
      )}
    </div>
  );
}

export default ResumeInputArea;
