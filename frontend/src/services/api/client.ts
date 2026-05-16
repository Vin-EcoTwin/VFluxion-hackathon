import type { ApiError } from "@/types/api";
import { API_BASE_URL } from "@/config/appConfig";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
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
