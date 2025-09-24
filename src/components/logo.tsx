import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(190, 60%, 70%)', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(200, 15%, 55%)', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(200, 15%, 40%)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="300" height="100" fill="transparent" />
    <g transform="scale(0.9) translate(5, 5)">
      <circle cx="50" cy="50" r="45" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary) / 0.2)" strokeWidth="2" opacity="0.1" />
      <rect x="42" y="30" width="16" height="40" rx="3" fill="url(#crossGradient)" />
      <rect x="30" y="42" width="40" height="16" rx="3" fill="url(#crossGradient)" />
      <path d="M50 62 C46 58, 40 58, 40 52 C40 48, 44 46, 50 50 C56 46, 60 48, 60 52 C60 58, 54 58, 50 62 Z" fill="url(#heartGradient)" opacity="0.8" />
      <path d="M20 50 L25 50 L27 45 L29 55 L31 40 L33 60 L35 50 L40 50" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M60 50 L65 50 L67 45 L69 55 L71 40 L73 60 L75 50 L80 50" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" opacity="0.6" />
      <text x="110" y="55" fontFamily="var(--font-headline), system-ui, sans-serif" fontSize="28" fontWeight="700" fill="url(#textGradient)">ArogyaSetu</text>
      <text x="110" y="75" fontFamily="var(--font-body), system-ui, sans-serif" fontSize="11" fontWeight="400" fill="hsl(var(--muted-foreground))" opacity="0.8">Your Health, Connected</text>
    </g>
  </svg>
);
