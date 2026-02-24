import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { githubService } from './githubService';
import type { GithubUserSearchResponse } from './githubApi';
import { mockGithubUsers } from '../hooks/tests/__mock__/mockedGithubUser';

const createMockResponse = (
  status: number,
  ok: boolean,
  body: any,
  headersFn: (name: string) => string | null = () => null,
): Response => {
  return {
    ok,
    status,
    statusText: '',
    headers: { get: headersFn },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
    clone: () => createMockResponse(status, ok, body, headersFn),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
  } as Response;
};

describe('githubService', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('searchUsers', () => {
    it('retourne les données avec succès (200)', async () => {
      const mockData: GithubUserSearchResponse = {
        total_count: 10,
        incomplete_results: false,
        items: mockGithubUsers.slice(0, 3),
      };

      mockFetch.mockResolvedValueOnce(
        createMockResponse(200, true, mockData),
      );

      const result = await githubService.searchUsers('test');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeUndefined();
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json',
          },
        }),
      );
    });

    it('encode correctement la query dans l URL', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(200, true, { items: [] }),
      );

      await githubService.searchUsers('test user');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=test%20user',
        expect.any(Object),
      );
    });

    it('gère le rate limit (403) avec header x-ratelimit-reset', async () => {
      const resetTs = Math.floor(Date.now() / 1000) + 60;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(403, false, { message: 'API rate limit' }, (name) =>
          name === 'x-ratelimit-reset' ? resetTs.toString() : null,
        ),
      );

      const result = await githubService.searchUsers('test');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('RATE_LIMIT');
      expect(result.error?.status).toBe(403);
      expect(result.error?.rateLimitResetAt?.getTime()).toBe(resetTs * 1000);
      expect(result.data).toBeUndefined();
    });

    it('gère le rate limit (403) sans header x-ratelimit-reset', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(403, false, { message: 'API rate limit' }),
      );

      const result = await githubService.searchUsers('test');

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('RATE_LIMIT');
      expect(result.error?.rateLimitResetAt).toBeNull();
    });

    it('gère les erreurs de validation (422) avec message custom', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(422, false, { message: 'Query invalide' }),
      );

      const result = await githubService.searchUsers('bad');

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('VALIDATION');
      expect(result.error?.message).toBe('Query invalide');
      expect(result.error?.status).toBe(422);
    });

    it('gère les erreurs de validation (422) sans message custom', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(422, false, {}),
      );

      const result = await githubService.searchUsers('bad');

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('VALIDATION');
      expect(result.error?.message).toBe(
        "La requête de recherche n'est pas valide pour l'API GitHub.",
      );
    });

    it('gère les erreurs serveur (500)', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(500, false, {}));

      const result = await githubService.searchUsers('test');

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('UNKNOWN');
      expect(result.error?.message).toBe('Erreur serveur GitHub (500).');
      expect(result.error?.status).toBe(500);
    });

    it('gère les erreurs réseau (reject)', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      const result = await githubService.searchUsers('test');

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('NETWORK');
      expect(result.error?.message).toBe('Network timeout');
    });

    it('gère les erreurs réseau avec erreur non-Error', async () => {
      mockFetch.mockRejectedValueOnce('String error');

      const result = await githubService.searchUsers('test');

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('NETWORK');
      expect(result.error?.message).toBe(
        "Erreur réseau lors de l'appel à l'API GitHub.",
      );
    });

    it('re-throw les erreurs si signal est aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      mockFetch.mockRejectedValueOnce(new Error('Aborted'));

      await expect(
        githubService.searchUsers('test', controller.signal),
      ).rejects.toThrow();
    });

    it('passe le signal AbortSignal à fetch', async () => {
      const controller = new AbortController();
      mockFetch.mockResolvedValueOnce(
        createMockResponse(200, true, { items: [] }),
      );

      await githubService.searchUsers('test', controller.signal);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: controller.signal,
        }),
      );
    });

    it('gère les réponses avec items undefined', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(200, true, { total_count: 0 }),
      );

      const result = await githubService.searchUsers('test');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
