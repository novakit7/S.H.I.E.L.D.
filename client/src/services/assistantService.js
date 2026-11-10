import { api } from "./api";
import { throwApiError } from "./apiError";

export async function chatWithAssistant({ message, conversationHistory }) {
  try {
    const response = await api.post(
      "/assistant/chat",
      { message, conversationHistory },
      { withCredentials: true },
    );
    return response.data.data;
  } catch (error) {
    throwApiError(error);
  }
}
