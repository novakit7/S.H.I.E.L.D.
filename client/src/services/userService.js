import { api } from "./api";
import { throwApiError } from "./apiError";

const unwrap = (response) => response.data.data;

export async function getProfile() {
  try {
    return unwrap(await api.get("/users/me"));
  } catch (error) {
    throwApiError(error);
  }
}

export async function updateProfile(fields) {
  try {
    return unwrap(await api.patch("/users/me", fields));
  } catch (error) {
    throwApiError(error);
  }
}

export async function getDashboard() {
  try {
    return unwrap(await api.get("/dashboard"));
  } catch (error) {
    throwApiError(error);
  }
}
