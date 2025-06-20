// CSP Directives configuration
export const getCSPDirectives = () => {
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // For React dev tools and Vite HMR
    'style-src': ["'self'", "'unsafe-inline'"], // For styled-components and inline styles
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "data:", "https:"],
    'connect-src': [
      "'self'",
      process.env.NODE_ENV === 'development' ? 'ws:' : '', // For WebSocket in development
      'https://*.vercel.app', // For Vercel deployments
      'https://aronserver-2.onrender.com', // API domain
    ],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  // Clean up empty values and join with spaces
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.filter(Boolean).join(' ')}`;
    })
    .join('; ');
};
