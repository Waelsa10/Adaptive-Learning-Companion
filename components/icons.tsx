import React from 'react';

// FIX: Updated StarIcon to accept standard SVG props. This allows it to receive the `key` prop when used
// in a list, which resolves the TypeScript error in LearningEngine.tsx.
export const StarIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export const RobotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <rect x="7" y="7" width="10" height="10" rx="2.5" />
        <path d="M10 16v4a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-4" />
        <path d="M17 16v4a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-4" />
        <path d="M12 7v-4m-1 0h2" />
        <path d="M10 5.5c0 .276 -.224 .5 -.5 .5s-.5 -.224 -.5 -.5c0 -.276 .224 -.5 .5 .5s.5 .224 .5 .5z" />
        <path d="M15 5.5c0 .276 -.224 .5 -.5 .5s-.5 -.224 -.5 -.5c0 -.276 .224 -.5 .5 .5s.5 .224 .5 .5z" />
    </svg>
);

export const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);