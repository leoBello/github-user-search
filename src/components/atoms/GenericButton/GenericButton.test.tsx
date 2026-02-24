import { render, screen, fireEvent } from '@testing-library/react';
import GenericButton from './GenericButton';

describe('GenericButton', () => {
  it('rend un button avec les classes adequates quand href n est pas fourni', () => {
    const handleClick = () => {};

    render(
      <GenericButton type='actionbutton' onClick={handleClick}>
        Action
      </GenericButton>,
    );

    const button = screen.getByRole('button', { name: 'Action' });

    expect(button).toBeInTheDocument();
    expect(button.tagName.toLowerCase()).toBe('button');
    expect(button).toHaveClass('generic-button');
    expect(button).toHaveClass('actionbutton');
  });

  it('rend un lien avec role=button quand href est fourni', () => {
    const handleClick = () => {};

    render(
      <GenericButton
        type='viewprofile'
        href='https://github.com/user'
        onClick={handleClick}
      >
        Voir le profil
      </GenericButton>,
    );

    const link = screen.getByRole('button', { name: 'Voir le profil' });

    expect(link).toBeInTheDocument();
    expect(link.tagName.toLowerCase()).toBe('a');
    expect(link).toHaveAttribute('href', 'https://github.com/user');
    expect(link).toHaveClass('generic-button');
    expect(link).toHaveClass('viewprofile');
  });

  it('concatene correctement les classes avec className', () => {
    const handleClick = () => {};

    render(
      <GenericButton
        type='actionbutton'
        className='extra-class'
        onClick={handleClick}
      >
        Action
      </GenericButton>,
    );

    const button = screen.getByRole('button', { name: 'Action' });

    expect(button).toHaveClass('generic-button');
    expect(button).toHaveClass('actionbutton');
    expect(button).toHaveClass('extra-class');
  });

  it('utilise aria-label fourni en priorite pour le button', () => {
    const handleClick = () => {};

    render(
      <GenericButton
        type='actionbutton'
        aria-label='Bouton custom'
        onClick={handleClick}
      >
        Texte ignore
      </GenericButton>,
    );

    const button = screen.getByRole('button', { name: 'Bouton custom' });

    expect(button).toBeInTheDocument();
  });

  it('utilise aria-label fourni en priorite pour le lien', () => {
    const handleClick = () => {};

    render(
      <GenericButton
        type='viewprofile'
        href='#'
        aria-label='Voir le profil custom'
        onClick={handleClick}
      >
        Texte
      </GenericButton>,
    );

    const link = screen.getByRole('button', { name: 'Voir le profil custom' });

    expect(link).toBeInTheDocument();
  });

  it('utilise un aria-label par defaut pour viewprofile', () => {
    const handleClick = () => {};

    render(
      <GenericButton type='viewprofile' onClick={handleClick}>
        Profil
      </GenericButton>,
    );

    const button = screen.getByRole('button', { name: 'Voir le profil' });

    expect(button).toBeInTheDocument();
  });

  it('utilise un aria-label par defaut pour actionbutton', () => {
    const handleClick = () => {};

    render(
      <GenericButton type='actionbutton' onClick={handleClick}>
        Action
      </GenericButton>,
    );

    const button = screen.getByRole('button', { name: 'Action' });

    expect(button).toBeInTheDocument();
  });

  it('applique target et rel par defaut sur le lien', () => {
    const handleClick = () => {};

    render(
      <GenericButton
        type='viewprofile'
        href='https://github.com/user'
        onClick={handleClick}
      >
        Voir
      </GenericButton>,
    );

    const link = screen.getByRole('button', { name: 'Voir le profil' });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('permet de surcharger target et rel sur le lien', () => {
    const handleClick = () => {};

    render(
      <GenericButton
        type='viewprofile'
        href='https://github.com/user'
        target='_self'
        rel='nofollow'
        onClick={handleClick}
      >
        Voir
      </GenericButton>,
    );

    const link = screen.getByRole('button', { name: 'Voir le profil' });

    expect(link).toHaveAttribute('target', '_self');
    expect(link).toHaveAttribute('rel', 'nofollow');
  });

  it('appelle onClick quand on clique sur le button', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(
      <GenericButton type='actionbutton' onClick={handleClick}>
        Action
      </GenericButton>,
    );

    const button = screen.getByRole('button', { name: 'Action' });

    fireEvent.click(button);

    expect(clicked).toBe(true);
  });

  it('appelle onClick quand on clique sur le lien', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(
      <GenericButton
        type='viewprofile'
        href='https://github.com/user'
        onClick={handleClick}
      >
        Voir
      </GenericButton>,
    );

    const link = screen.getByRole('button', { name: 'Voir le profil' });

    fireEvent.click(link);

    expect(clicked).toBe(true);
  });

  it('desactive le button quand disabled vaut true', () => {
    const handleClick = () => {};

    render(
      <GenericButton type='actionbutton' disabled onClick={handleClick}>
        Action
      </GenericButton>,
    );

    const button = screen.getByRole('button', {
      name: 'Action',
    }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('n ajoute pas aria-disabled sur le button quand disabled vaut false', () => {
    const handleClick = () => {};

    render(
      <GenericButton type='actionbutton' disabled={false} onClick={handleClick}>
        Action
      </GenericButton>,
    );

    const button = screen.getByRole('button', { name: 'Action' });

    expect(button).not.toHaveAttribute('aria-disabled');
  });

  it('propage les props supplementaires vers le button', () => {
    const handleClick = () => {};

    render(
      <GenericButton
        type='actionbutton'
        onClick={handleClick}
        data-testid='generic-button'
      >
        Action
      </GenericButton>,
    );

    const button = screen.getByTestId('generic-button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('propage les props supplementaires vers le lien', () => {
    const handleClick = () => {};

    render(
      <GenericButton
        type='viewprofile'
        href='#'
        onClick={handleClick}
        data-testid='generic-link'
      >
        Voir
      </GenericButton>,
    );

    const link = screen.getByTestId('generic-link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#');
  });
});
