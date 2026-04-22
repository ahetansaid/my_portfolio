export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  redirectOn401?: boolean;
};

async function request<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { body, redirectOn401 = true, headers, ...rest } = options;

  const isFormData = body instanceof FormData;

  const res = await fetch(url, {
    ...rest,
    headers: isFormData
      ? headers
      : { "Content-Type": "application/json", ...(headers ?? {}) },
    body: isFormData ? body : body != null ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && redirectOn401 && typeof window !== "undefined") {
    const current = window.location.pathname + window.location.search;
    window.location.href = `/admin/login?from=${encodeURIComponent(current)}`;
    throw new ApiError("Session expirée.", 401);
  }

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(url: string, opts?: ApiOptions) =>
    request<T>(url, { ...opts, method: "GET" }),
  post: <T>(url: string, body?: unknown, opts?: ApiOptions) =>
    request<T>(url, { ...opts, method: "POST", body }),
  put: <T>(url: string, body?: unknown, opts?: ApiOptions) =>
    request<T>(url, { ...opts, method: "PUT", body }),
  patch: <T>(url: string, body?: unknown, opts?: ApiOptions) =>
    request<T>(url, { ...opts, method: "PATCH", body }),
  delete: <T>(url: string, opts?: ApiOptions) =>
    request<T>(url, { ...opts, method: "DELETE" }),
};
