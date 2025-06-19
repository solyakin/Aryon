# Cloud Security Recommendations Dashboard

A modern web application for managing and tracking cloud security recommendations across multiple cloud providers. Built with React, TypeScript, and Vite.

## Setup and Installation

1. **Prerequisites**

   - Node.js 18 or higher
   - npm or yarn

2. **Installation**

   ```bash
   # Clone the repository
   git clone [https://github.com/solyakin/Aryon]
   cd Aryon

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env
   ```

3. **Development**

   ```bash
   # Start development server
   npm run dev

   # Build for production
   npm run build
   ```

## Key Design Choices

1. **Technology Stack**

   - React 18+ with TypeScript for type safety
   - Vite for fast development and building
   - TanStack Query for server state management
   - Context API for application state
   - React Testing Library for component testing
   - Tailwind CSS for styling

2. **Architecture**

   - Component-based architecture with reusable UI components
   - Context-based state management for user and recommendations data
   - Error boundary implementation for graceful error handling
   - Responsive design for mobile and desktop
   - Accessibility-first approach with ARIA attributes

3. **Security Features**
   - Protected routes with authentication
   - HTTP request interceptors
   - Token-based authentication
   - Secure error handling

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## Feature Descriptions

1. **Dashboard Overview**

   - Real-time security recommendations
   - Filtering by cloud provider, framework, and category
   - Search functionality with debouncing
   - Value score visualization
   - Impact assessment metrics

2. **Recommendation Management**

   - Detailed view of each recommendation
   - Archive/Unarchive functionality
   - Compliance framework tracking
   - Resource impact analysis
   - Further reading and documentation links

3. **Cloud Provider Integration**

   - Support for AWS, Azure, and Google Cloud
   - Provider-specific recommendation details
   - Cross-provider policy management
   - Resource identification and tracking

4. **User Interface**
   - Responsive design for all devices
   - Accessible components with ARIA support
   - Dark/Light mode support
   - Loading states and error handling
   - Toast notifications for user feedback

## Testing

1. **Running Tests**

   ```bash
   # Run all tests
   npm run test

   # Run tests with coverage
   npm run test:coverage

   # Run tests in watch mode
   npm run test:watch
   ```

2. **Test Structure**

   - Unit tests for components
   - Integration tests for API calls
   - Context provider tests
   - Accessibility tests
   - Mock service worker for API mocking

3. **Testing Guidelines**
   - Write tests for new components
   - Maintain test coverage above 80%
   - Follow AAA pattern (Arrange, Act, Assert)
   - Test accessibility features
   - Mock external dependencies

## Contributing

1. **Development Workflow**

   - Fork the repository
   - Create a feature branch
   - Write tests for new features
   - Submit a pull request

2. **Code Style**

   - Follow TypeScript best practices
   - Use ESLint and Prettier for formatting
   - Write meaningful commit messages
   - Document new features and changes

3. **Adding New Features**

   - Create new components in appropriate folders
   - Update tests and documentation
   - Follow existing patterns and conventions
   - Consider accessibility and responsiveness

4. **Quality Checks**

   ```bash
   # Run linting
   npm run lint

   # Run type checking
   npm run type-check

   # Format code
   npm run format
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components
│   └── dashboard/    # Dashboard-specific components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and services
├── pages/            # Route components
└── test/            # Test files
```

## Configuration

1. **Environment Variables**

   ```env
   VITE_API_URL=https://aronserver-2.onrender.com
   ```

2. **ESLint Configuration**

   ```js
   // eslint.config.js
   export default tseslint.config({
     extends: [
       ...tseslint.configs.recommendedTypeChecked,
       ...tseslint.configs.strictTypeChecked,
     ],
     // ... rest of the configuration
   });
   ```

3. **TypeScript Configuration**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "skipLibCheck": true,
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noFallthroughCasesInSwitch": true
     },
     "include": ["src"],
     "references": [{ "path": "./tsconfig.node.json" }]
   }
   ```

## License

