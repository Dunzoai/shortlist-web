'use client';

import { useStyle } from './StyleContext';

export default function StyleToggle() {
  const { styleMode, toggleStyle } = useStyle();

  return (
    <button
      onClick={toggleStyle}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
      style={{
        backgroundColor: styleMode === 'dark' ? '#FFFBF5' : '#1B365D',
        color: styleMode === 'dark' ? '#3D3D3D' : '#FFFFFF',
      }}
      aria-label="Toggle color scheme"
    >
      <span className={styleMode === 'dark' ? 'opacity-100' : 'opacity-40'}>Dark</span>
      <span className="text-[#C4A25A]">|</span>
      <span className={styleMode === 'light' ? 'opacity-100' : 'opacity-40'}>Light</span>
    </button>
  );
}
