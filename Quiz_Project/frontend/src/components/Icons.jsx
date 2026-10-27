import React from 'react';

/**
 * Pixel-perfect SVG Icons with guaranteed default widths and heights.
 * Ensures icons never expand or distort regardless of parent flexbox or CSS environment.
 */

const baseIconStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  flexShrink: 0
};

export const TrophyIcon = ({ className = '', size = 20, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.004-9.375V4.5a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25v1.875M16.5 4.5h2.25A2.25 2.25 0 0121 6.75v1.5a4.5 4.5 0 01-4.5 4.5h-.75M7.5 4.5H5.25A2.25 2.25 0 003 6.75v1.5a4.5 4.5 0 004.5 4.5h.75" />
  </svg>
);

export const TimerIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const CheckIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export const CrossIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const PlusIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const TrashIcon = ({ className = '', size = 17, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export const ArrowLeftIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export const ArrowRightIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export const PlayIcon = ({ className = '', size = 16, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

export const SearchIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const DatabaseIcon = ({ className = '', size = 16, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

export const BookOpenIcon = ({ className = '', size = 16, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const InfoIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const RefreshIcon = ({ className = '', size = 17, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const LogoIcon = ({ className = '', size = 20, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l2.25 2.25 4.5-4.5" />
  </svg>
);

export const AcademicCapIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

export const TeacherIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12a2.25 2.25 0 002.25-2.25V3M3.75 3h16.5M3.75 3h-.75m18 0h.75M9 21h6m-3-4.5V21" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5M8.25 10.5h4.5" />
  </svg>
);

export const UserIcon = ({ className = '', size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    className={`app-icon ${className}`}
    style={{ ...baseIconStyle, ...style }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
