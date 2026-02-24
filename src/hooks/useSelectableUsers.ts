import { useEffect, useState } from 'react';
import type { GithubUser } from '../services/githubApi';

type UseSelectableUsersArgs = {
  sourceUsers: GithubUser[];
};

export const useSelectableUsers = ({ sourceUsers }: UseSelectableUsersArgs) => {
  const [displayedUsers, setDisplayedUsers] = useState<GithubUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    setDisplayedUsers(sourceUsers);
    setSelectedIds([]);
  }, [sourceUsers]);

  const toggleSelect = (user: GithubUser) => {
    setSelectedIds((prev) =>
      prev.includes(user.id)
        ? prev.filter((id) => id !== user.id)
        : [...prev, user.id],
    );
  };

  const isAllSelected =
    displayedUsers.length > 0 && selectedIds.length === displayedUsers.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedUsers.map((u) => u.id));
    }
  };

  const deleteSelected = () => {
    setDisplayedUsers((prev) =>
      prev.filter((user) => !selectedIds.includes(user.id)),
    );
    setSelectedIds([]);
  };

  const duplicateSelected = () => {
    setDisplayedUsers((prev) => {
      const selectedUsers = prev.filter((user) =>
        selectedIds.includes(user.id),
      );

      const maxId = prev.reduce(
        (max, user) => (user.id > max ? user.id : max),
        0,
      );

      let nextId = maxId + 1;
      const duplicated = selectedUsers.map((user) => ({
        ...user,
        id: nextId++,
      }));

      return [...prev, ...duplicated];
    });
  };

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  return {
    displayedUsers,
    selectedIds,
    isEditMode,
    isAllSelected,
    toggleSelect,
    toggleSelectAll,
    deleteSelected,
    duplicateSelected,
    toggleEditMode,
  };
};
