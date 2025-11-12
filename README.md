# Job Hunt — Resume & Cover Letter Tailoring

Job Hunt is a small React app that helps job seekers tailor their resume and cover letter to a specific job posting. Users can paste or upload their resume, add extra skills/work experience they'd like to highlight, and paste a job description or URL. The app's goal is to generate a tailored resume and cover letter that better matches the target job.

This repository includes the UI inputs and validation logic, unit tests for components, and a GitHub Actions CI workflow that runs the test suite.

## Features

- Paste or upload your resume (PDF / DOCX supported)
- Paste additional work experience / skills you want to emphasize
- Paste a job description or provide a job posting URL
- Validation and friendly error messages for inputs and uploads
- Unit tests for components and an example CI workflow (`.github/workflows/ci.yml`)

## Quick Start

Requirements: Node.js 18+ and npm

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm start
```

Open http://localhost:3000 in your browser.

3. Run tests

```bash
npm test
```

CI: The repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs `npm test` on push and pull requests.

## Files of interest

- `src/components/JobInputArea.js` — input URL or paste a job description
- `src/components/ResumeInputArea.js` — paste resume text or upload PDF/DOCX
- `src/components/AdditionalInfoArea.js` — enter additional experience/skills
- `src/test-utils.js` — shared test helpers (mock FileReader, create test files)
- `src/components/__tests__/` — component unit tests
- `.github/workflows/ci.yml` — CI workflow to run tests

## How it works (current scope)

Currently the app collects inputs and stores them in local React state. The next steps are to implement the text-processing / generation engine that will produce a tailored resume and a cover letter from the provided resume, additional info, and job description. That engine might be:

- A server-side microservice that performs parsing, matching, and generation
- Or a client-side module that calls a text-generation API (example: OpenAI) — if you add one, keep secrets out of the repo and use server-side proxying or GitHub Secrets for CI

## Testing

Tests use Jest + React Testing Library. Shared helpers are in `src/test-utils.js` to assist with mocking file uploads and FileReader behaviour.

Run tests locally:

```bash
npm test
```

To run a single test file:

```bash
npm test -- src/components/__tests__/ResumeInputArea.test.js
```

## Development notes & next steps

- Implement resume/cover-letter tailoring logic (server or client) and wire it to the UI
- Add persistent storage (localStorage or backend DB) for saved resumes and job applications
- Improve accessibility and add automated accessibility tests (`jest-axe`)
- Add integration tests for the tailoring pipeline once implemented

## Contributing

Contributions are welcome. Create issues for new features or bug reports, and open pull requests against `main`.

## License

This project is unlicensed (add a LICENSE file to choose one).
