import { api } from "./api";
import { throwApiError } from "./apiError";

const unwrap = (response) => response.data.data;

export async function getSummary() {
  try {
    return unwrap(await api.get("/admin/summary"));
  } catch (error) {
    throwApiError(error);
  }
}

export async function getAnnouncements(params = {}) {
  try {
    return unwrap(await api.get("/admin/announcements", { params }));
  } catch (error) {
    throwApiError(error);
  }
}

export async function createAnnouncement(payload) {
  try {
    return unwrap(await api.post("/admin/announcements", payload));
  } catch (error) {
    throwApiError(error);
  }
}

export async function updateAnnouncement(id, payload) {
  try {
    return unwrap(await api.patch(`/admin/announcements/${id}`, payload));
  } catch (error) {
    throwApiError(error);
  }
}

export async function deleteAnnouncement(id) {
  try {
    return unwrap(await api.delete(`/admin/announcements/${id}`));
  } catch (error) {
    throwApiError(error);
  }
}

export async function getReports(params = {}) {
  try {
    return unwrap(await api.get("/admin/reports", { params }));
  } catch (error) {
    throwApiError(error);
  }
}

export async function reviewReport(id, status) {
  try {
    return unwrap(await api.patch(`/admin/reports/${id}`, { status }));
  } catch (error) {
    throwApiError(error);
  }
}

export async function getUsers(params = {}) {
  try {
    return unwrap(await api.get("/admin/users", { params }));
  } catch (error) {
    throwApiError(error);
  }
}

export async function updateUser(id, payload) {
  try {
    return unwrap(await api.patch(`/admin/users/${id}`, payload));
  } catch (error) {
    throwApiError(error);
  }
}
