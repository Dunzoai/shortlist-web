'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type StyleMode = 'dark' | 'light';

interface StyleContextType {
  styleMode: StyleMode;
  setStyleMode: (mode: StyleMode) => void;
  toggleStyle: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    background: string;
    backgroundAlt: string;
  };
}

const darkColors = {
  primary: '#1B365D',
  secondary: '#C4A25A',
  accent: '#D6BFAE',
  text: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  background: '#1B365D',
  backgroundAlt: '#152a4a',
};

const lightColors = {
  primary: '#FFFBF5',
  secondary: '#C4A25A',
  accent: '#D6BFAE',
  text: '#3D3D3D',
  textMuted: 'rgba(61, 61, 61, 0.6)',
  background: '#FFFBF5',
  backgroundAlt: '#F5F0E8',
};

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export function StyleProvider({ children }: { children: ReactNode }) {
  // Always use dark mode (style toggle has been removed)
  const [styleMode] = useState<StyleMode>('dark');

  const setStyleMode = (mode: StyleMode) => {
    // No-op: style toggle disabled
  };

  const toggleStyle = () => {
    // No-op: style toggle disabled
  };

  const colors = darkColors;

  return (
    <StyleContext.Provider value={{ styleMode, setStyleMode, toggleStyle, colors }}>
      {children}
    </StyleContext.Provider>
  );
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (context === undefined) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
}
