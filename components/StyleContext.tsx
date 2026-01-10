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
  const [styleMode, setStyleModeState] = useState<StyleMode>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('styleMode') as StyleMode;
    if (saved) {
      setStyleModeState(saved);
    }
  }, []);

  const setStyleMode = (mode: StyleMode) => {
    setStyleModeState(mode);
    localStorage.setItem('styleMode', mode);
  };

  const toggleStyle = () => {
    const newMode = styleMode === 'dark' ? 'light' : 'dark';
    setStyleMode(newMode);
  };

  const colors = styleMode === 'dark' ? darkColors : lightColors;

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
