/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Official Zalo Vector Icon component.
 */

import React from 'react';

interface ZaloIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export default function ZaloIcon({ size = 20, className = '', ...props }: ZaloIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="48" height="48" rx="12" fill="#0068FF" />
      <path
        d="M34.8 28.5c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-.9-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8 0 1.6 1.2 3.2 1.4 3.4.2.2 2.3 3.6 5.6 5 1.7.7 2.6.8 3.5.7.9-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.5z"
        fill="#ffffff"
        opacity="0.15"
      />
      {/* Official Zalo typography text */}
      <text
        x="24"
        y="31"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="17"
        fontWeight="900"
        letterSpacing="-0.5px"
        fill="#ffffff"
        textAnchor="middle"
      >
        Zalo
      </text>
    </svg>
  );
}
