'use client';

import { createContext, useContext } from 'react';
import type { WebClient } from './getClient';

interface ClientContextType {
  client: WebClient | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

interface ClientProviderProps {
  client: WebClient | null;
  children: React.ReactNode;
}

/**
 * Provider component that makes client data available throughout the app
 * This should wrap your app in the root layout
 */
export function ClientProvider({ client, children }: ClientProviderProps) {
  return (
    <ClientContext.Provider value={{ client }}>
      {children}
    </ClientContext.Provider>
  );
}

/**
 * Hook to access client data anywhere in the app
 * @returns The current client data (colors, business name, slug, etc.)
 * @throws Error if used outside of ClientProvider
 *
 * @example
 * function MyComponent() {
 *   const { client } = useClient();
 *   return <div style={{ color: client?.primary_color }}>Hello</div>;
 * }
 */
export function useClient(): ClientContextType {
  const context = useContext(ClientContext);

  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }

  return context;
}
