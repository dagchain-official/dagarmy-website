"use client";
import React from 'react';
import Link from 'next/link';

export default function PremiumButton({ text, href = '#', onClick, className = '', style = {}, ...props }) {
    // If onClick is provided, render as button instead of Link
    if (onClick) {
        return (
            <button onClick={onClick} className={`btn-premium ${className}`} style={style} {...props}>
                {text}
            </button>
        );
    }

    return (
        <Link href={href} className={`btn-premium ${className}`} style={style} {...props}>
            {text}
        </Link>
    );
}
