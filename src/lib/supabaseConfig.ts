import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Project ID for edge function URL
const PROJECT_ID = 'mitejukmgshjyusgnpps';
const EDGE_FUNCTION_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/get-config`;

// Cache the config once fetched
let cachedConfig: { supabaseUrl: string; supabaseAnonKey: string } | null = null;
let dynamicClient: SupabaseClient<Database> | null = null;
let configPromise: Promise<{ supabaseUrl: string; supabaseAnonKey: string }> | null = null;

/**
 * Fetches Supabase config from edge function
 */
async function fetchConfig(): Promise<{ supabaseUrl: string; supabaseAnonKey: string }> {
  if (cachedConfig) return cachedConfig;
  
  if (configPromise) return configPromise;
  
  configPromise = (async () => {
    try {
      console.log('Fetching Supabase config from edge function...');
      const response = await fetch(EDGE_FUNCTION_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status}`);
      }
      
      const config = await response.json();
      
      if (!config.supabaseUrl || !config.supabaseAnonKey) {
        throw new Error('Invalid config received from edge function');
      }
      
      cachedConfig = {
        supabaseUrl: config.supabaseUrl,
        supabaseAnonKey: config.supabaseAnonKey,
      };
      
      console.log('Supabase config fetched successfully');
      return cachedConfig;
    } catch (error) {
      console.error('Error fetching Supabase config:', error);
      throw error;
    }
  })();
  
  return configPromise;
}

/**
 * Gets the dynamic Supabase client (creates it if needed)
 */
export async function getDynamicSupabaseClient(): Promise<SupabaseClient<Database>> {
  if (dynamicClient) return dynamicClient;
  
  const config = await fetchConfig();
  
  dynamicClient = createClient<Database>(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  
  return dynamicClient;
}

/**
 * Gets the cached config (only available after fetchConfig is called)
 */
export function getCachedConfig() {
  return cachedConfig;
}

/**
 * Check if config is available
 */
export function isConfigAvailable() {
  return cachedConfig !== null;
}
