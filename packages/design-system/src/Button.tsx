import type { ButtonHTMLAttributes } from 'react'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary'
}

export function Button({
  variant = 'default',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    'ds-button',
    variant === 'primary' && 'ds-button--primary',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return <button {...props} type={type} className={classes} />
}
