import React from 'react';
import './userCard.css';
import type { GithubUser } from '../../../services/githubApi';
import GenericButton from '../../atoms/GenericButton/GenericButton';

interface UserCardProps {
  user: GithubUser;
  onToggle: () => void;
  isEditMode: boolean;
  checked?: boolean;
}

const UserCard: React.FC<UserCardProps> = React.memo(({
  user,
  onToggle,
  isEditMode,
  checked = false,
}) => {
  return (
    <div className='user-card-container'>
      {isEditMode && (
        <input
          type='checkbox'
          checked={checked}
          onChange={onToggle}
          className='select-checkbox'
          aria-label={`Sélectionner ${user?.login || 'utilisateur'}`}
        />
      )}
      <img
        className='avatar'
        src={user?.avatar_url}
        alt={`Avatar de ${user?.login || 'utilisateur'}`}
      />
      <div className='text-container'>
        {user?.id && (
          <p className='truncate-one-line' title={String(user.id)}>
            {user.id}
          </p>
        )}
        {user?.login && (
          <p className='truncate-one-line ' title={String(user.login)}>
            {user.login}
          </p>
        )}
      </div>

      <GenericButton type='viewprofile' href={user?.html_url}>
        <span>{'View profile'}</span>
      </GenericButton>
    </div>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;
