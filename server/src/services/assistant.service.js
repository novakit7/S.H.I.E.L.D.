import { openai, openaiConfig } from "../config/openai.config.js";
import { getCampusKnowledge } from "../data/campusKnowledge.js";
import { assistantInstructions } from "../prompts/assistant.prompt.js";
import { ApiError } from "../utils/apiError.js";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 10;
const MAX_CONTEXT_LENGTH = 12_000;

const normalizeMessage = (message, fieldName) => {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(400, `${fieldName} is required.`, "VALIDATION_ERROR");
  }
  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    throw new ApiError(
      400,
      `${fieldName} must be at most ${MAX_MESSAGE_LENGTH} characters.`,
      "VALIDATION_ERROR",
    );
  }
  return message.trim();
};

const buildHistory = (history) => {
  if (history === undefined) return [];
  if (!Array.isArray(history)) {
    throw new ApiError(
      400,
      "conversationHistory must be an array.",
      "VALIDATION_ERROR",
    );
  }
  if (history.length > MAX_HISTORY_MESSAGES) {
    throw new ApiError(
      400,
      `conversationHistory must contain at most ${MAX_HISTORY_MESSAGES} messages.`,
      "VALIDATION_ERROR",
    );
  }
  const normalized = history.map((entry) => {
    if (!entry || !["user", "assistant"].includes(entry.role)) {
      throw new ApiError(
        400,
        "conversationHistory contains an invalid role.",
        "VALIDATION_ERROR",
      );
    }
    return {
      role: entry.role,
      content: normalizeMessage(entry.content, "conversationHistory content"),
    };
  });
  if (JSON.stringify(normalized).length > MAX_CONTEXT_LENGTH) {
    throw new ApiError(
      400,
      "conversationHistory is too large.",
      "VALIDATION_ERROR",
    );
  }
  return normalized;
};

const logProviderError = (error) => {
  console.error("OpenRouter assistant request failed:", {
    name: error?.name,
    status: error?.status,
    code: error?.code,
    type: error?.type || error?.error?.type,
    requestId: error?.request_id || error?.requestId,
  });
};

const providerError = (error) => {
  logProviderError(error);
  if (
    error?.name === "APIConnectionTimeoutError" ||
    error?.code === "ETIMEDOUT" ||
    error?.code === "ECONNABORTED"
  ) {
    return new ApiError(
      504,
      "The campus assistant timed out. Please try again.",
      "ASSISTANT_TIMEOUT",
    );
  }
  if (error?.status === 401) {
    return new ApiError(
      502,
      "The campus assistant authentication failed. Configure a valid OpenRouter API key.",
      "ASSISTANT_AUTHENTICATION_ERROR",
    );
  }
  if (error?.status === 403) {
    return new ApiError(
      502,
      "The configured OpenRouter API key lacks permission for the assistant.",
      "ASSISTANT_PERMISSION_ERROR",
    );
  }
  if (error?.status === 404) {
    return new ApiError(
      502,
      "The configured OpenRouter model is unavailable.",
      "ASSISTANT_MODEL_UNAVAILABLE",
    );
  }
  if (error?.status === 400) {
    return new ApiError(
      502,
      "The campus assistant request was rejected by OpenRouter.",
      "ASSISTANT_PROVIDER_REQUEST_ERROR",
    );
  }
  if (error?.status === 429) {
    return new ApiError(
      429,
      "The campus assistant is busy. Please try again shortly.",
      "ASSISTANT_RATE_LIMITED",
    );
  }
  if (error?.status >= 500) {
    return new ApiError(
      502,
      "OpenRouter is temporarily unavailable. Please try again.",
      "ASSISTANT_PROVIDER_UNAVAILABLE",
    );
  }
  if (
    error?.code === "ENOTFOUND" ||
    error?.code === "ECONNRESET" ||
    error?.code === "ECONNREFUSED"
  ) {
    return new ApiError(
      502,
      "The campus assistant could not reach OpenRouter.",
      "ASSISTANT_NETWORK_ERROR",
    );
  }
  return new ApiError(
    502,
    "The campus assistant is temporarily unavailable.",
    "ASSISTANT_UNAVAILABLE",
  );
};

export const generateAssistantResponse = async ({
  message,
  conversationHistory,
}) => {
  const currentMessage = normalizeMessage(message, "message");
  const history = buildHistory(conversationHistory);
  const input = [...history, { role: "user", content: currentMessage }];
  const instructions = `${assistantInstructions}

Verified campus information (placeholders must not be presented as verified facts):
${getCampusKnowledge()}`;

  let response;
  try {
    response = await openai.responses.create({
      model: openaiConfig.model,
      instructions,
      input,
      max_output_tokens: openaiConfig.maxOutputTokens,
    });
  } catch (error) {
    throw providerError(error);
  }

  const reply = response.output_text?.trim();
  if (!reply) {
    throw new ApiError(
      502,
      "The campus assistant returned an empty response.",
      "ASSISTANT_INVALID_RESPONSE",
    );
  }
  return reply;
};
