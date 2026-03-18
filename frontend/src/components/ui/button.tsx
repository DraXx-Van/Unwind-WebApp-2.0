import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'default' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    {
                        'bg-mindful-brown-80 text-white hover:bg-mindful-brown-60': variant === 'primary',
                        'bg-white text-mindful-brown-80 shadow-sm hover:bg-mindful-brown-10 border border-transparent': variant === 'secondary',
                        'border-2 border-mindful-brown-80 text-mindful-brown-80 hover:bg-mindful-brown-10': variant === 'outline',
                        'hover:bg-mindful-brown-10 text-mindful-brown-80': variant === 'ghost',
                        'h-14 px-8 py-4 text-lg': size === 'default', // 56px height
                        'h-12 w-12': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, cn };
