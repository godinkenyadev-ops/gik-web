const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

type FetchOptions = RequestInit & {
  next?: { revalidate?: number };
  cache?: RequestCache;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return {} as T;
}

export async function getJson<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    method: "GET",
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  return handleResponse<T>(response);
}

export async function postJson<TResponse, TBody extends Record<string, unknown>>(
  endpoint: string,
  body: TBody,
  options: FetchOptions = {}
): Promise<TResponse> {
  const response = await fetch(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  return handleResponse<TResponse>(response);
}
