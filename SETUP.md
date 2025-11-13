# Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure OpenAI API Key

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env` file in the project root (it's already created with a template)
3. Replace `your_openai_api_key_here` with your actual API key:

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**Important**: Never commit your `.env` file to git. It's already in `.gitignore`.

## 3. Run the Application

### Option A: Run both frontend and backend together (recommended)
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:3001
- Frontend React app on http://localhost:3000

### Option B: Run separately
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend
npm start
```

## 4. Use the Application

1. **Add a job listing** - Paste a URL or job description
2. **Add your resume** - Paste text or upload PDF/DOCX
3. **(Optional)** Add additional work experience/skills
4. Click **"Generate Application"** to create:
   - Tailored resume
   - Custom cover letter

## API Costs

Using `gpt-4o-mini` model:
- Approximately $0.01-0.05 per generation
- Monitor usage at https://platform.openai.com/usage

## Troubleshooting

### "OpenAI API key not configured" error
- Make sure `.env` file exists in project root
- Check that `OPENAI_API_KEY` is set correctly
- Restart the backend server after changing `.env`

### Port already in use
- Backend uses port 3001, frontend uses 3000
- Kill existing processes: `lsof -ti:3001 | xargs kill -9`

### CORS errors
- Make sure both servers are running
- Check that `proxy` is set in `package.json`
