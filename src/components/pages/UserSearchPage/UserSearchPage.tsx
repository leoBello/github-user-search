import React, { useState, useCallback } from 'react';
import './userSearchPage.css';
import { useGithubUserSearch } from '../../../hooks/useGithubUserSearch';
import SearchInput from '../../atoms/SearchInput/SearchInput';
import UserCard from '../../molecules/UserCard/UserCard';
import SelectionBar from '../../organisms/SelectionBar/SelectionBar';
import PageTitle from '../../atoms/PageTitle/PageTitle';
import StatusMessage from '../../atoms/StatusMessage/StatusMessage';
import { useSelectableUsers } from '../../../hooks/useSelectableUsers';
import { UI_MESSAGES } from '../../../constants/messages';

const UserSearchPage: React.FC = React.memo(() => {
  const [query, setQuery] = useState('');
  const { users, loading, errorMessage, isEmpty } = useGithubUserSearch(query);

  const {
    displayedUsers,
    selectedIds,
    isEditMode,
    isAllSelected,
    toggleSelect,
    toggleSelectAll,
    deleteSelected,
    duplicateSelected,
    toggleEditMode,
  } = useSelectableUsers({ sourceUsers: users });

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [],
  );

  return (
    <div className='user-page-template'>
      <PageTitle title='Github Search' />

      <SearchInput
        query={query}
        handleChange={handleQueryChange}
        placeHolder='Search input'
      />

      <SelectionBar
        selectedIdsLength={selectedIds.length}
        isAllSelected={isAllSelected}
        toggleSelectAll={toggleSelectAll}
        onDeleteSelected={deleteSelected}
        duplicateSelected={duplicateSelected}
        isEditMode={isEditMode}
        handleEditMode={toggleEditMode}
      />

      <StatusMessage loading={loading} errorMessage={errorMessage} />

      {!loading && !errorMessage && isEmpty && query.trim().length >= 2 && (
        <p className='empty-state' role='status' aria-live='polite'>
          {UI_MESSAGES.NO_RESULTS(query)}
        </p>
      )}

      {displayedUsers.length > 0 && (
        <div className='user-card-list' role='list'>
          {displayedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              checked={selectedIds.includes(user.id)}
              onToggle={() => toggleSelect(user)}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}
    </div>
  );
});

UserSearchPage.displayName = 'UserSearchPage';

export default UserSearchPage;
