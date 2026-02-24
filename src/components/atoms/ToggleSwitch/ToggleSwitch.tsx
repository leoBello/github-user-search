import React from 'react';
import './toggleSwitch.css';

interface ToggleSwitchProps {
  isOn: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onChange }) => {
  return (
    <label className='toggle'>
      <input
        type='checkbox'
        checked={isOn}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className='slider' />
    </label>
  );
};

export default ToggleSwitch;
