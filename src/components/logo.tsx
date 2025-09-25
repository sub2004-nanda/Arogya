import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(190, 60%, 70%)', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(200, 15%, 40%)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    
    {/* Logo Icon */}
    <g transform="translate(10, 10) scale(1.1)">
      <circle cx="40" cy="40" r="40" fill="hsl(var(--secondary) / 0.5)" />
      {/* Plus icon */}
      <rect x="32" y="20" width="16" height="40" rx="4" fill="url(#crossGradient)" />
      <rect x="20" y="32" width="40" height="16" rx="4" fill="url(#crossGradient)" />
       {/* Heartbeat line */}
      <path d="M22 40 L30 40 L34 45 L38 35 L42 40 L50 40" stroke="hsl(var(--background))" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    
    {/* Text */}
    <g transform="translate(110, 0)">
      <text x="0" y="55" fontFamily="var(--font-headline), system-ui, sans-serif" fontSize="28" fontWeight="700" fill="url(#textGradient)">Arogya</text>
      <text x="0" y="75" fontFamily="var(--font-body), system-ui, sans-serif" fontSize="11" fontWeight="400" fill="hsl(var(--muted-foreground))" opacity="0.8">Your Health, Connected To Arogya</text>
    </g>
  </svg>
);