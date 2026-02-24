import { render, screen } from '@testing-library/react';
import StatusMessage from './StatusMessage';

describe('StatusMessage', () => {
  it('affiche le message de chargement quand loading est true', () => {
    render(<StatusMessage loading={true} />);
    const loadingText = screen.getByText('Loading…');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass('loading-text');
  });

  it("n'affiche pas le message de chargement quand loading est false", () => {
    render(<StatusMessage loading={false} />);
    const loadingText = screen.queryByText('Loading…');
    expect(loadingText).toBeNull();
  });

  it("n'affiche pas le message de chargement quand loading est undefined", () => {
    render(<StatusMessage />);
    const loadingText = screen.queryByText('Loading…');
    expect(loadingText).toBeNull();
  });

  it('affiche le message d erreur quand errorMessage est fourni', () => {
    const errorMsg = 'Erreur de connexion';
    render(<StatusMessage errorMessage={errorMsg} />);
    const errorText = screen.getByText(errorMsg);
    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveClass('error-text');
  });

  it("n'affiche pas le message d erreur quand errorMessage est null", () => {
    render(<StatusMessage errorMessage={null} />);
    const errorText = screen.queryByText(/error/i);
    expect(errorText).toBeNull();
  });

  it("n'affiche pas le message d erreur quand errorMessage est undefined", () => {
    render(<StatusMessage />);
    const errorText = screen.queryByText(/error/i);
    expect(errorText).toBeNull();
  });

  it('affiche les deux messages si loading et errorMessage sont présents', () => {
    const errorMsg = 'Erreur de connexion';
    render(<StatusMessage loading={true} errorMessage={errorMsg} />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('gère un message d erreur vide sans planter (ne rend rien car falsy)', () => {
    // Le composant ne doit pas planter même avec une chaîne vide
    const { container } = render(<StatusMessage errorMessage={''} />);
    const errorText = container.querySelector('.error-text');
    // Une chaîne vide est falsy, donc rien n'est rendu
    expect(errorText).toBeNull();
    // Le rendu s'est bien passé sans erreur
    expect(container).toBeTruthy();
  });

  it('gère un message d erreur très long sans planter', () => {
    const longErrorMsg = 'a'.repeat(1000);
    render(<StatusMessage errorMessage={longErrorMsg} />);
    const errorText = screen.getByText(longErrorMsg);
    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveClass('error-text');
  });

  it('met à jour le message d erreur quand la prop change', () => {
    const { rerender } = render(<StatusMessage errorMessage='Erreur 1' />);
    expect(screen.getByText('Erreur 1')).toBeInTheDocument();

    rerender(<StatusMessage errorMessage='Erreur 2' />);
    expect(screen.getByText('Erreur 2')).toBeInTheDocument();
    expect(screen.queryByText('Erreur 1')).toBeNull();
  });

  it('met à jour le message de chargement quand la prop change', () => {
    const { rerender } = render(<StatusMessage loading={false} />);
    expect(screen.queryByText('Loading…')).toBeNull();

    rerender(<StatusMessage loading={true} />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });
});
