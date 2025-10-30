/**
 * src/pages/NotFound.tsx
 * 
 * 404 page when route is not found.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <section className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-secondary">
    <h2 className="text-4xl font-bold text-error">404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <Link
      to="/"
      className="px-5 py-2 bg-primary text-background rounded hover:bg-primary/80 transition"
    >
      Go Home
    </Link>
  </section>
);

export default NotFound;
