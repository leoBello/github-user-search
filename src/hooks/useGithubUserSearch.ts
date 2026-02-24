import { useEffect, useState } from 'react';
import type {
  GithubUser,
  GithubUserSearchErrorType,
} from '../services/githubApi';
import { githubService } from '../services/githubService';
import { ERROR_MESSAGES } from '../constants/messages';

type State = {
  users: GithubUser[];
  totalCount: number;
  loading: boolean;
  errorType: GithubUserSearchErrorType;
  errorMessage: string | null;
  isEmpty: boolean;
  isRateLimited: boolean;
  rateLimitResetAt: Date | null;
};

const INITIAL_STATE: State = {
  users: [],
  totalCount: 0,
  loading: false,
  errorType: 'NONE',
  errorMessage: null,
  isEmpty: false,
  isRateLimited: false,
  rateLimitResetAt: null,
};

type Options = {
  minQueryLength?: number;
  debounceMs?: number;
};

export function useGithubUserSearch(
  query: string,
  { minQueryLength = 2, debounceMs = 400 }: Options = {},
) {
  const [state, setState] = useState<State>(INITIAL_STATE);

  useEffect(() => {
    // reset si query trop courte ou vide
    if (!query || query.trim().length < minQueryLength) {
      setState((prev) => ({
        ...INITIAL_STATE,
        isRateLimited: prev.isRateLimited,
        rateLimitResetAt: prev.rateLimitResetAt,
      }));
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    setState((prev) => ({
      ...prev,
      loading: true,
      errorType: 'NONE',
      errorMessage: null,
      isEmpty: false,
    }));

    const timeoutId = setTimeout(async () => {
      try {
        const result = await githubService.searchUsers(query, signal);

        // Si la requête a été annulée, on ne fait rien
        if (signal.aborted) {
          return;
        }

        if (!result.success && result.error) {
          const { error } = result;
          setState((prev) => ({
            ...prev,
            loading: false,
            errorType: error.type,
            errorMessage: error.message,
            isRateLimited: error.type === 'RATE_LIMIT',
            rateLimitResetAt: error.rateLimitResetAt ?? null,
          }));
          return;
        }

        if (result.success && result.data) {
          const data = result.data;
          setState((prev) => ({
            ...prev,
            loading: false,
            users: data.items ?? [],
            totalCount: data.total_count ?? 0,
            isEmpty: (data.items?.length ?? 0) === 0,
            errorType: 'NONE',
            errorMessage: null,
          }));
        }
      } catch (error) {
        if (signal.aborted) {
          // on ne fait rien si la requête est annulée
          return;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          errorType: 'NETWORK',
          errorMessage:
            error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK,
        }));
      }
    }, debounceMs);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query, minQueryLength, debounceMs]);

  return state;
}
