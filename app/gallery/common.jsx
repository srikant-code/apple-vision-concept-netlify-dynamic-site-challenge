'use client';
import { useFormStatus } from 'react-dom';
export const Button = ({ style, children, selected = true, circular = false, ...props }) => {
    return (
        <button
            className="category"
            style={{
                padding: 12,
                ...ReuseCSS.button(selected),
                borderRadius: 50,
                height: circular ? 50 : undefined,
                width: circular ? 50 : undefined,
                fontWeight: 600,
                ...ReuseCSS.transition,
                ...style
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export const ExternalLink = ({ children, href }) => {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );
};

export const CONSTANTS = {
    DATEFORMAT: {
        lastWeek: 'DD MMM, YYYY',
        sameElse: 'DD MMM, YYYY'
    }
};

export const DAY = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
};

export const MONTH = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
};
// console.log({ window });

export const ReuseCSS = {
    font: { color: 'white' },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    transition: {
        transition: `all 0.2s ease-in-out`
    },
    button: (selected) => {
        return {
            backdropFilter: `blur(45.1px)`,
            border: selected ? `2px solid rgba(255, 255, 255, 0.34)` : undefined,
            background: selected ? `rgba(255, 255, 255, 0.3)` : 'rgba(255, 255, 255, 0.0)'
        };
    }
};

export function SubmitButton({ text = 'Submit' }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {text}
        </Button>
    );
}
