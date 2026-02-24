import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import UserCard from './UserCard';
import type { GithubUser } from '../../../services/githubApi';

describe('UserCard', () => {
  const mockUser: GithubUser = {
    id: 123,
    login: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
    html_url: 'https://github.com/testuser',
  };

  const defaultProps = {
    user: mockUser,
    onToggle: vi.fn(),
    isEditMode: false,
    checked: false,
  };

  it('rend le conteneur principal avec classe user-card-container', () => {
    const { container } = render(<UserCard {...defaultProps} />);
    const containerEl = container.querySelector('.user-card-container');
    expect(containerEl).not.toBeNull();
    expect(containerEl).toHaveClass('user-card-container');
  });

  it('naffiche PAS le checkbox select-checkbox quand isEditMode=false', () => {
    render(<UserCard {...defaultProps} />);
    const checkbox = document.querySelector('.select-checkbox');
    expect(checkbox).toBeNull();
  });

  it('affiche le checkbox select-checkbox quand isEditMode=true', () => {
    render(<UserCard {...defaultProps} isEditMode={true} />);
    const checkbox = document.querySelector('.select-checkbox');
    expect(checkbox).not.toBeNull();
    expect((checkbox as HTMLInputElement).type).toBe('checkbox');
  });

  it('checkbox est unchecked par défaut (checked=false)', () => {
    render(<UserCard {...defaultProps} isEditMode={true} />);
    const checkbox = document.querySelector(
      '.select-checkbox',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('checkbox est checked quand checked=true', () => {
    render(<UserCard {...defaultProps} isEditMode={true} checked={true} />);
    const checkbox = document.querySelector(
      '.select-checkbox',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('appelle onToggle au clic checkbox', () => {
    const onToggle = vi.fn();
    render(
      <UserCard {...defaultProps} isEditMode={true} onToggle={onToggle} />,
    );
    const checkbox = document.querySelector(
      '.select-checkbox',
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('affiche limage avatar avec src=user.avatar_url et classe avatar', () => {
    render(<UserCard {...defaultProps} />);
    const img = document.querySelector('.avatar');
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('src', mockUser.avatar_url);
    expect(img).toHaveClass('avatar');
  });

  it('affiche limage avatar avec alt descriptif', () => {
    render(<UserCard {...defaultProps} />);
    const img = document.querySelector('.avatar') as HTMLImageElement;
    expect(img).toHaveAttribute('alt', `Avatar de ${mockUser.login}`);
  });

  it('affiche aria-label sur le checkbox quand isEditMode=true', () => {
    render(<UserCard {...defaultProps} isEditMode={true} />);
    const checkbox = document.querySelector(
      '.select-checkbox',
    ) as HTMLInputElement;
    expect(checkbox).toHaveAttribute(
      'aria-label',
      `Sélectionner ${mockUser.login}`,
    );
  });

  it('affiche user.id dans text-container quand présent', () => {
    render(<UserCard {...defaultProps} />);
    const textContainer = document.querySelector('.text-container');
    const idP = textContainer?.querySelector('p');
    expect(idP?.textContent).toContain(mockUser.id.toString());
  });

  it('affiche user.login dans text-container quand présent', () => {
    render(<UserCard {...defaultProps} />);
    const textContainer = document.querySelector('.text-container');
    const loginP = textContainer?.querySelectorAll('p')[1];
    expect(loginP?.textContent).toContain(mockUser.login);
  });

  it('affiche GenericButton viewprofile avec href=user.html_url et texte View profile', () => {
    render(<UserCard {...defaultProps} />);
    const buttonContainer = document.querySelector('.user-card-container');
    const button =
      buttonContainer?.querySelector('a') ||
      buttonContainer?.querySelector('button');
    expect(button).not.toBeNull();
    expect(button).toHaveTextContent('View profile');
    if (button?.tagName === 'A') {
      expect(button).toHaveAttribute('href', mockUser.html_url);
    }
  });

  // Cas limites
  it('gère user.id undefined (naffiche pas <p>id</p>)', () => {
    const partialUser = { ...mockUser, id: 0 as any }; // simule falsy
    render(<UserCard {...defaultProps} user={partialUser} />);
    const textContainer = document.querySelector('.text-container');
    const ps = textContainer?.querySelectorAll('p');
    expect(ps?.length).toBe(1); // seulement login si présent
  });

  it('gère user.login undefined (naffiche pas <p>login</p>)', () => {
    const partialUser = { ...mockUser, login: '' as any }; // simule falsy
    render(<UserCard {...defaultProps} user={partialUser} />);
    const textContainer = document.querySelector('.text-container');
    expect(textContainer?.querySelectorAll('p').length).toBe(1); // seulement id
  });

  it('ne crash pas avec user=null et default checked=false', () => {
    render(<UserCard {...defaultProps} user={null as any} isEditMode={true} />);
    const container = document.querySelector('.user-card-container');
    expect(container).not.toBeNull();
  });
});
