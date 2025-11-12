import { useState } from 'react';
import './AdditionalInfoArea.css';

function AdditionalInfoArea({ onSubmit, currentInfo }) {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isEditing, setIsEditing] = useState(!currentInfo);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!additionalInfo.trim()) {
      setError('Please enter your additional work experience and skills');
      return;
    }

    onSubmit({
      content: additionalInfo,
      lastUpdated: new Date().toLocaleString()
    });

    setIsEditing(false);
    setSuccess('Additional information saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEdit = () => {
    setAdditionalInfo(currentInfo?.content || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setAdditionalInfo('');
    setError('');
    setSuccess('');
    if (currentInfo) {
      setIsEditing(false);
    }
  };

  return (
    <div className="additional-info-area">
      <div className="info-header">
        <h2>Additional Work Experience & Skills</h2>
        {currentInfo && !isEditing && (
          <div className="current-info-indicator">
            <span className="indicator-dot"></span>
            <span className="indicator-text">Saved</span>
          </div>
        )}
      </div>

      <p className="info-description">
        Include any relevant work experience, certifications, languages, or other skills you'd like to highlight when tailoring resumes or cover letters.
      </p>

      {!isEditing && currentInfo ? (
        <div className="display-mode">
          <div className="info-display">
            {currentInfo.content}
          </div>
          <div className="edit-actions">
            <button onClick={handleEdit} className="edit-btn">
              ✏️ Edit
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-group">
            <label htmlFor="additional-info">
              Work Experience & Skills:
            </label>
            <textarea
              id="additional-info"
              placeholder="e.g., Leadership in cross-functional teams, Proficiency in Python and JavaScript, AWS certification, Fluent in Spanish and French, 5+ years in project management..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="input-field textarea"
              rows="10"
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Save Information
            </button>
            {currentInfo && (
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default AdditionalInfoArea;
