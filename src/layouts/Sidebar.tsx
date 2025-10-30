/**
 * src/layouts/Sidebar.tsx
 *
 * Sidebar navigation links derived from routes config.
 * Filters out routes hidden from nav.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { routes } from '../routes';

const Sidebar: React.FC = () => (
  <nav className="w-64 bg-gray-200 dark:bg-gray-900 min-h-screen p-4">
    <ul className="space-y-4">
      {routes
        .filter(({ name, hideInNav }) => !hideInNav && name)
        .map(({ path, name }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-primary text-background font-semibold'
                  : 'block px-3 py-2 rounded hover:bg-primary hover:text-background transition'
              }
            >
              {name}
            </NavLink>
          </li>
        ))}
    </ul>
  </nav>
);

export default Sidebar;
