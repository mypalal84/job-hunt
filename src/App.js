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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Hunt</h1>
        <div className="input-areas">
          <JobInputArea onSubmit={handleJobSubmit} />
          <ResumeInputArea onSubmit={handleResumeSubmit} currentResume={resume} />
          <AdditionalInfoArea onSubmit={handleAdditionalInfoSubmit} currentInfo={additionalInfo} />
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
      </main>
    </div>
  );
}

export default App;
