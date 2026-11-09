import { api } from "./api";

const useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

export async function chatWithAssistant({ message, conversationHistory }) {
  if (useMockApi) {
    return {
      reply:
        "Mock assistant mode is enabled. Configure VITE_USE_MOCK_API=false to use the S.H.I.E.L.D. backend.",
      conversationId: `mock-${Date.now()}`,
    };
  }

  try {
    const response = await api.post(
      "/assistant/chat",
      { message, conversationHistory },
      { withCredentials: true },
    );
    return response.data.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "The campus assistant is temporarily unavailable.";
    throw new Error(message);
  }
}
