"use client";
import React from 'react';
import Link from 'next/link';

export default function PremiumButton({ text, href = '#', onClick, className = '', style = {}, ...props }) {
    const chars = text.split('');

    // If onClick is provided, render as button instead of Link
    if (onClick) {
        return (
            <button onClick={onClick} className={`btn-premium ${className}`} style={style} {...props}>
                <div className="bg" />
                <div className="wrap">
                    <div className="content">
                        <span className="char state-1">
                            {chars.map((char, i) => (
                                <span key={i} data-label={char === ' ' ? '\u00A0' : char} style={{ '--i': i + 1 }}>
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </span>
                        <span className="char state-2">
                            {chars.map((char, i) => (
                                <span key={i} data-label={char === ' ' ? '\u00A0' : char} style={{ '--i': i + 1 }}>
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </span>
                    </div>
                </div>
            </button>
        );
    }

    return (
        <Link href={href} className={`btn-premium ${className}`} style={style} {...props}>
            <div className="bg" />
            <div className="wrap">
                <div className="content">
                    <span className="char state-1">
                        {chars.map((char, i) => (
                            <span key={i} data-label={char === ' ' ? '\u00A0' : char} style={{ '--i': i + 1 }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </span>



                    {/* Duplicate text for hover effect */}
                    <span className="char state-2">
                        {chars.map((char, i) => (
                            <span key={i} data-label={char === ' ' ? '\u00A0' : char} style={{ '--i': i + 1 }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        </Link>
    );
}
