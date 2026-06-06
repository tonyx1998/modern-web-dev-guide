import clsx from 'clsx';
import type {GuideLevel} from '@site/src/data/guide';
import styles from './styles.module.css';

type BadgeVariant = 'level' | 'secondary' | 'outline' | 'success';

interface BadgeProps {
  children: React.ReactNode;
  level?: GuideLevel;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({children, level, variant = 'secondary', className}: BadgeProps) {
  return (
    <span
      className={clsx(
        styles.badge,
        level && styles[`level-${level}`],
        !level && styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
