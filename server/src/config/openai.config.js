import OpenAI from 'openai';
import { env } from './env.js';

const apiKey = (process.env.OPEN_ROUTER_API_KEY || process.env.OPENAI_API_KEY)?.trim();

if (!apiKey || ['your_openai_api_key', 'your_open_router_api_key'].includes(apiKey)) {
  throw new Error('OPEN_ROUTER_API_KEY is required to use the campus assistant.');
}

export const openai = new OpenAI({
  apiKey,
  baseURL: env.openRouterBaseUrl,
  timeout: env.openRouterTimeout,
  maxRetries: 0,
});

export const openaiConfig = {
  model: env.openRouterModel,
  maxOutputTokens: env.openRouterMaxOutputTokens,
};
