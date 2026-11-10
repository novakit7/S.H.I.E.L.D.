import { api } from "./api";
import { throwApiError } from "./apiError";

const unwrap = (response) => response.data.data;

export async function login(email, password) {
  try {
    return unwrap(await api.post("/auth/login", { email, password }));
  } catch (error) {
    throwApiError(error);
  }
}

export async function register(details) {
  try {
    return unwrap(await api.post("/auth/register", details));
  } catch (error) {
    throwApiError(error);
  }
}

export async function verifyOtp(code, registrationToken) {
  try {
    return unwrap(
      await api.post("/auth/verify-otp", {
        code,
        ...(registrationToken ? { registrationToken } : {}),
      }),
    );
  } catch (error) {
    throwApiError(error);
  }
}

export async function resendOtp(registrationToken) {
  try {
    return unwrap(
      await api.post("/auth/resend-otp", {
        ...(registrationToken ? { registrationToken } : {}),
      }),
    );
  } catch (error) {
    throwApiError(error);
  }
}

export async function getCurrentUser() {
  try {
    return unwrap(await api.get("/auth/me"));
  } catch (error) {
    throwApiError(error);
  }
}

export async function logout() {
  try {
    return unwrap(await api.post("/auth/logout"));
  } catch (error) {
    throwApiError(error);
  }
}
