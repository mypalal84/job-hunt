import { useState } from 'react';
import './App.css';
import JobInputArea from './components/JobInputArea';
import ResumeInputArea from './components/ResumeInputArea';
import AdditionalInfoArea from './components/AdditionalInfoArea';
import GeneratedContent from './components/GeneratedContent';

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
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setActionMessage('');
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobListings,
          resume,
          additionalInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
      setActionMessage('Application materials generated successfully!');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Generation error:', error);
      setActionMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
            disabled={!canGenerate || loading}
            onClick={handleGenerate}
          >
            {loading ? 'Generating...' : 'Generate Application'}
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
      {generatedContent && (
        <GeneratedContent
          content={generatedContent}
          onClose={() => setGeneratedContent(null)}
        />
      )}
    </div>
  );
}

export default App;
