import { render, screen } from '@testing-library/react';
import PageTitle from './PageTitle';

describe('PageTitle', () => {
  it('affiche le titre quand une string non vide est fournie', () => {
    render(<PageTitle title='Mon titre' />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Mon titre',
    });
    expect(heading).toBeInTheDocument();
  });

  it("entoure le titre dans un conteneur avec la classe 'title-container'", () => {
    render(<PageTitle title='Titre' />);
    const container = screen.getByText('Titre').closest('div');
    expect(container).not.toBeNull();
    expect(container).toHaveClass('title-container');
  });

  it("n'affiche rien si title est une string vide", () => {
    render(<PageTitle title='' />);
    const heading = screen.queryByRole('heading', { level: 1 });
    expect(heading).toBeNull();
  });

  it("n'affiche pas le conteneur si title est une string vide", () => {
    render(<PageTitle title='' />);
    const titleContainer = document.querySelector('.title-container');
    expect(titleContainer).toBeNull();
  });

  it('affiche le texte du titre tel quel (y compris espaces et caracteres speciaux)', () => {
    const complexTitle =
      '  Titre avec   espaces   et caracteres speciaux !@#€  ';
    render(<PageTitle title={complexTitle} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(complexTitle);
  });

  it('peut afficher un titre tres long sans planter', () => {
    const longTitle = 'a'.repeat(1000);
    render(<PageTitle title={longTitle} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(longTitle);
  });

  it('met a jour le DOM si la prop title change', () => {
    const { rerender } = render(<PageTitle title='Titre initial' />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Titre initial' }),
    ).toBeInTheDocument();

    rerender(<PageTitle title='Nouveau titre' />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Nouveau titre' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 1, name: 'Titre initial' }),
    ).toBeNull();
  });

  it('le fragment React ne rajoute aucun wrapper inutile autour du conteneur', () => {
    const { container } = render(<PageTitle title='Titre' />);
    const firstElementChild = container.firstElementChild;
    expect(firstElementChild).not.toBeNull();
    expect(firstElementChild).toHaveClass('title-container');
  });
});
