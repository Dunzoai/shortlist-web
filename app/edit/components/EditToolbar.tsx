'use client';

import { useEditMode } from '../EditModeContext';

export default function EditToolbar() {
  const { isEditing, setEditing, saveStatus } = useEditMode();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2">
      {/* Save status pill */}
      {saveStatus !== 'idle' && (
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
            saveStatus === 'saving'
              ? 'bg-blue-600 text-white'
              : saveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
          }`}
        >
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Saved \u2713'}
          {saveStatus === 'error' && 'Save failed'}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setEditing(!isEditing)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-xl transition-colors ${
          isEditing
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-300 border border-gray-700'
        }`}
        title={isEditing ? 'Switch to Preview' : 'Switch to Edit'}
      >
        {isEditing ? '\u270F' : '\uD83D\uDC41'}
      </button>
    </div>
  );
}
