import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {ReactNode} from 'react';
import styles from './styles.module.css';

type ButtonVariant = 'default' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
  href?: string;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className,
  fullWidth = false,
  disabled = false,
  onClick,
  to,
  href,
}: ButtonProps) {
  const cls = clsx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    className,
  );

  if (to) {
    return (
      <Link className={cls} to={to} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
