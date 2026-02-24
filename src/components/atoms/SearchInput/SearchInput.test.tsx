import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
  it('rend un input de type text dans un conteneur avec la bonne classe', () => {
    const handleChange = () => {};

    render(
      <SearchInput
        query=''
        handleChange={handleChange}
        placeHolder='Rechercher un user'
      />,
    );

    const container = document.querySelector('.text-input-container');
    expect(container).not.toBeNull();

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('text-input');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('name', 'search');
  });

  it('affiche la valeur de query dans le champ', () => {
    const handleChange = () => {};

    render(
      <SearchInput
        query='initial value'
        handleChange={handleChange}
        placeHolder='Rechercher'
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial value');
  });

  it('met à jour la valeur affichée quand la prop query change', () => {
    const handleChange = () => {};

    const { rerender } = render(
      <SearchInput
        query='value 1'
        handleChange={handleChange}
        placeHolder='Rechercher'
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('value 1');

    rerender(
      <SearchInput
        query='value 2'
        handleChange={handleChange}
        placeHolder='Rechercher'
      />,
    );

    expect(input.value).toBe('value 2');
  });

  it('fait remonter la nouvelle valeur via handleChange', () => {
    let lastValue = '';
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      lastValue = e.target.value;
    };

    render(
      <SearchInput
        query=''
        handleChange={handleChange}
        placeHolder='Rechercher'
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'ab' } });

    expect(lastValue).toBe('ab');
  });

  it('affiche le placeholder quand placeHolder est fourni', () => {
    const handleChange = () => {};

    render(
      <SearchInput
        query=''
        handleChange={handleChange}
        placeHolder='Rechercher un utilisateur Github'
      />,
    );

    const input = screen.getByPlaceholderText(
      'Rechercher un utilisateur Github',
    );
    expect(input).toBeInTheDocument();
  });

  it('met le placeholder à une string vide quand placeHolder est vide', () => {
    const handleChange = () => {};

    render(<SearchInput query='' handleChange={handleChange} placeHolder='' />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.placeholder).toBe('');
  });

  it('gère une valeur de query très longue sans planter', () => {
    const handleChange = () => {};
    const longQuery = 'a'.repeat(1000);

    render(
      <SearchInput
        query={longQuery}
        handleChange={handleChange}
        placeHolder='Rechercher'
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe(longQuery);
  });
});
