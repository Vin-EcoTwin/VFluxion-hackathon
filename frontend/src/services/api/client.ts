import type { ApiError } from "@/types/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    let detail = "Unknown error";
    try {
      const error = (await response.json()) as ApiError;
      detail = typeof error.detail === "string" ? error.detail : JSON.stringify(error.detail);
    } catch {
      detail = response.statusText;
    }

    throw new Error(`API ${response.status}: ${detail}`);
  }

  return (await response.json()) as T;
}
