import './GeneratedContent.css';

function GeneratedContent({ content, onClose }) {
  if (!content) return null;

  const downloadAsText = (text, filename) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="generated-content">
      <div className="generated-header">
        <h2>Generated Application Materials</h2>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="generated-sections">
        <div className="generated-section">
          <div className="section-header">
            <h3>Tailored Resume</h3>
            <button
              className="download-btn"
              onClick={() => downloadAsText(content.tailoredResume, 'tailored-resume.md')}
            >
              Download
            </button>
          </div>
          <div className="section-content">
            <pre>{content.tailoredResume}</pre>
          </div>
        </div>

        <div className="generated-section">
          <div className="section-header">
            <h3>Cover Letter</h3>
            <button
              className="download-btn"
              onClick={() => downloadAsText(content.coverLetter, 'cover-letter.md')}
            >
              Download
            </button>
          </div>
          <div className="section-content">
            <pre>{content.coverLetter}</pre>
          </div>
        </div>
      </div>

      {content.usage && (
        <div className="usage-info">
          <small>
            Tokens used: {content.usage.prompt_tokens} prompt + {content.usage.completion_tokens} completion = {content.usage.total_tokens} total
          </small>
        </div>
      )}
    </div>
  );
}

export default GeneratedContent;
