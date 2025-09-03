
import React from 'react';

type IconProps = {
  name: string;
  className?: string;
};

// Using inline SVGs for maximum reliability and performance.
// This avoids CORS issues, network requests, and potential rendering bugs.
// Icons are sourced from Heroicons for a consistent and professional look.
const icons: { [key: string]: (props: React.SVGProps<SVGSVGElement>) => JSX.Element } = {
  // Solid
  logo: (props) => ( // New shield logo
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-1 14h-3v-2h3v-3h2v3h3v2h-3v3h-2v-3z"/>
    </svg>
  ),
  'check-circle': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  ),
  'x-circle': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
  ),
  'information-circle': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.75-4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm.75 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  ),
  star: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  ),
  medal: (props) => ( // Updated, reliable medal icon
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.68 13.69 12 11.93l2.32 1.76-1-2.81 2.2-1.6-2.89-.25L12 6.5l-1.11 2.72-2.89.25 2.2 1.6-1 2.81zM20 10c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 2.03.76 3.89 2 5.37V22l6-3 6 3v-6.63c1.24-1.48 2-3.34 2-5.37zm-2 0c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6 6 2.69 6 6z"/>
    </svg>
  ),
  pill: (props) => ( // Updated, reliable pill icon
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3a9 9 0 0 0-4.95 16.36l9.31-9.31A8.97 8.97 0 0 0 12 3z"/>
      <path d="M12 21a9 9 0 0 0 7.36-4.95L9.64 6.34A8.97 8.97 0 0 0 3 12a9 9 0 0 0 9 9z"/>
    </svg>
  ),
  'trophy-solid': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16H9v-3H7v3H5v-5h6v5zm2-8h-2V7h2v3zm4 8h-2v-3h-2v3h-2v-5h6v5z"/>
    </svg>
  ),
  target: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"/>
    </svg>
  ),
  'academic-cap-solid': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 8.5L5.67 8 12 4.69 18.33 8 12 11.5z"/>
    </svg>
  ),
  rocket: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13.5L14 14l-1.5 1.5L11 14l-1.5 1.5L8 14l-1.5 1.5-1-1L7 13l-1.5-1.5L7 10l-1.5-1.5L7 7l1.5 1.5L10 7l1.5 1.5L13 7l1.5 1.5L16 7l1 1-1.5 1.5L17 11l1.5 1.5L17 14l-1.5 1.5z"/>
    </svg>
  ),
  help: (props) => (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-1.423-2.595-1.423-3.485 0l-5.25 8.333a.75.75 0 00.624 1.183h10.5a.75.75 0 00.624-1.183l-5.25-8.333zM12 10.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm0 6a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  ),
  megaphone: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06z" />
      <path d="M17.25 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM19.5 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM21.75 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" />
    </svg>
  ),
  // New Solid Icons
  backpack: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M8.25 2.25a.75.75 0 01.75.75v.518A2.25 2.25 0 0111.25 6h1.5A2.25 2.25 0 0115 3.518V3a.75.75 0 011.5 0v.518a3.75 3.75 0 01-2.25 3.482V8.25a.75.75 0 01-1.5 0V7.018A2.25 2.25 0 019.75 6h-1.5A2.25 2.25 0 016 3.518V3a.75.75 0 01.75-.75h1.5zm6 0a.75.75 0 01.75.75v.518a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25v-12a2.25 2.25 0 012.25-2.25V3a.75.75 0 01.75-.75h1.5zM9 12.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
  ),
  swords: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.12 1.46L12 3.59L9.88 1.46L8.46 2.88L10.59 5L8.46 7.12L9.88 8.54L12 6.41L14.12 8.54L15.54 7.12L13.41 5L15.54 2.88L14.12 1.46M21.22 13.88L19.1 16L21.22 18.12L19.8 19.54L17.67 17.41L15.54 19.54L14.12 18.12L16.25 16L14.12 13.88L15.54 12.46L17.67 14.59L19.8 12.46L21.22 13.88M9.54 14.12L2.88 20.78L2.17 20.07L8.83 13.41L9.54 14.12M14.12 9.54L13.41 8.83L20.07 2.17L20.78 2.88L14.12 9.54Z"/>
    </svg>
  ),
  building: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.92 12.08L12 4.16L4.08 12.08L5.5 13.5L12 7L18.5 13.5L19.92 12.08M12 18H16V14H12V18M4 21V9L12 2L20 9V21H4Z"/>
    </svg>
  ),
  crown: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,18H6V14L4,15V12L6,11V7H18V11L20,12V15L18,14V18H12M12,2L9,5H15L12,2Z"/>
    </svg>
  ),
  sparkles: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2.6L9.3,8.4L3,9.6L7.9,13.8L6.4,20L12,16.7L17.6,20L16.1,13.8L21,9.6L14.7,8.4L12,2.6M12,6L13.5,10.2L18,11L14.6,13.9L15.6,18.4L12,16.2L8.4,18.4L9.4,13.9L6,11L10.5,10.2L12,6Z"/>
    </svg>
  ),
  microscope: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5,21A1,1 0 0,1 14.5,20H12.6A3.42,3.42 0 0,1 10,20.5A3.5,3.5 0 0,1 6.5,17A3.42,3.42 0 0,1 7,14.4V11.2C7,10.6 7.2,10 7.6,9.6L12.5,4.7C13.2,4 14.3,4 15,4.7L16.3,6C17,6.7 17,7.8 16.3,8.5L11,13.8V17A1.5,1.5 0 0,0 12.5,18.5A1.5,1.5 0 0,0 14,17V16.5H16.5V17.8C16.5,18.5 16,19.2 15.3,19.5L17,21H15.5M13.2,9.7L14.6,8.3C14.9,8 14.9,7.5 14.6,7.2L13.3,6C13,5.7 12.5,5.7 12.2,6L10.8,7.4L13.2,9.7Z"/>
    </svg>
  ),
  scroll: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10,2H12V4.86C14.5,5.4 15.7,8.06 15,10.43C14.6,11.83 13.5,12.83 12.1,13.22V17H10V13.22C7.5,12.69 6.3,10 7,7.57C7.4,6.17 8.5,5.17 9.9,4.78V2H10M8.17,7.43C7.8,8.83 8.5,10.43 9.9,11.22V8.14C9.11,7.94 8.44,7.66 8.17,7.43M12,8C11.45,8 11,8.45 11,9C11,9.55 11.45,10 12,10C12.55,10 13,9.55 13,9C13,8.45 12.55,8 12,8M14,6C13.45,6 13,6.45 13,7C13,7.55 13.45,8 14,8C14.55,8 15,7.55 15,7C15,6.45 14.55,6 14,6M5,22H19C20.11,22 21,21.11 21,20V19H3V20C3,21.11 3.9,22 5,22Z"/>
    </svg>
  ),
  brain: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C10.6,2 9.25,2.54 8.25,3.43C8.04,3.61 7.82,3.8 7.63,4C7,4.35 6.45,4.77 6,5.25C5.17,6.05 4.5,7 4.5,8V8.14C4.24,8.4 4,8.7 4,9V11C4,11.24 4.03,11.47 4.08,11.69C3.42,12.12 3,12.75 3,13.5V15.5C3,15.89 3.17,16.24 3.43,16.5C3.17,16.76 3,17.11 3,17.5V19C3,20.1 3.9,21 5,21H6.18C6.54,21.58 7.06,22 7.63,22H9.5C10.04,22 10.54,21.64 10.87,21.18C11.21,21.62 11.69,21.94 12.25,22H14.13C14.69,22 15.19,21.62 15.5,21.15C15.81,21.62 16.28,22 16.81,22H18.5C19.05,22 19.5,21.56 19.82,21H21C22.1,21 23,20.1 23,19V17.5C23,17.11 22.83,16.76 22.57,16.5C22.83,16.24 23,15.89 23,15.5V13.5C23,12.75 22.58,12.12 21.92,11.69C21.97,11.47 22,11.24 22,11V9C22,8.7 21.76,8.4 21.5,8.14V8C21.5,7 20.83,6.05 20,5.25C19.55,4.77 19,4.35 18.37,4C18.18,3.8 17.96,3.61 17.75,3.43C16.75,2.54 15.4,2 14,2H12M9,13H7V15H9V13M13,13H11V15H13V13M17,13H15V15H17V13Z"/>
    </svg>
  ),
  galaxy: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C10.6,2 9.25,2.54 8.25,3.43C8.04,3.61 7.82,3.8 7.63,4C7,4.35 6.45,4.77 6,5.25C5.17,6.05 4.5,7 4.5,8C4.5,8.24 4.54,8.47 4.59,8.69C3.93,9.12 3.5,9.75 3.5,10.5V12.5C3.5,12.89 3.67,13.24 3.93,13.5C3.67,13.76 3.5,14.11 3.5,14.5V16C3.5,17.1 4.4,18 5.5,18H6.68C7.04,18.58 7.56,19 8.13,19H10C10.54,19 11.04,18.64 11.37,18.18C11.71,18.62 12.19,18.94 12.75,19H14.63C15.19,19 15.69,18.62 16,18.15C16.31,18.62 16.78,19 17.31,19H19C19.55,19 20,18.56 20.32,18H21.5C22.6,18 23.5,17.1 23.5,16V14.5C23.5,14.11 23.33,13.76 23.07,13.5C23.33,13.24 23.5,12.89 23.5,12.5V10.5C23.5,9.75 23.07,9.12 22.41,8.69C22.46,8.47 22.5,8.24 22.5,8C22.5,7 21.83,6.05 21,5.25C20.55,4.77 20,4.35 19.37,4C19.18,3.8 18.96,3.61 18.75,3.43C17.75,2.54 16.4,2 15,2H12M6.5,11A1.5,1.5 0 0,0 5,12.5A1.5,1.5 0 0,0 6.5,14A1.5,1.5 0 0,0 8,12.5A1.5,1.5 0 0,0 6.5,11M10.5,5A1.5,1.5 0 0,0 9,6.5A1.5,1.5 0 0,0 10.5,8A1.5,1.5 0 0,0 12,6.5A1.5,1.5 0 0,0 10.5,5M13.5,5A1.5,1.5 0 0,0 12,6.5A1.5,1.5 0 0,0 13.5,8A1.5,1.5 0 0,0 15,6.5A1.5,1.5 0 0,0 13.5,5M17.5,11A1.5,1.5 0 0,0 16,12.5A1.5,1.5 0 0,0 17.5,14A1.5,1.5 0 0,0 19,12.5A1.5,1.5 0 0,0 17.5,11Z"/>
    </svg>
  ),
  handshake: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.89,15.7L18,14L16.28,14.54L15.67,16.22L17.34,16.83L18,18L18.89,15.7M17.34,10.17L15.67,10.78L16.28,12.46L18,13L18.89,11.3L17.34,10.17M11.3,18.89L13,18L14.54,16.28L16.22,15.67L16.83,17.34L18,18L15.7,18.89L14,18L12.46,19.72L10.78,20.33L10.17,18.66L9,18L11.3,18.89M10.17,9.66L10.78,7.94L12.46,7.33L14,6L15.7,6.89L18,6L16.83,9.83L16.22,11.33L14.54,10.72L13,10L11.3,10.89L10.17,9.66M21,11C21,11.93 20.5,12.78 19.74,13.31C19.74,13.31 19.73,13.32 19.73,13.32L17,14.65V12.35L19.73,11C19.73,11 19.73,11 19.73,11C20.5,10.45 21,9.61 21,8.67C21,7.2 19.88,6 18.5,6C17.12,6 16,7.2 16,8.67C16,9.26 16.22,9.82 16.6,10.27L14.5,11L14,9L12,8L10,9L9.5,11L7.4,10.27C7.78,9.82 8,9.26 8,8.67C8,7.2 6.88,6 5.5,6C4.12,6 3,7.2 3,8.67C3,9.61 3.5,10.45 4.27,11C4.27,11 4.27,11 4.27,11L7,12.35V14.65L4.27,13.32C4.27,13.32 4.26,13.31 4.26,13.31C3.5,12.78 3,11.93 3,11C3,9.07 4.58,7.5 6.5,7.5C8.42,7.5 10,9.07 10,11L10.5,13L12,14L13.5,13L14,11C14,9.07 15.58,7.5 17.5,7.5C19.42,7.5 21,9.07 21,11Z"/>
    </svg>
  ),
  globe: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C17.5,2 22,6.5 22,12C22,17.5 17.5,22 12,22C6.5,22 2,17.5 2,12C2,6.5 6.5,2 12,2M12,4C9.5,4 7.2,4.9 5.5,6.5C7.1,5.5 9,5 11,5C14.3,5 17.1,6.5 18.5,8.5C17.2,6.5 14.8,5 12,5C11.5,5 11,5 10.5,5.1C10,6.3 9.1,7.3 8,8C8.5,7.9 9,7.8 9.5,7.8C12.3,7.8 14.8,8.8 16.5,10.5C14.9,9.5 13.1,9 11,9C8.7,9 6.8,10 5.5,11.5C6.1,10.7 6.9,10.1 7.8,9.5C7.3,10.7 6.9,12 6.9,13.3C6.9,13.8 6.9,14.3 7,14.8C6.4,14.5 5.9,14.1 5.5,13.5C4.9,12.8 4.5,11.9 4.2,11C4.1,11.3 4,11.7 4,12C4,16.4 7.6,20 12,20C16.4,20 20,16.4 20,12C20,7.6 16.4,4 12,4Z"/>
    </svg>
  ),
  shield: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"/>
    </svg>
  ),
  laptop: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z"/>
    </svg>
  ),
  'x-ray': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8,8H6V10H4V12H6V14H8V12H10V10H8V8M14,10H12V12H14V10M14,8H12V10H14V8M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M18,18H6V6H18V18Z"/>
    </svg>
  ),
  // Outline
  home: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M21 12v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 21v-9" />
    </svg>
  ),
  document: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  station: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  practice: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  admin: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  ),
  settings: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226a12.021 12.021 0 013.585 0c.55.219 1.02.684 1.11 1.226a12.008 12.008 0 01-3.585 16.12c-.55.219-1.02.684-1.11 1.226a12.021 12.021 0 01-3.585 0c-.55-.219-1.02-.684-1.11-1.226A12.008 12.008 0 019.594 3.94zM12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  ),
  trophy: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 009 0zM19.5 9.75c0 1.316-.316 2.583-.878 3.75m-13.244 0c-.562-1.167-.878-2.434-.878-3.75m15 0a9 9 0 00-9-9 9 9 0 00-9 9m18 0h-3.375a9.002 9.002 0 01-11.25 0H3.75z" />
    </svg>
  ),
  flame: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 00-2.433-1.516c1.562-.433 3.28.006 4.432 1.516z" />
    </svg>
  ),
  clock: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  checkmark: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  arrowRight: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  ),
  arrowLeft: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  ),
  arrowUp: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  ),
  arrowDown: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  stethoscope: (props) => ( // Updated, reliable solid stethoscope
     <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 3H6c-1.1 0-2 .9-2 2v2.17c0 1.13.59 2.13 1.5 2.67V18c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2v-5h4v5c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V9.83c.91-.54 1.5-1.54 1.5-2.66V5c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v2.17c0 .59-.21 1.16-.58 1.62-.21.26-.5.41-.82.41H9.9c-.32 0-.61-.15-.82-.41-.37-.46-.58-1.03-.58-1.62V5c0-1.1-.9-2-2-2z"/>
    </svg>
  ),
  book: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  users: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  ),
  user: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  edit: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  trash: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  plus: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  search: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  question: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
  alert: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  calendar: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
    </svg>
  ),
  documentManagement: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m9.375 0V9.375c0 .621-.504 1.125-1.125 1.125h-1.5" />
    </svg>
  ),
  beaker: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v.75c0 .621-.504 1.125-1.125 1.125H6.125c-.621 0-1.125-.504-1.125-1.125v-.75m13.375-9.396c.252.023.502.05.75.082m-14.875 0c.252.023.502.05.75.082" />
    </svg>
  ),
  close: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  feedback: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  'arrow-uturn-left': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  ),
  refresh: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l4.992-4.993m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183" />
    </svg>
  ),
  eye: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.418-5.523A1.875 1.875 0 018.322 5.5h7.356a1.875 1.875 0 011.867 1.168l4.418 5.523a1.012 1.012 0 010 .639l-4.418 5.523A1.875 1.875 0 0115.678 18.5H8.322a1.875 1.875 0 01-1.867-1.168L2.036 12.322z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'eye-slash': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
  ),
  'academic-cap': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.072-1.036A48.421 48.421 0 0112 4.56a48.421 48.421 0 0110.072 4.551l-2.072 1.036m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
  ),
  // New Outline Icons
  'chart-bar': (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  compass: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 8.352a4.5 4.5 0 00-6.262 6.262m6.262-6.262L8.352 15.91m0 0l2.828-5.657" />
    </svg>
  ),
};

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  const SvgIcon = icons[name];
  if (!SvgIcon) {
    console.warn(`Icon "${name}" not found.`);
    return null; // or a fallback icon
  }
  return <SvgIcon className={className} />;
};
