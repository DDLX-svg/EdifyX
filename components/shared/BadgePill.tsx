import React from 'react';
import type { Badge } from '../../types.ts';
import { Icon } from './Icon.tsx';

export const BadgePill: React.FC<{ badge: Badge }> = ({ badge }) => (
    <div className="relative group">
        <div className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full ${badge.color} cursor-pointer`}>
            <Icon name={badge.icon} className="w-3 h-3 text-white" />
            <span className="text-xs font-semibold text-white whitespace-nowrap">{badge.name}</span>
        </div>
        <div role="tooltip" className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none z-10">
            {badge.description}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
    </div>
);