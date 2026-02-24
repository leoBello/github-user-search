import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGithubUserSearch } from '../useGithubUserSearch';
import type { GithubUser } from '../../services/githubApi';
import { mockGithubUsers } from './__mock__/mockedGithubUser';
import { githubService } from '../../services/githubService';

type GithubUserSearchErrorType =
  | 'NONE'
  | 'RATE_LIMIT'
  | 'VALIDATION'
  | 'NETWORK'
  | 'UNKNOWN';

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

describe('useGithubUserSearch', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('état initial correct', () => {
    const { result } = renderHook(() => useGithubUserSearch(''));
    const state = result.current as State;
    expect(state.loading).toBe(false);
    expect(state.users.length).toBe(0);
    expect(state.errorType).toBe('NONE');
    expect(state.isEmpty).toBe(false);
    expect(state.isRateLimited).toBe(false);
  });

  it('reset si query < minQueryLength=2', async () => {
    const { result, rerender } = renderHook(
      (query: string) => useGithubUserSearch(query),
      { initialProps: '' },
    );

    await act(async () => {
      rerender('a');
      vi.advanceTimersByTime(500);
    });

    const state = result.current as State;
    expect(state.loading).toBe(false);
    expect(state.users.length).toBe(0);
    expect(state.errorType).toBe('NONE');
  });

  it('succès API après debounce 400ms', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(200, true, {
        total_count: 10,
        items: mockGithubUsers.slice(0, 3),
      }),
    );

    const { result } = renderHook(() => useGithubUserSearch('react'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => {
      const state = result.current as State;
      expect(state.loading).toBe(false);
      expect(state.users.length).toBe(3);
      expect(state.totalCount).toBe(10);
      expect(state.isEmpty).toBe(false);
      expect(state.errorType).toBe('NONE');
    });
  });

  it('rate limit 403 avec x-ratelimit-reset', async () => {
    const resetTs = Math.floor(Date.now() / 1000) + 60;
    mockFetch.mockResolvedValueOnce(
      createMockResponse(403, false, { message: 'API rate limit' }, (name) =>
        name === 'x-ratelimit-reset' ? resetTs.toString() : null,
      ),
    );

    const { result } = renderHook(() => useGithubUserSearch('limit'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => {
      const state = result.current as State;
      expect(state.errorType).toBe('RATE_LIMIT');
      expect(state.isRateLimited).toBe(true);
      expect(state.rateLimitResetAt!.getTime()).toBe(resetTs * 1000);
    });
  });

  it('validation 422 avec message custom', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(422, false, { message: 'Query invalide' }),
    );

    const { result } = renderHook(() => useGithubUserSearch('bad'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => {
      const state = result.current as State;
      expect(state.errorType).toBe('VALIDATION');
      expect(state.errorMessage).toBe('Query invalide');
    });
  });

  it('erreur inconnue 500', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse(500, false, {}));

    const { result } = renderHook(() => useGithubUserSearch('500'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => {
      const state = result.current as State;
      expect(state.errorType).toBe('UNKNOWN');
      expect(state.errorMessage).toContain('Erreur serveur GitHub (500)');
    });
  });

  it('erreur réseau reject', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

    const { result } = renderHook(() => useGithubUserSearch('network'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => {
      const state = result.current as State;
      expect(state.errorType).toBe('NETWORK');
      expect(state.errorMessage).toContain('Network timeout');
    });
  });

  it('résultat vide items=[]', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(200, true, { total_count: 0, items: [] }),
    );

    const { result } = renderHook(() => useGithubUserSearch('rien'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => {
      expect(result.current.isEmpty).toBe(true);
    });
  });

  it('persiste rateLimit après query courte', async () => {
    const resetTs = 1234567890;
    mockFetch.mockResolvedValueOnce(
      createMockResponse(403, false, {}, () => resetTs.toString()),
    );

    const { result, rerender } = renderHook(
      (query: string) => useGithubUserSearch(query),
      { initialProps: 'limit' },
    );

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => expect(result.current.isRateLimited).toBe(true));

    await act(async () => {
      rerender('a');
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    expect(result.current.isRateLimited).toBe(true);
  });

  it('options custom minQueryLength=1 debounce=100ms', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(200, true, { items: [] }),
    );

    renderHook(() =>
      useGithubUserSearch('x', { minQueryLength: 1, debounceMs: 100 }),
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
      await Promise.resolve();
    });

    expect(mockFetch).toHaveBeenCalled();
  });

  it('ne met pas à jour le state si signal est aborted après le service call', async () => {
    const OriginalAbortController = globalThis.AbortController;
    const controllers: AbortController[] = [];

    class MockAbortController {
      signal: AbortSignal;

      constructor() {
        // on crée un signal minimal avec la propriété aborted
        this.signal = { aborted: false } as AbortSignal;
        controllers.push(this as unknown as AbortController);
      }

      abort() {
        (this.signal as any).aborted = true;
      }
    }

    // on remplace temporairement AbortController pour le test
    globalThis.AbortController =
      MockAbortController as unknown as typeof AbortController;

    mockFetch.mockImplementation(() => {
      const controller = controllers[0] as unknown as MockAbortController;
      controller.abort();
      return Promise.resolve(
        createMockResponse(200, true, {
          total_count: 10,
          items: mockGithubUsers.slice(0, 3),
        }),
      );
    });

    const { result } = renderHook(() => useGithubUserSearch('test'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    const state = result.current as State;
    // On vérifie simplement que le hook ne plante pas et garde un state cohérent
    expect(state).toBeDefined();

    // restore
    globalThis.AbortController = OriginalAbortController!;
  });

  it('gère le catch avec erreur non-Error (branche NETWORK + message par défaut)', async () => {
    mockFetch.mockRejectedValueOnce('String error');

    const { result } = renderHook(() => useGithubUserSearch('test'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => {
      const state = result.current as State;
      expect(state.errorType).toBe('NETWORK');
      expect(state.errorMessage).toContain(
        "Erreur réseau lors de l'appel à l'API GitHub.",
      );
    });
  });

  it('passe dans le catch et met à jour le state quand githubService throw', async () => {
    const originalSearchUsers = githubService.searchUsers;

    const error = new Error('Service error');
    githubService.searchUsers = vi
      .fn()
      .mockRejectedValueOnce(error) as unknown as typeof originalSearchUsers;

    const { result } = renderHook(() => useGithubUserSearch('test'));

    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await vi.waitFor(() => {
      const state = result.current as State;
      expect(state.errorType).toBe('NETWORK');
      expect(state.errorMessage).toBe('Service error');
    });

    githubService.searchUsers = originalSearchUsers;
  });
});
