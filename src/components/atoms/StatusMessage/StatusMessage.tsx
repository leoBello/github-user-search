import React from 'react';
import './statusMessage.css';
import { UI_MESSAGES } from '../../../constants/messages';

interface StatusMessageProps {
  loading?: boolean;
  errorMessage?: string | null;
}

const StatusMessage: React.FC<StatusMessageProps> = React.memo(({
  loading,
  errorMessage,
}) => {
  if (!loading && !errorMessage) {
    return null;
  }
  return (
    <div className='status-message-container' role='status' aria-live='polite'>
      {loading && (
        <p
          className='loading-text'
          role='status'
          aria-label='Chargement en cours'
        >
          {UI_MESSAGES.LOADING}
        </p>
      )}
      {errorMessage && (
        <p className='error-text' role='alert' aria-live='assertive'>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

StatusMessage.displayName = 'StatusMessage';

export default StatusMessage;
