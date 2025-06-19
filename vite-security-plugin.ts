import type { Plugin } from 'vite';
import { getCSPDirectives } from './src/lib/security';

export function securityHeaders(): Plugin {
  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Add security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader(
          'Permissions-Policy',
          'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
        );
        
        // Add CSP header
        res.setHeader('Content-Security-Policy', getCSPDirectives());
        
        next();
      });
    },
    transformIndexHtml(html) {
      // Inject CSP meta tag for deployments where headers can't be set
      const csp = getCSPDirectives();
      return html.replace(
        '</head>',
        `<meta http-equiv="Content-Security-Policy" content="${csp}" /></head>`
      );
    },
  };
}
