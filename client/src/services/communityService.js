import { api } from "./api";
import { throwApiError } from "./apiError";

const unwrap = (response) => response.data.data;

export async function getPosts(params = {}) {
  try {
    return unwrap(await api.get("/community/posts", { params }));
  } catch (error) {
    throwApiError(error);
  }
}

export async function createPost(payload) {
  try {
    return unwrap(await api.post("/community/posts", payload));
  } catch (error) {
    throwApiError(error);
  }
}

export async function toggleLike(id) {
  try {
    return unwrap(await api.post(`/community/posts/${id}/likes`));
  } catch (error) {
    throwApiError(error);
  }
}

export async function reportPost(id, reason) {
  try {
    return unwrap(await api.post(`/community/posts/${id}/reports`, { reason }));
  } catch (error) {
    throwApiError(error);
  }
}
