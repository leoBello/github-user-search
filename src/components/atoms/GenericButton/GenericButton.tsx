import React, {
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from 'react';
import './genericButton.css';

type ButtonType = 'actionbutton' | 'viewprofile';

interface GenericButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  type: ButtonType;
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const GenericButton: React.FC<GenericButtonProps> = ({
  type,
  children,
  className = '',
  'aria-label': ariaLabel = '',
  href,
  target = '_blank',
  rel = 'noopener noreferrer',
  onClick,
  disabled,
  ...props
}) => {
  const baseClass = `generic-button ${type}`;
  const fullClass = `${baseClass} ${className}`.trim();

  const computedAriaLabel =
    ariaLabel || (type === 'viewprofile' ? 'Voir le profil' : 'Action');

  if (href) {
    return (
      <a
        href={href}
        className={fullClass}
        target={target}
        rel={rel}
        role='button'
        aria-label={computedAriaLabel}
        onClick={onClick as any}
        tabIndex={0}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={fullClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={computedAriaLabel}
      aria-disabled={disabled || undefined}
      type='button'
      {...props}
    >
      {children}
    </button>
  );
};

export default GenericButton;
