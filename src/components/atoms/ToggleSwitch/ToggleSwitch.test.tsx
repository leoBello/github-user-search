import { render, screen, fireEvent } from '@testing-library/react';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch', () => {
  it('rend un checkbox controle dans un label avec la bonne classe', () => {
    const handleChange = () => {};

    render(<ToggleSwitch isOn={false} onChange={handleChange} />);

    const label = document.querySelector('label.toggle');
    expect(label).not.toBeNull();

    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('checkbox');

    const slider = document.querySelector('.slider');
    expect(slider).not.toBeNull();
  });

  it('est coche quand isOn vaut true', () => {
    const handleChange = () => {};

    render(<ToggleSwitch isOn={true} onChange={handleChange} />);

    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('est decoche quand isOn vaut false', () => {
    const handleChange = () => {};

    render(<ToggleSwitch isOn={false} onChange={handleChange} />);

    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it('met a jour l etat coche/decoche quand la prop isOn change', () => {
    const handleChange = () => {};

    const { rerender } = render(
      <ToggleSwitch isOn={false} onChange={handleChange} />,
    );

    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);

    rerender(<ToggleSwitch isOn={true} onChange={handleChange} />);
    expect(input.checked).toBe(true);

    rerender(<ToggleSwitch isOn={false} onChange={handleChange} />);
    expect(input.checked).toBe(false);
  });

  it('appelle onChange avec true quand on coche le switch', () => {
    let lastChecked = false;
    const handleChange = (checked: boolean) => {
      lastChecked = checked;
    };

    render(<ToggleSwitch isOn={false} onChange={handleChange} />);

    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);

    fireEvent.click(input);

    expect(lastChecked).toBe(true);
  });

  it('appelle onChange avec false quand on decoche le switch', () => {
    let lastChecked = true;
    const handleChange = (checked: boolean) => {
      lastChecked = checked;
    };

    render(<ToggleSwitch isOn={true} onChange={handleChange} />);

    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(true);

    fireEvent.click(input);

    expect(lastChecked).toBe(false);
  });

  it('appelle onChange avec la valeur checked calculee par le navigateur', () => {
    const values: boolean[] = [];
    const handleChange = (checked: boolean) => {
      values.push(checked);
    };

    render(<ToggleSwitch isOn={false} onChange={handleChange} />);

    const input = screen.getByRole('checkbox') as HTMLInputElement;

    fireEvent.click(input);
    fireEvent.click(input);
    fireEvent.click(input);

    expect(values).toEqual([true, true, true]);
  });
});
