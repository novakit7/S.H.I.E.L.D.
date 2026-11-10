import { api } from "./api";
import { throwApiError } from "./apiError";

const unwrap = (response) => response.data.data;

export async function getAnnouncements(params = {}) {
  try {
    return unwrap(await api.get("/announcements", { params }));
  } catch (error) {
    throwApiError(error);
  }
}
