/**
 * Environment configuration utility for Algolib.io
 * Handles switching between Local, QA, and Production environments.
 */

type Environment = 'development' | 'qa' | 'production';

interface EnvConfig {
  apiUrl: string;
  isProd: boolean;
  isQA: boolean;
  isDev: boolean;
  environment: Environment;
}

// Logic to determine current environment
const getEnvironment = (): Environment => {
  const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development';
  if (env === 'production') return 'production';
  if (env === 'qa') return 'qa';
  return 'development';
};

const ENV = getEnvironment();

const configs: Record<Environment, Partial<EnvConfig>> = {
  development: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  qa: {
    apiUrl: 'https://qa-api.algolib.io', // TODO: Update with actual QA URL
  },
  production: {
    apiUrl: 'https://api.algolib.io', // TODO: Update with actual Prod URL
  },
};

const currentConfig = configs[ENV];

export const env: EnvConfig = {
  apiUrl: currentConfig.apiUrl || 'http://localhost:3000',
  isProd: ENV === 'production',
  isQA: ENV === 'qa',
  isDev: ENV === 'development',
  environment: ENV,
};

export default env;
