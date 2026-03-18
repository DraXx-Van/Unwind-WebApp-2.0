import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './button'; // reusing cn

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-[32px] bg-white p-6 shadow-sm', // 32px or 40px based on Figma
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';

export { Card };
