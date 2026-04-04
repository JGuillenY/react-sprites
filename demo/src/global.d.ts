// Global type declarations for the demo

// Add gc to Window interface for Chrome memory testing
interface Window {
  gc?: () => void;
}

// Declare module for CSS imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}