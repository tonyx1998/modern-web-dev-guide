import clsx from 'clsx';

interface ProgressBarProps {
  value: number;
  className?: string;
  size?: 'default' | 'lg';
}

export function ProgressBar({value, className, size = 'default'}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={clsx(
        'guide-progress',
        size === 'lg' && 'guide-progress--lg',
        className,
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="guide-progress__fill" style={{width: `${clamped}%`}} />
    </div>
  );
}
