require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Function to fetch and extract job description from URL
async function fetchJobDescription(url) {
  try {
    // For LinkedIn and other JS-heavy sites, use Jina AI Reader
    if (url.includes('linkedin.com') || url.includes('indeed.com') || url.includes('glassdoor.com')) {
      console.log('Detected JS-heavy site, using Jina AI Reader...');
      const jinaUrl = 'https://r.jina.ai/' + url;
      const jinaResponse = await fetch(jinaUrl, {
        headers: {
          'Accept': 'application/json',
          'X-Return-Format': 'text'
        }
      });
      
      if (jinaResponse.ok) {
        const text = await jinaResponse.text();
        if (text && text.length > 200) {
          console.log('Successfully fetched via Jina AI Reader');
          return text.substring(0, 10000); // Limit length
        }
      }
      console.log('Jina AI Reader failed, falling back to direct fetch...');
    }
    
    // Standard HTML fetch for other sites
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch URL: ' + response.status);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script and style tags
    $('script, style, nav, header, footer').remove();
    
    // Try to find job description in common containers
    let description = '';
    
    // Common job posting selectors
    const selectors = [
      '[class*="description"]',
      '[class*="job-description"]',
      '[id*="description"]',
      '[class*="posting"]',
      '[class*="content"]',
      'article',
      'main'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim().length > 100) {
        description = element.text().trim();
        break;
      }
    }
    
    // Fallback to body text if no specific container found
    if (!description || description.length < 100) {
      description = $('body').text().trim();
    }
    
    // Clean up the text
    description = description
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n')  // Limit consecutive newlines
      .substring(0, 10000);  // Limit length
    
    return description;
  } catch (error) {
    console.error('Error fetching job description:', error);
    return null;
  }
}

app.post('/api/generate', async (req, res) => {
  const { jobListings, resume, additionalInfo } = req.body;

  if (!jobListings || jobListings.length === 0) {
    return res.status(400).json({ error: 'At least one job listing is required' });
  }
  if (!resume) {
    return res.status(400).json({ error: 'Resume is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const job = jobListings[0];
    
    // If job has a URL, try to fetch the actual job description
    let jobDescription = job.description || '';
    const hasDescription = jobDescription && jobDescription.trim().length > 0;
    
    if (job.url && !hasDescription) {
      console.log('Fetching job description from URL:', job.url);
      const fetchedDescription = await fetchJobDescription(job.url);
      if (fetchedDescription) {
        jobDescription = fetchedDescription;
        console.log('Successfully fetched job description (' + fetchedDescription.length + ' chars)');
      } else {
        console.warn('Could not fetch job description from URL');
      }
    } else if (hasDescription) {
      console.log('Using provided job description (' + jobDescription.length + ' chars)');
    }
    
    const jobContext = job.url 
      ? 'Job URL: ' + job.url + '\n\nJob Description:\n' + (jobDescription || '(No description provided)')
      : 'Job Description:\n' + (jobDescription || '(No description provided)');
    
    const resumeContext = resume.type === 'text' 
      ? 'Resume:\n' + resume.content
      : 'Resume uploaded as file: ' + resume.fileName;
    
    const additionalContext = additionalInfo && additionalInfo.content 
      ? '\n\nAdditional Work Experience & Skills:\n' + additionalInfo.content
      : '';

    const prompt = 'You are a professional career advisor. Based on the following job posting and candidate information, generate:\n1. A tailored resume that highlights the most relevant experience and skills for this specific role\n2. A compelling cover letter that demonstrates why the candidate is a great fit\n\n' + jobContext + '\n\n' + resumeContext + additionalContext + '\n\nPlease respond with a JSON object containing two fields:\n- "tailoredResume": The complete tailored resume in markdown format\n- "coverLetter": The complete cover letter in markdown format\n\nMake the content professional, concise, and specifically tailored to match the job requirements.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional career advisor who creates tailored resumes and cover letters. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 3000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({ 
        error: 'OpenAI API request failed',
        details: errorData.error ? errorData.error.message : 'Unknown error'
      });
    }

    const data = await response.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

    if (!content) {
      return res.status(500).json({ error: 'No content returned from OpenAI' });
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        rawContent: content
      });
    }

    res.json({
      tailoredResume: result.tailoredResume || '',
      coverLetter: result.coverLetter || '',
      usage: data.usage
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate application materials',
      message: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('OpenAI API key configured: ' + !!process.env.OPENAI_API_KEY);
});
