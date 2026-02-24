import React from 'react';
import './selectionBar.css';
import copyIcon from '../../../assets/copy.png';
import deleteIcon from '../../../assets/delete.png';
import editIcon from '../../../assets/edit.png';
import ToggleSwitch from '../../atoms/ToggleSwitch/ToggleSwitch';
import GenericButton from '../../atoms/GenericButton/GenericButton';
import SelectAllComponent from '../../molecules/SelectAllComponent/SelectAllComponent';

interface SelectionBarProps {
  selectedIdsLength: number;
  isAllSelected: boolean;
  onDeleteSelected: () => void;
  duplicateSelected: () => void;
  toggleSelectAll: () => void;
  isEditMode: boolean;
  handleEditMode: (checked: boolean) => void;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedIdsLength,
  isAllSelected,
  onDeleteSelected,
  duplicateSelected,
  toggleSelectAll,
  isEditMode,
  handleEditMode,
}) => {
  return (
    <div className='selection-bar-container'>
      <SelectAllComponent
        isEditMode={isEditMode}
        isAllSelected={isAllSelected}
        toggleSelectAll={toggleSelectAll}
        selectedIdsLength={selectedIdsLength}
      />

      <div className='switch-container'>
        <ToggleSwitch isOn={isEditMode} onChange={handleEditMode} />
        <img className='custom-icon' alt='edit-icon' src={editIcon} />
        <p>{`Edit mode`}</p>
      </div>

      <div className={`buttons-container ${isEditMode ? '' : 'hidden'}`}>
        <GenericButton type='actionbutton' onClick={duplicateSelected}>
          <img className='custom-icon' alt='copy-icon' src={copyIcon} />
        </GenericButton>

        <GenericButton type='actionbutton' onClick={onDeleteSelected}>
          <img className='custom-icon' alt='delete-icon' src={deleteIcon} />
        </GenericButton>
      </div>
    </div>
  );
};

export default SelectionBar;
