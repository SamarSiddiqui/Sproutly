import React from 'react';

interface LeafProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Leaf({ className, ...props }: LeafProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path d="M50 95C50 95 10 70 10 40C10 15 30 5 50 5C70 5 90 15 90 40C90 70 50 95 50 95Z" />
      <path
        d="M50 95C50 95 50 5 50 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M50 70C50 70 30 55 25 50"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M50 50C50 50 70 35 75 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M50 30C50 30 35 20 30 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
