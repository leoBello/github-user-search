import React from 'react';
import './selectAllComponent.css';

interface SelectAllComponentProps {
  isEditMode: boolean;
  isAllSelected: boolean;
  toggleSelectAll: () => void;
  selectedIdsLength: number;
}

const SelectAllComponent: React.FC<SelectAllComponentProps> = ({
  isEditMode,
  isAllSelected,
  toggleSelectAll,
  selectedIdsLength,
}) => {
  return (
    <label className={`label-container ${isEditMode ? '' : 'hidden'}`}>
      <input
        type='checkbox'
        className='select-all-checkbox'
        checked={isAllSelected}
        onChange={toggleSelectAll}
      />
      <span>{`${selectedIdsLength} element${selectedIdsLength !== 1 ? 's' : ''} selected`}</span>
    </label>
  );
};

export default SelectAllComponent;
