import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
let supabase;
if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  );
} else {
  console.warn('WARNING: Supabase environment variables are missing. Authentication and specific proxy features will be disabled.');
}

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to verify Supabase JWT using the official client
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({ error: 'Internal server error: Auth service unavailable' });
    }
    // Let Supabase verify the token (handles ES256/HS256 automatically)
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn('Invalid token attempt:', error?.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth check error:', error.message);
    return res.status(500).json({ error: 'Internal server error during auth' });
  }
};

// Judge0 API Proxy - Secured with verifyToken
app.post('/api/execute', verifyToken, async (req, res) => {
  try {
    const { language_id, source_code, stdin, compiler_options } = req.body;
    
    const judge0Url = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com/submissions';
    const judge0Key = process.env.JUDGE0_API_KEY;
    const judge0Host = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

    if (!judge0Key) {
      console.warn('Judge0 API Key is missing!');
      return res.status(500).json({ error: 'Judge0 API Key not configured' });
    }

    const options = {
      method: 'POST',
      url: judge0Url,
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': judge0Key,
        'X-RapidAPI-Host': judge0Host
      },
      data: {
        language_id,
        source_code: Buffer.from(source_code).toString('base64'),
        stdin: stdin ? Buffer.from(stdin).toString('base64') : undefined,
        compiler_options: compiler_options || undefined
      }
    };

    console.log(`Submitting code to Judge0... Language: ${language_id} (User: ${req.user.email})`);
    const response = await axios.request(options);
    const token = response.data.token;

    // Poll for result
    let result = null;
    let attempts = 0;
    while (attempts < 10) {
      const resultOptions = {
        method: 'GET',
        url: `${judge0Url}/${token}`,
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
          'X-RapidAPI-Key': judge0Key,
          'X-RapidAPI-Host': judge0Host
        }
      };

      const resultResponse = await axios.request(resultOptions);
      if (resultResponse.data.status.id > 2) { // Not In Queue or Processing
        result = resultResponse.data;
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!result) {
      return res.status(504).json({ error: 'Execution timed out' });
    }

    // Decode Base64 fields
    if (result.stdout) {
      result.stdout = Buffer.from(result.stdout, 'base64').toString('utf-8');
    }
    if (result.stderr) {
      result.stderr = Buffer.from(result.stderr, 'base64').toString('utf-8');
    }
    if (result.compile_output) {
      result.compile_output = Buffer.from(result.compile_output, 'base64').toString('utf-8');
    }
    if (result.message) {
      result.message = Buffer.from(result.message, 'base64').toString('utf-8');
    }

    res.json(result);

  } catch (error) {
    console.error('Error executing code:', error.message);
    if (error.response) {
        console.error('Judge0 Response:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to execute code', details: error.message });
  }
});

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

