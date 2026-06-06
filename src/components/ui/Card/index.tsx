import clsx from 'clsx';
import type {ReactNode} from 'react';
import styles from './styles.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  accent?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  interactive = false,
  accent = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={clsx(
        styles.card,
        interactive && styles.interactive,
        accent && styles.accent,
        className,
      )}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export function CardHeader({children, className}: {children: ReactNode; className?: string}) {
  return <div className={clsx(styles.header, className)}>{children}</div>;
}

export function CardTitle({children, className}: {children: ReactNode; className?: string}) {
  return <h3 className={clsx(styles.title, className)}>{children}</h3>;
}

export function CardContent({children, className}: {children: ReactNode; className?: string}) {
  return <div className={clsx(styles.content, className)}>{children}</div>;
}
