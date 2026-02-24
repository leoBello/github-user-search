import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SelectAllComponent from './SelectAllComponent';

describe('SelectAllComponent', () => {
  const defaultProps = {
    isEditMode: false,
    isAllSelected: false,
    toggleSelectAll: vi.fn(),
    selectedIdsLength: 3,
  };

  it('rend le label avec classe label-container', () => {
    const { container } = render(<SelectAllComponent {...defaultProps} />);
    const label = container.querySelector('label');
    expect(label).not.toBeNull();
    expect(label).toHaveClass('label-container');
  });

  it('ajoute classe hidden quand isEditMode=false', () => {
    render(<SelectAllComponent {...defaultProps} />);
    const label = document.querySelector('.label-container');
    expect(label).toHaveClass('hidden');
  });

  it('naffiche PAS la classe hidden quand isEditMode=true', () => {
    render(<SelectAllComponent {...defaultProps} isEditMode={true} />);
    const label = document.querySelector('.label-container');
    expect(label).not.toHaveClass('hidden');
  });

  it('rend un input checkbox avec classe select-all-checkbox', () => {
    render(<SelectAllComponent {...defaultProps} />);
    const checkbox = document.querySelector('.select-all-checkbox');
    expect(checkbox).not.toBeNull();
    expect(checkbox).toHaveClass('select-all-checkbox');
    expect((checkbox as HTMLInputElement).type).toBe('checkbox');
  });

  it('checkbox est unchecked quand isAllSelected=false', () => {
    render(<SelectAllComponent {...defaultProps} />);
    const checkbox = document.querySelector(
      '.select-all-checkbox',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('checkbox est checked quand isAllSelected=true', () => {
    render(<SelectAllComponent {...defaultProps} isAllSelected={true} />);
    const checkbox = document.querySelector(
      '.select-all-checkbox',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('appelle toggleSelectAll au clic sur checkbox', () => {
    const toggleSelectAll = vi.fn();
    render(
      <SelectAllComponent
        {...defaultProps}
        toggleSelectAll={toggleSelectAll}
      />,
    );
    const checkbox = document.querySelector(
      '.select-all-checkbox',
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(toggleSelectAll).toHaveBeenCalledTimes(1);
  });

  it('affiche le bon texte interpolé avec selectedIdsLength', () => {
    render(<SelectAllComponent {...defaultProps} isEditMode={true} />);
    const span = document.querySelector('.label-container span');
    expect(span?.textContent).toContain('3 elements selected');
  });

  // Cas limites
  it('texte correct avec 0 éléments', () => {
    render(
      <SelectAllComponent
        {...defaultProps}
        selectedIdsLength={0}
        isEditMode={true}
      />,
    );
    const span = document.querySelector('.label-container span');
    expect(span?.textContent).toContain('0 elements selected');
  });

  it('texte correct avec grand nombre (100)', () => {
    render(
      <SelectAllComponent
        {...defaultProps}
        selectedIdsLength={100}
        isEditMode={true}
      />,
    );
    const span = document.querySelector('.label-container span');
    expect(span?.textContent).toContain('100 elements selected');
  });

  it('texte correct avec 1 élément (singulier)', () => {
    render(
      <SelectAllComponent
        {...defaultProps}
        selectedIdsLength={1}
        isEditMode={true}
      />,
    );
    const span = document.querySelector('.label-container span');
    expect(span?.textContent).toContain('1 element selected');
  });

  it('ne crash pas avec props minimales', () => {
    const safeProps = {
      isEditMode: false,
      isAllSelected: false,
      toggleSelectAll: vi.fn(),
      selectedIdsLength: 0,
    };
    const { container } = render(<SelectAllComponent {...safeProps} />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it('branche ternaire className : hidden quand !isEditMode, visible quand isEditMode', () => {
    const { container: containerFalse } = render(
      <SelectAllComponent {...defaultProps} />,
    );
    expect(containerFalse.querySelector('label')).toHaveClass('hidden');

    const { container: containerTrue } = render(
      <SelectAllComponent {...defaultProps} isEditMode={true} />,
    );
    expect(containerTrue.querySelector('label')).not.toHaveClass('hidden');
  });
});
