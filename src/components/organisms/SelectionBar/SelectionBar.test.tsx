import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SelectionBar from './SelectionBar';

describe('SelectionBar', () => {
  const defaultProps = {
    selectedIdsLength: 3,
    isAllSelected: false,
    onDeleteSelected: vi.fn(),
    duplicateSelected: vi.fn(),
    toggleSelectAll: vi.fn(),
    isEditMode: false,
    handleEditMode: vi.fn(),
  };

  it('rend le conteneur principal avec la classe selection-bar-container', () => {
    render(<SelectionBar {...defaultProps} />);
    const container = document.querySelector('.selection-bar-container');
    expect(container).not.toBeNull();
    expect(container).toHaveClass('selection-bar-container');
  });

  it('affiche le label avec le bon nombre déléments quand isEditMode est false (hidden)', () => {
    render(<SelectionBar {...defaultProps} />);
    const label = document.querySelector('.label-container');
    expect(label).not.toBeNull();
    expect(label).toHaveClass('hidden');
    expect(label?.textContent).toContain('3 elements selected');
  });

  it('affiche le label sans hidden et avec checkbox select-all quand isEditMode est true', () => {
    render(<SelectionBar {...defaultProps} isEditMode={true} />);
    const label = document.querySelector('.label-container');
    expect(label).not.toBeNull();
    expect(label).not.toHaveClass('hidden');
    const checkbox = document.querySelector(
      '.select-all-checkbox',
    ) as HTMLInputElement; // ← SEULE CHANGEMENT
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('appelle toggleSelectAll au changement de la checkbox select-all', () => {
    const toggleSelectAll = vi.fn();
    render(
      <SelectionBar
        {...defaultProps}
        isEditMode={true}
        toggleSelectAll={toggleSelectAll}
      />,
    );
    const checkbox = document.querySelector(
      '.select-all-checkbox',
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(toggleSelectAll).toHaveBeenCalledTimes(1);
  });

  it('affiche le switch-container avec ToggleSwitch (label.toggle)', () => {
    render(<SelectionBar {...defaultProps} />);
    const switchContainer = document.querySelector('.switch-container');
    expect(switchContainer).not.toBeNull();
    const toggleLabel = switchContainer?.querySelector('.toggle');
    expect(toggleLabel).not.toBeNull();
    expect(toggleLabel).toHaveClass('toggle');
  });

  it('affiche limage editIcon et le texte Edit mode à côté du switch', () => {
    render(<SelectionBar {...defaultProps} />);
    const img = document.querySelector('img[src*="edit"]');
    expect(img).not.toBeNull();
    expect(img).toHaveClass('custom-icon');
    expect(screen.getByText('Edit mode')).toBeInTheDocument();
  });

  it('appelle handleEditMode au toggle du switch', () => {
    const handleEditMode = vi.fn();
    render(<SelectionBar {...defaultProps} handleEditMode={handleEditMode} />);
    const switchInput = document.querySelector(
      '.switch-container input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(switchInput).not.toBeNull();
    fireEvent.click(switchInput);
    expect(handleEditMode).toHaveBeenCalledWith(true);
  });

  it('cache les boutons (buttons-container hidden) quand isEditMode est false', () => {
    render(<SelectionBar {...defaultProps} />);
    const buttonsContainer = document.querySelector('.buttons-container');
    expect(buttonsContainer).not.toBeNull();
    expect(buttonsContainer).toHaveClass('hidden');
  });

  it('affiche les boutons GenericButton avec icônes copy et delete quand isEditMode est true', () => {
    render(<SelectionBar {...defaultProps} isEditMode={true} />);
    const buttonsContainer = document.querySelector('.buttons-container');
    expect(buttonsContainer).not.toHaveClass('hidden');
    const copyImg = buttonsContainer?.querySelector('img[src*="copy"]');
    const deleteImg = buttonsContainer?.querySelector('img[src*="delete"]');
    expect(copyImg).not.toBeNull();
    expect(deleteImg).not.toBeNull();
    expect(copyImg).toHaveClass('custom-icon');
    expect(deleteImg).toHaveClass('custom-icon');
  });

  it('appelle duplicateSelected au clic du bouton copy (premier bouton)', () => {
    const duplicateSelected = vi.fn();
    render(
      <SelectionBar
        {...defaultProps}
        isEditMode={true}
        duplicateSelected={duplicateSelected}
      />,
    );
    const buttonsContainer = document.querySelector(
      '.buttons-container',
    ) as HTMLDivElement;
    const buttons = buttonsContainer.querySelectorAll('button');
    const copyButton = buttons[0] as HTMLButtonElement;
    fireEvent.click(copyButton);
    expect(duplicateSelected).toHaveBeenCalledTimes(1);
  });

  it('appelle onDeleteSelected au clic du bouton delete (second bouton)', () => {
    const onDeleteSelected = vi.fn();
    render(
      <SelectionBar
        {...defaultProps}
        isEditMode={true}
        onDeleteSelected={onDeleteSelected}
      />,
    );
    const buttonsContainer = document.querySelector(
      '.buttons-container',
    ) as HTMLDivElement;
    const buttons = buttonsContainer.querySelectorAll('button');
    const deleteButton = buttons[1] as HTMLButtonElement;
    fireEvent.click(deleteButton);
    expect(onDeleteSelected).toHaveBeenCalledTimes(1);
  });

  // Cas limites
  it('gère 0 éléments sélectionnés (texte correct)', () => {
    render(
      <SelectionBar
        {...defaultProps}
        selectedIdsLength={0}
        isEditMode={true}
      />,
    );
    const label = document.querySelector('.label-container');
    expect(label?.textContent).toContain('0 elements selected');
  });

  it('affiche checkbox select-all checked quand isAllSelected=true', () => {
    render(
      <SelectionBar {...defaultProps} isAllSelected={true} isEditMode={true} />,
    );
    const checkbox = document.querySelector(
      '.select-all-checkbox',
    ) as HTMLInputElement;
    expect(checkbox).toBeChecked();
  });

  it('gère grand nombre déléments (ex: 100)', () => {
    render(
      <SelectionBar
        {...defaultProps}
        selectedIdsLength={100}
        isEditMode={true}
      />,
    );
    const label = document.querySelector('.label-container');
    expect(label?.textContent).toContain('100 elements selected');
  });

  it('ne crash pas avec props minimales', () => {
    const safeProps = {
      selectedIdsLength: 0,
      isAllSelected: false,
      onDeleteSelected: vi.fn(),
      duplicateSelected: vi.fn(),
      toggleSelectAll: vi.fn(),
      isEditMode: false,
      handleEditMode: vi.fn(),
    };
    const { container } = render(<SelectionBar {...safeProps} />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
