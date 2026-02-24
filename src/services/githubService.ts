import type {
  GithubUserSearchResponse,
  GithubUserSearchErrorType,
} from './githubApi';

export interface GithubServiceError {
  type: GithubUserSearchErrorType;
  message: string;
  status?: number;
  rateLimitResetAt?: Date | null;
}

export interface GithubServiceResponse {
  success: boolean;
  data?: GithubUserSearchResponse;
  error?: GithubServiceError;
}

/**
 * Service pour interagir avec l'API GitHub
 */
export const githubService = {
  /**
   * Recherche des utilisateurs GitHub
   * @param query - La requête de recherche
   * @param signal - Signal d'annulation pour la requête
   * @returns Réponse avec les données ou l'erreur
   */
  searchUsers: async (
    query: string,
    signal?: AbortSignal,
  ): Promise<GithubServiceResponse> => {
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          signal,
          headers: {
            Accept: 'application/vnd.github+json',
          },
        },
      );

      // Gestion rate limit (403)
      if (response.status === 403) {
        const resetHeader = response.headers.get('x-ratelimit-reset');
        const resetDate =
          resetHeader != null ? new Date(Number(resetHeader) * 1000) : null;

        return {
          success: false,
          error: {
            type: 'RATE_LIMIT',
            message:
              'Limite de requêtes GitHub atteinte. Réessaie dans quelques instants.',
            status: 403,
            rateLimitResetAt: resetDate,
          },
        };
      }

      // Validation error (422)
      if (response.status === 422) {
        const errorBody = (await response.json()) as { message?: string };
        return {
          success: false,
          error: {
            type: 'VALIDATION',
            message:
              errorBody.message ??
              "La requête de recherche n'est pas valide pour l'API GitHub.",
            status: 422,
          },
        };
      }

      // Autres erreurs serveur
      if (!response.ok) {
        return {
          success: false,
          error: {
            type: 'UNKNOWN',
            message: `Erreur serveur GitHub (${response.status}).`,
            status: response.status,
          },
        };
      }

      // Succès
      const data = (await response.json()) as GithubUserSearchResponse;
      return {
        success: true,
        data,
      };
    } catch (error) {
      // Erreur réseau ou requête annulée
      if (signal?.aborted) {
        throw error; // Re-throw pour que le hook gère l'annulation
      }

      return {
        success: false,
        error: {
          type: 'NETWORK',
          message:
            error instanceof Error
              ? error.message
              : "Erreur réseau lors de l'appel à l'API GitHub.",
        },
      };
    }
  },
};
