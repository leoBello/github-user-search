import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelectableUsers } from '../useSelectableUsers';
import type { GithubUser } from '../../services/githubApi';
import { mockGithubUsers } from './__mock__/mockedGithubUser';

type State = ReturnType<typeof useSelectableUsers>;

const createUsers = (count: number): GithubUser[] =>
  Array.from({ length: count }).map((_, i) => ({
    ...mockGithubUsers[0],
    id: i + 1,
    login: `user-${i + 1}`,
  }));

describe('useSelectableUsers', () => {
  it('initialise displayedUsers à partir de sourceUsers et reset selectedIds', () => {
    const users = createUsers(3);

    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    const state = result.current as State;
    expect(state.displayedUsers).toHaveLength(3);
    expect(state.displayedUsers.map((u) => u.id)).toEqual([1, 2, 3]);
    expect(state.selectedIds).toEqual([]);
    expect(state.isEditMode).toBe(true);
    expect(state.isAllSelected).toBe(false);
  });

  it('met à jour displayedUsers et reset selectedIds quand sourceUsers change', () => {
    const initial = createUsers(2);
    const next = createUsers(4);

    const { result, rerender } = renderHook(
      ({ sourceUsers }: { sourceUsers: GithubUser[] }) =>
        useSelectableUsers({ sourceUsers }),
      { initialProps: { sourceUsers: initial } },
    );

    act(() => {
      result.current.toggleSelect(initial[0]);
    });
    expect(result.current.selectedIds).toEqual([initial[0].id]);

    rerender({ sourceUsers: next });

    const state = result.current as State;
    expect(state.displayedUsers).toHaveLength(4);
    expect(state.displayedUsers.map((u) => u.id)).toEqual([1, 2, 3, 4]);

    expect(state.selectedIds).toEqual([]);
  });

  it('toggleSelect ajoute puis retire un id', () => {
    const users = createUsers(2);
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    act(() => {
      result.current.toggleSelect(users[0]);
    });
    expect(result.current.selectedIds).toEqual([users[0].id]);

    act(() => {
      result.current.toggleSelect(users[0]);
    });
    expect(result.current.selectedIds).toEqual([]);
  });

  it('isAllSelected est true quand tous les displayedUsers sont sélectionnés', () => {
    const users = createUsers(3);
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    act(() => {
      users.forEach((u) => result.current.toggleSelect(u));
    });

    const state = result.current as State;
    expect(state.selectedIds.sort()).toEqual(users.map((u) => u.id).sort());
    expect(state.isAllSelected).toBe(true);
  });

  it('toggleSelectAll sélectionne tous puis désélectionne tous', () => {
    const users = createUsers(3);
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    act(() => {
      result.current.toggleSelectAll();
    });
    expect(result.current.selectedIds.sort()).toEqual(
      users.map((u) => u.id).sort(),
    );
    expect(result.current.isAllSelected).toBe(true);

    act(() => {
      result.current.toggleSelectAll();
    });
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.isAllSelected).toBe(false);
  });

  it('deleteSelected supprime uniquement les users sélectionnés et clear selectedIds', () => {
    const users = createUsers(4);
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    act(() => {
      result.current.toggleSelect(users[1]);
      result.current.toggleSelect(users[3]);
    });
    expect(result.current.selectedIds.sort()).toEqual([2, 4]);

    act(() => {
      result.current.deleteSelected();
    });

    const state = result.current as State;
    expect(state.displayedUsers.map((u) => u.id).sort()).toEqual([1, 3]);
    expect(state.selectedIds).toEqual([]);
  });

  it('duplicateSelected duplique les users sélectionnés avec de nouveaux ids', () => {
    const users = createUsers(3);
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    act(() => {
      result.current.toggleSelect(users[1]);
      result.current.toggleSelect(users[2]);
    });

    act(() => {
      result.current.duplicateSelected();
    });

    const state = result.current as State;
    const ids = state.displayedUsers.map((u) => u.id).sort();

    expect(state.displayedUsers).toHaveLength(5);
    expect(ids.slice(0, 3)).toEqual([1, 2, 3]);
    expect(ids[3]).toBeGreaterThan(3);
    expect(ids[4]).toBeGreaterThan(ids[3]);
  });

  it('toggleEditMode inverse isEditMode', () => {
    const users = createUsers(1);
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    expect(result.current.isEditMode).toBe(true);

    act(() => {
      result.current.toggleEditMode();
    });
    expect(result.current.isEditMode).toBe(false);

    act(() => {
      result.current.toggleEditMode();
    });
    expect(result.current.isEditMode).toBe(true);
  });
  it('duplicateSelected ne modifie pas displayedUsers quand aucun user n’est sélectionné', () => {
    const users = createUsers(3);
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    act(() => {
      result.current.duplicateSelected();
    });

    const state = result.current as State;
    expect(state.displayedUsers).toHaveLength(3);
    expect(state.displayedUsers.map((u) => u.id)).toEqual([1, 2, 3]);
    expect(state.selectedIds).toEqual([]);
  });
  it('deleteSelected avec aucun id sélectionné ne change rien', () => {
    const users = createUsers(3);
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    act(() => {
      result.current.deleteSelected();
    });

    const state = result.current as State;
    expect(state.displayedUsers.map((u) => u.id)).toEqual([1, 2, 3]);
    expect(state.selectedIds).toEqual([]);
  });

  it('duplicateSelected avec liste vide ne plante pas', () => {
    const users: GithubUser[] = [];
    const { result } = renderHook(() =>
      useSelectableUsers({ sourceUsers: users }),
    );

    act(() => {
      result.current.duplicateSelected();
    });

    const state = result.current as State;
    expect(state.displayedUsers).toHaveLength(0);
    expect(state.selectedIds).toEqual([]);
  });
});
