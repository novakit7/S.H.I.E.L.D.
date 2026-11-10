export function getApiError(error) {
  if (error.response) {
    const payload = error.response.data;
    return {
      status: error.response.status,
      code: payload?.error?.code,
      message: payload?.message || "The request could not be completed.",
      details: payload?.error?.details,
    };
  }
  if (error.request) {
    return {
      status: 0,
      code: "NETWORK_ERROR",
      message: "The server could not be reached. Check the API connection.",
    };
  }
  return {
    status: 0,
    code: "CLIENT_ERROR",
    message: error.message || "The request could not be completed.",
  };
}

export function throwApiError(error) {
  const normalized = getApiError(error);
  const nextError = new Error(normalized.message);
  Object.assign(nextError, normalized);
  throw nextError;
}
