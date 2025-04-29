import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl, isGitHubPages } from "./githubPagesUtils";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Transform URL for GitHub Pages if needed
  const transformedUrl = getApiUrl(url);
  
  const res = await fetch(transformedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    // Don't include credentials for GitHub Pages static hosting
    credentials: isGitHubPages() ? "same-origin" : "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Transform URL for GitHub Pages if needed
    const url = getApiUrl(queryKey[0] as string);
    
    const res = await fetch(url, {
      // Don't include credentials for GitHub Pages static hosting
      credentials: isGitHubPages() ? "same-origin" : "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
