import { api } from "./api";
import { throwApiError } from "./apiError";

const unwrap = (response) => response.data.data;

export async function getItems(params = {}) {
  try {
    return unwrap(await api.get("/lost-found", { params }));
  } catch (error) {
    throwApiError(error);
  }
}

export async function createItem(payload) {
  try {
    return unwrap(await api.post("/lost-found", payload));
  } catch (error) {
    throwApiError(error);
  }
}
