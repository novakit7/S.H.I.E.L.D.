import { api } from "./api";
import { throwApiError } from "./apiError";

const unwrap = (response) => response.data.data;

export async function getLocations(params = {}) {
  try {
    return unwrap(await api.get("/campus/locations", { params }));
  } catch (error) {
    throwApiError(error);
  }
}
