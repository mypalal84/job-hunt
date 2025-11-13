import { useState } from 'react';
import './App.css';
import JobInputArea from './components/JobInputArea';
import ResumeInputArea from './components/ResumeInputArea';
import AdditionalInfoArea from './components/AdditionalInfoArea';

function App() {
  const [jobListings, setJobListings] = useState([]);
  const [resume, setResume] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);

  const handleJobSubmit = (jobData) => {
    setJobListings([...jobListings, { id: Date.now(), ...jobData }]);
  };

  const handleResumeSubmit = (resumeData) => {
    setResume(resumeData);
  };

  const handleAdditionalInfoSubmit = (infoData) => {
    setAdditionalInfo(infoData);
  };

  // whether we have at least one job listing and a resume provided
  const canGenerate = jobListings.length > 0 && resume && ((resume.type === 'text' && resume.content && resume.content.trim() !== '') || resume.type === 'file');

  const [actionMessage, setActionMessage] = useState('');

  const handleGenerate = () => {
    // placeholder action — in future this could trigger resume tailoring or export
    setActionMessage('Ready to generate application materials for the saved job listing(s).');
    // keep console log for developer visibility
    // eslint-disable-next-line no-console
    console.log('Generate action triggered', { jobListings, resume, additionalInfo });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Hunt</h1>
        <div className="input-areas">
          <JobInputArea onSubmit={handleJobSubmit} />
          <ResumeInputArea onSubmit={handleResumeSubmit} currentResume={resume} />
          <AdditionalInfoArea onSubmit={handleAdditionalInfoSubmit} currentInfo={additionalInfo} />
        </div>
        <div className="actions">
          <button
            type="button"
            data-testid="generate-btn"
            className="generate-btn"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            Generate Application
          </button>
          {actionMessage && <p className="action-message">{actionMessage}</p>}
        </div>
      </header>
      <main className="App-main">
        {jobListings.length > 0 && (
          <div className="job-listings">
            <h2>Saved Job Listings</h2>
            <ul>
              {jobListings.map((job) => (
                <li key={job.id} className="job-item">
                  {job.url && (
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      {job.url}
                    </a>
                  )}
                  {job.description && (
                    <p className="job-description">{job.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {resume && (
          <div className="resume-section">
            <h2>Resume</h2>
            {resume.type === 'text' && (
              <div>
                <p className="resume-indicator">Resume Text Saved</p>
                <pre className="resume-content">{resume.content}</pre>
              </div>
            )}
            {resume.type === 'file' && (
              <div>
                <p className="resume-indicator">File: {resume.fileName}</p>
              </div>
            )}
          </div>
        )}
        {additionalInfo && (
          <div className="additional-info-section">
            <h2>Additional Work Experience & Skills</h2>
            <p className="additional-info-content">{additionalInfo.content}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
