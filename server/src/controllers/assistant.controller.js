import { randomUUID } from 'node:crypto';
import { generateAssistantResponse } from '../services/assistant.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const chatWithAssistant = async (req, res) => {
  const reply = await generateAssistantResponse({
    message: req.body.message,
    conversationHistory: req.body.conversationHistory,
  });
  return sendSuccess(res, 200, 'Assistant response generated successfully.', {
    reply,
    conversationId: randomUUID(),
  });
};
